/// <reference path="./types.d.ts" />

import { AppInit, WithExtension } from "./app";

export interface DisposableAppInit<U = {}> {
    /**
     * Initialize a disposable app instance.
     * The disposable app instance will become ready once all promises registered through {@link Brew.AppInstance.beforeInit}
     * during the init callback are all settled.
     * @param init Callback to initialize before disposable app starts.
     */
    <T = {}>(init: (app: Brew.DisposableAppInstance<T & U>) => void): Brew.DisposableAppInstance<T & U>;
}

export interface DisposableAppFactory {
    /**
     * Creates a temporary app instance which extends the base app instance with additional extensions.
     *
     * The created app instance will automatically listen for events emitted on the base app instance.
     * Enabling extensions that have already been enabled on the base app would result in exceptions.
     *
     * Use this feature with caution when the extensions have side effects such as registering global resources or DOM events, as the cleanup of these side effects is not guaranteed,
     * which may result in conflicting or unexpected behaviors.
     *
     * @param baseApp An app instance to be extended. It will not be modified.
     * @param args A list of extensions and a callback to initialize the disposable app instance.
     */
    disposableWith<T extends any[], U>(baseApp: Brew.AppInstance<U>, ...args: T): DisposableAppInit<U & WithExtension<T>>;
    /**
     * Creates a temporary app instance.
     *
     * Use this feature with caution when the extensions have side effects such as registering global resources or DOM events, as the cleanup of these side effects is not guaranteed,
     * which may result in conflicting or unexpected behaviors.
     *
     * @param args A list of extensions and a callback to initialize the disposable app instance.
     */
    disposableWith<T extends any[]>(...args: T): DisposableAppInit<WithExtension<T>>;
}

declare const brew: AppInit & DisposableAppFactory;
export default brew;
