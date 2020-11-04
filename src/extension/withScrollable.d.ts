declare namespace Brew {
    /* ------------------------------------------------------------- 
     * useScrollable
     * ------------------------------------------------------------- */
    type ScrollableEventMap = {
        scrollStart: ScrollableEvent;
        scrollMove: ScrollableEvent;
        scrollStop: ScrollableEvent;
    }

    interface ScrollableEvent extends ZetaEvent {
        readonly startX: number;
        readonly startY: number;
        readonly offsetX: number;
        readonly offsetY: number;
        readonly deltaX: number;
        readonly deltaY: number;
        readonly percentX: number;
        readonly percentY: number;
        readonly pageIndex: number;
        readonly pageItem: Element | null;
    }

    interface WithScrollable extends EventDispatcher<keyof ScrollableEventMap, ScrollableEventMap> {
        /**
         * Enables auto scrollable area initialization and scrolling events.
         * Requires the scrollable plugin https://github.com/misonou/jquery-scrollable.
         */
        useScrollable(): void;
    }
}
