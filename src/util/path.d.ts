/**
 * Gets the base URL.
 * Any path without protocol or host will be prefixed with the base URL.
 */
export var baseUrl: string;

/**
 * Sets the base URL.
 * Any path without protocol or host will be prefixed with the base URL.
 * @param baseUrl Value to be set.
 */
export function setBaseUrl(baseUrl: string): void;

/**
 * Appends the child path to another path.
 * The resulting path is always normalized.
 * @param path An input path.
 * @param child A child path.
 */
export function combinePath(path: string, child: string): string;

/**
 * Parses a given path to URL parts.
 * @param path An input path.
 */
export function parsePath(path: string): HTMLHyperlinkElementUtils;

/**
 * Returns a path that always starts with a slash but without a trailing slash.
 * For empty path, the result is always a single slash (`/`).
 * @param path An input path.
 * @param resolveDotDir If specified `true`, relative directory segments (`.` and `..`) will also be resolved.
 */
export function normalizePath(path: string, resolveDotDir?: boolean): string;

/**
 * Gets query string and hash from a path or URL.
 * @param path An input path.
 */
export function getQueryAndHash(path: string): string;

/**
 * Removes query string and hash from a path or URL.
 * @param path An input path.
 */
export function removeQueryAndHash(path: string): string;

/**
 * Prepends the base URL if the given url does not start with the base URL.
 * Paths with origins (i.e. protocol and host) are untouched.
 * @param url An input path.
 */
export function withBaseUrl(url: string): string;

/**
 * Returns a path that includes the current origin (i.e. protocol and host).
 * @param url An input path.
 */
export function toAbsoluteUrl(url: string): string;

/**
 * Returns a path that excludes the current origin (i.e. protocol and host).
 * @param url An input path.
 */
export function toRelativeUrl(url: string): string;

/**
 * Checks whether a given path is equal to or is children of another path.
 * @param path A path to test.
 * @param basePath A parent path to test against.
 */
export function isSubPathOf(path: string, basePath: string): string | false;

/**
 * Normalizes a path and returns its segments.
 * If the path is empty or is the root path `/`, an empty array is returned.
 * @param path An input path.
 */
export function toSegments(path: string): string[];
