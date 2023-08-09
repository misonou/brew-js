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

/**
 * Opens or toggles flyout and returns a promise that when resolved, receives the value passed to `closeFlyout`.
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 * @param source Source element which triggered the flyout.
 * @param closeIfOpened Close the flyout if it is already opened.
 * @deprecated Use {@link toggleFlyout} instead.
 */
export function openFlyout(selector: Element | string, states?: any, source?: Element, closeIfOpened?: boolean): Promise<any>;

/**
 * Toggles flyout and returns a promise that when resolved, receives the value passed to `closeFlyout`.
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 * @param source Source element which triggered the flyout.
 */
export function toggleFlyout(selector: Element | string, source?: Element): Promise<any>;
