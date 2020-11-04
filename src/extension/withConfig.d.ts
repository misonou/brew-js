declare namespace Brew {
    /* ------------------------------------------------------------- 
     * useConfig
     * ------------------------------------------------------------- */
    interface WithConfig<T = any> {
        /**
         * Gets the instance of configuration object loaded from JSON file.
         */
        readonly config: Zeta.WatchableInstance<T>;

        /**
         * Loads configurations from a JSON file at the given path.
         * @param options 
         */
        useConfig(options: ConfigOptions<T>): void;
    }

    interface ConfigOptions<T> {
        /**
         * Specifies location of JSON file.
         */
        path: string,
        /**
         * Specifies whether the configuration object can be altered.
         */
        freeze?: boolean,
        /**
         * Specifies actions if the resource at the specified path fails to load.
         */
        fallback?: (error: any) => void | Partial<T> | PromiseLike<Partial<T>>
    }
}
