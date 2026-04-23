/**
 * Indicates failure connecting to the server when using `api()` or `createApiClient()`.
 * It can be caused by network failure, CORS error, or any other reasons that prevents the client from receiving a response from the server.
 */
export declare const networkError: 'brew/network-error';
/**
 * Indicates an error when loading a resource, for example, when using `loadScript()`.
 */
export declare const resourceError: 'brew/resource-error';
/**
 * Indicates an error from server when using `api()` or `createApiClient()`.
 */
export declare const apiError: 'brew/api-error';
/**
 * Indicates a validation failed error when using `[validate]` or [`context-form`] attribute when using `HtmlRouter` extension.
 */
export declare const validationFailed: 'brew/validation-failed';
/**
 * Indicates a navigation is cancelled when the app is navigating to a new path when the current navigation is not completed.
 */
export declare const navigationCancelled: 'brew/navigation-cancelled';
/**
 * Indicates a navigation is rejected:
 * - when the document is locked by `lock()` and the cancellation request is rejected; or
 * - after excessive redirections.
 */
export declare const navigationRejected: 'brew/navigation-rejected';
/**
 * Indicates an operation is timed out. Unused by library itself but can be used by extensions.
 */
export declare const timeout: "brew/timeout";
