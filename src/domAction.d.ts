/**
 * @param attr
 * @param callback
 */
export function addAsyncAction(attr: string, callback: (this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty): void;

/**
 * Gets whether a flyout is open.
 *
 * Note that flyout is considered not open once flyout is instructed to hide even through
 * it is still visible when outro animation is running.
 *
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 */
export function isFlyoutOpen(selector: Element | string): boolean;

/**
 * Closes flyout and optionally passes result to the caller.
 * @param flyout A DOM element or a CSS selector that refers to a flyout.
 * @param value Value that will be passed as the resolved value of the promise returned by `openFlyout`.
 * @returns A promise object that is resolved after flyout is closed.
 */
export function closeFlyout(flyout?: Element | string, value?: any): Promise<void>;

export interface FlyoutOptions {
    /**
     * Whether the flyout should be closed when flyout, or source element if given, loses focus.
     * Default is `true` if flyout is not dismissible by swipe gesture.
     */
    closeOnBlur?: boolean;
    /**
     * Whether flyout content will be focused.
     * Default is `true` if source element is not an text input element.
     */
    focus?: boolean;
    /**
     * Whether flyout element will be set as modal.
     * Default is `false`.
     */
    modal?: boolean;
    /**
     * Whether element outside flyout can be focused by pressing tab key.
     * Default is `false`.
     */
    tabThrough?: boolean;
}

/**
 * Opens flyout and returns a promise that when resolved, receives the value passed to `closeFlyout`.
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 * @param source Source element which triggered the flyout.
 * @param options A dictionary containing options to alter flyout's behavior.
 */
export function openFlyout(selector: Element | string, source?: Element | null, options?: FlyoutOptions): Promise<any>;

/**
 * Opens flyout and returns a promise that when resolved, receives the value passed to `closeFlyout`.
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 * @param states Any values that will be passed to `brew.setVar`, when the flyout opens.
 * @param source Source element which triggered the flyout.
 * @param options A dictionary containing options to alter flyout's behavior.
 */
export function openFlyout(selector: Element | string, states: any, source?: Element | null, options?: FlyoutOptions): Promise<any>;

/**
 * Opens or toggles flyout and returns a promise that when resolved, receives the value passed to `closeFlyout`.
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 * @param states Any values that will be passed to `brew.setVar`, when the flyout opens.
 * @param source Source element which triggered the flyout.
 * @param closeIfOpened Close the flyout if it is already opened.
 * @deprecated Use {@link toggleFlyout} instead.
 */
export function openFlyout(selector: Element | string, states: any, source: Element | null, closeIfOpened: boolean): Promise<any>;

/**
 * Toggles flyout and returns a promise that when resolved, receives the value passed to `closeFlyout`.
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 * @param source Source element which triggered the flyout.
 */
export function toggleFlyout(selector: Element | string, source?: Element): Promise<any>;
