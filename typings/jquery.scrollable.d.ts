interface JQueryScrollableScrollbarOptions {
    scrollbarClass?: string;
    scrollbarInset?: number;
    scrollbarSize?: number;
    scrollbarStyle?: Partial<CSSStyleDeclaration>;
    scrollbarTrackStyle?: Partial<CSSStyleDeclaration>;
}

interface JQueryScrollableGrowOptions {
    glowClass?: string;
    glowStyle?: Partial<CSSStyleDeclaration>;
}

interface JQueryScrollableEvent {
    type: string;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    deltaX: number;
    deltaY: number;
    percentX: number;
    percentY: number;
    pageIndex: number;
    pageItem: Element | null;
}

interface JQueryScrollableOptions extends JQueryScrollableScrollbarOptions, JQueryScrollableScrollbarOptions {
    content: string;
    cancel: string;
    getWrapperDimension: (elm: Element) => { width: number; height: number; },
    getContentDimension: (elm: Element) => { width: number; height: number; },
    handle: 'auto' | 'scrollbar' | 'content',
    hScroll: boolean;
    vScroll: boolean;
    hGlow: boolean;
    vGlow: boolean;
    bounce: boolean;
    hBounce: boolean;
    vBounce: boolean;
    bounceDuration: number;
    momentum: boolean;
    lockDirection: boolean;
    scrollingClass: string;
    scrollableXClass: string;
    scrollableYClass: string;
    scrollbar: (elm: JQuery, dir: 'x' | 'y', options: JQueryScrollableScrollbarOptions) => Element | JQuery,
    glow: (elm: JQuery, dir: 'x' | 'y', options: JQueryScrollableGrowOptions) => Element | JQuery,
    pageItem: string;
    pageItemAlign: 'center' | 'left' | 'right' | 'top' | 'bottom';
    pageDirection: 'auto' | 'x' | 'y';
    snapToPage: boolean;
    sticky: string;
    stickyHandle: string;
    stickyToBottom: boolean;
    stickyClass: string;
    touchMove: (e: JQueryScrollableEvent) => void,
    scrollStart: (e: JQueryScrollableEvent) => void,
    scrollMove: (e: JQueryScrollableEvent) => void,
    scrollStop: (e: JQueryScrollableEvent) => void,
    scrollEnd: (e: JQueryScrollableEvent) => void
}

interface JQueryScrollableMethod<TThis> {
    refresh(): TThis;
    enable(): TThis;
    disable(): TThis;
    stop(): TThis;
    destroy(): TThis;
    setOptions(options: Partial<JQueryScrollableOptions>): TThis;
    scrollLeft(): number;
    scrollTop(): number;
    scrollPadding(): Record<'top' | 'left' | 'right' | 'bottom', number>;
    scrollTo(x: number, y: number, duration?: number, callback?: () => any): TThis;
    scrollBy(x: number, y: number, duration?: number, callback?: () => any): TThis;
    scrollToPage(x: number, y: number, duration?: number, callback?: () => any): TThis;
    scrollToElement(target: Element | string, targetOrigin: string, wrapperOrigin: string, duration?: number, callback?: () => any): TThis;
}

interface JQuery<TElement = Element> {
    scrollable(options: Partial<JQueryScrollableOptions>): JQuery<TElement>;
    scrollable<T extends keyof JQueryScrollableMethod<this>>(this: this, method: T, ...args: Parameters<JQueryScrollableMethod<this>[T]>): ReturnType<JQueryScrollableMethod<this>[T]>;
}
