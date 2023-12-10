declare namespace Brew {
    interface IdleTimeoutEventMap {
        idle: Zeta.ZetaEvent;
    }

    interface WithIdleTimeout extends EventDispatcher<keyof IdleTimeoutEventMap, IdleTimeoutEventMap> {
        /**
         * Enables idle detection.
         * The `idle` event will be fired after a specified amount time without any user interaction.
         * @param options Options for idle detection extension.
         */
        useIdleTimeout(options: IdleTimeoutOptions): void;
    }

    interface IdleTimeoutOptions {
        /**
         * Number of milliseconds of idle period before `idle` event is fired.
         */
        timeout: number;
        /**
         * Whether user interaction is counted across multiple frames.
         */
        crossFrame?: boolean;
        /**
         * Storage key in local storage when {@link IdleTimeoutOptions.crossFrame} option is enabled.
         * Default is `app.lastInteract`.
         */
        key?: string;
    }
}
