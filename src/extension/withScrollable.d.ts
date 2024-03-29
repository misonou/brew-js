declare namespace Brew {
    /* -------------------------------------------------------------
     * useScrollable
     * ------------------------------------------------------------- */
    type ScrollableEventMap = {
        scrollStart: ScrollableEvent;
        scrollMove: ScrollableEvent;
        scrollStop: ScrollableEvent;
        scrollProgressChange: ScrollableEvent;
        scrollIndexChange: ScrollableIndexChangeEvent;
    }

    interface ScrollableEvent extends Zeta.ZetaEvent {
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

    interface ScrollableIndexChangeEvent extends Zeta.ZetaEvent {
        readonly oldIndex: number;
        readonly newIndex: number;
    }

    interface WithScrollable extends EventDispatcher<keyof ScrollableEventMap, ScrollableEventMap> {
        /**
         * Enables auto scrollable area initialization and scrolling events.
         * Requires the scrollable plugin https://github.com/misonou/jquery-scrollable.
         */
        useScrollable(defaultOptions?: Partial<Omit<JQueryScrollableOptions, 'content' | 'handle' | 'hScroll' | 'vScroll' | 'pageItem' | 'snapToPage' | 'scrollStart' | 'scrollMove' | 'scrollEnd' | 'scrollProgressChange'>>): void;
    }

    interface DirectiveComponent {
        /**
         * Gets the jQuery scrollable plugin instance if the element has the `scrollable` attribute
         */
        readonly scrollable: JQueryScrollable | null;
    }
}
