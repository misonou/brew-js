import * as ErrorCode from "../errorCode.js";

export type FetchLayer = (req: Request) => Promise<Response>;
export type FetchMiddleware = (req: Request, next: FetchLayer) => Promise<Response>;
export type RequestOptions = Omit<RequestInit, 'method' | 'body'>;

export interface ApiClientError extends Error {
    /**
     * Gets the type of error.
     *
     * Possible values include
     * - {@link ErrorCode.networkError}
     * - {@link ErrorCode.apiError}
     */
    readonly code: string;
    /**
     * Gets the HTTP status code responded from server.
     */
    readonly status: number;
    /**
     * Gets data parsed from response body; or `undefined` when body cannot be parsed.
     */
    readonly data: any;
    /**
     * Gets error thrown when parsing response body; or `null` when body is parsed successfully.
     */
    readonly error: any;
}

export interface ApiClientTraps {
    /**
     * Specifies callback to transform request or response.
     *
     * The callback is invoked before fetch middlewares registered by {@link ApiClient.use},
     * and the promise returned from `next` callback
     */
    request?: (req: Request, next: (req: Request) => Promise<any>) => any;
    /**
     * Specifies callback to receives and transform data.
     * @param data Data deserialized from response.
     * @param response Response object.
     * @param request Request object associated with the response.
     * @param client Client object that invoked the request.
     */
    data?: (data: any, response: Response, request: Request, client: ApiClient) => any;
    /**
     * Specifies callback to handle request error.
     *
     * The trap is invoked when
     * - response status indicates an HTTP error (400-599), or
     * - failed to parse response payload,
     * - failed to execute request, for example, due to network or CORS issue.
     *
     * If non-`undefined` value is returned, request will be treated as successful and
     * promise will be settled with the returned value. Otherwise the incoming error will be rethrown.
     *
     * @param error Error object.
     * @param response Response object.
     * @param request Request object associated with the response.
     * @param client Client object that invoked the request.
     */
    error?: (error: ApiClientError, response: Response, request: Request, client: ApiClient) => any;
}

export interface ApiClient {
    /**
     * Makes request to an endpoint.
     */
    <T = any>(path: RequestInfo | URL, init?: RequestInit): Promise<T>;
    /**
     * Makes request to an endpoint.
     */
    <T = any>(method: Brew.HTTPMethod, path: string, body?: any, options?: RequestOptions): Promise<T>;

    /**
     * Pushes a middleware into fetch function.
     * @param middleware A callback that infiltrate the request to the last registered middleware.
     *
     * @example
     * ```javascript
     * // injecting header
     * client.use((req, next) => {
     *   req.headers.set('authorization', 'xxxxx');
     *   return next(req);
     * });
     *
     * // transforming response
     * client.use((req, next) => {
     *   return next(req).then(res => {
     *     return res.json().then(data => {
     *       return Response.json(data.d, res);
     *     });
     *   });
     * });
     * ```
     */
    use(middleware: FetchMiddleware): void;

    /**
     * Makes a `GET` request to an endpoint.
     */
    get<T = any>(path: string, options?: RequestOptions): Promise<T>;
    /**
     * Makes a `HEAD` request to an endpoint.
     */
    head<T = any>(path: string, options?: RequestOptions): Promise<T>;
    /**
     * Makes a `POST` request to an endpoint.
     */
    post<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T>;
    /**
     * Makes a `PUT` request to an endpoint.
     */
    put<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T>;
    /**
     * Makes a `PATCH` request to an endpoint.
     */
    patch<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T>;
    /**
     * Makes a `DELETE` request to an endpoint.
     */
    delete<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T>;
}

/**
 * Creates a fetch function that is interceptable with middlewares.
 * @param baseUrl Base URL prepend to relative request path.
 * @param traps A dictionary containing intercepting callback.
 * @description
 * Below illustrates the invocation order of traps and middlewares.
 * ```text
 * request()
 *  |  Λ
 *  V  |
 * traps.request
 *  |  Λ
 *  |  |
 *  |  traps.data (or traps.error)
 *  |  Λ
 *  V  |
 * middleware (last)
 *  |  Λ
 *  :  :
 *  V  |
 * middleware (first)
 *  |  Λ
 *  V  |
 * native fetch
 * ```
 *
 * Client will parse response body according to `Accept` header from request, and fallback to `Content-Type` header from response.
 * See {@link peekBody} for supported header values and associated data types.
 */
export function createApiClient(baseUrl: string, traps?: ApiClientTraps): ApiClient;

/**
 * Reads request or response body.
 * @param input Request or response object. Source body stream is untouched.
 * @returns A promise that resolves to parsed data according to the `Content-Type` header:
 * - deserialized JSON data for `application/json`;
 * - deserialized data as a `FormData` object for `multipart/form-data` or `application/x-www-form-urlencoded`;
 * - decoded string for `text/*`;
 * - binary data as a `Blob` object otherwise.
 */
export function peekBody(input: Request | Response): Promise<any>;
