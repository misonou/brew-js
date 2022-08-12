/// <reference path="withRouter.d.ts" />

import { Extension } from "../core";

declare const router: Extension<Brew.WithRouter>;
export default router;

/**
 * Determines whether a route matches a given path.
 * @param {string} route
 * @param {string} path Path to match.
 * @param {boolean=} ignoreExact Whether to match child paths even though there is no trailing wildcard character in the route.
 */
export function matchRoute(route: string, path: string, ignoreExact?: boolean): boolean;

export function toRoutePath(path: string): string;

export function fromRoutePath(path: string): string;
