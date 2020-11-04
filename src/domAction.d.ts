/**
 * @param attr
 * @param callback
 */
export function addAsyncAction(attr: string, callback: (this: Element, e: JQuery.UIEventBase) => Brew.PromiseOrEmpty): void;

/**
 * Closes flyout and optionally passes result to the caller.
 * @param flyout A DOM element or a CSS selector that refers to a flyout.
 * @param value Value that will be passed as the resolved value of the promise returned by `openFlyout`.
 */
export function closeFlyout(flyout?: Element | string, value?: any): void;

/**
 * Opens or toggles flyout and returns a promise that when resolved, receives the value passed to `closeFlyout`.
 * @param selector A DOM element or a CSS selector that refers to a flyout.
 * @param states Any values that will be passed to `brew.setVar`, when the flyout opens.
 * @param source Source element which triggered the flyout.
 * @param closeIfOpened Close the flyout if it is already opened.
 */
export function openFlyout(selector: Element | string, states?: any, source?: Element, closeIfOpened?: boolean): Promise<any>;
