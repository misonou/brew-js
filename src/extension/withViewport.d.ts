declare namespace Brew {
    /* -------------------------------------------------------------
     * useViewport
     * ------------------------------------------------------------- */
    type ViewportEventMap = {
        orientationchange: OrientationChangeEvent;
        resize: ResizeEvent;
    }

    interface ViewportEvent extends Zeta.ZetaEventBase {
        readonly aspectRatio: number;
        readonly orientation: 'portrait' | 'landscape';
        readonly viewportHeight: number;
        readonly viewportWidth: number;
    }

    interface OrientationChangeEvent extends ViewportEvent { }

    interface ResizeEvent extends ViewportEvent { }

    interface WithViewport extends EventDispatcher<keyof ViewportEventMap, ViewportEventMap> {
        readonly orientation: 'portrait' | 'landscape';
        readonly aspectRatio: number;
        readonly viewportHeight: number;
        readonly viewportWidth: number;

        /**
         * The viewport module is by default enabled.
         * Call to this method is not required unless `brew.defaults.viewport` is set to `false`.
         */
        useViewport(): void;
    }
}
