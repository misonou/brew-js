/**
 * @param target
 */
export function addSelectHandlers(target: string, event: any, handler: any, noChildren: boolean): Zeta.UnregisterCallback;

/**
 * @param selector
 * @param handler
 */
export function matchElement(selector: string, handler: (ele: Element) => void): void;

/**
 * @param callback
 */
export function hookBeforeUpdate(callback: (domChanges: Map<Element, Brew.DOMUpdateState>) => Brew.PromiseOrEmpty): void;

/**
 * @param promise
 * @param element
 * @param callback
 * @deprecated Use `notifyAsync` from `zeta-dom` instead.
 */
export function handleAsync(promise: Brew.PromiseOrEmpty, element?: Element | null, callback?: () => any): Promise<any>;

/**
 * @param element
 */
export function markUpdated(element: Element): void;

/**
 * @param suppressAnim
 */
export function processStateChange(suppressAnim?: boolean): void;

/**
 * Collects all changes and updates DOM in a single pass.
 * @param callback
 */
export function batch(callback: () => void): void;

/**
 * Collects all changes and updates DOM in a single pass.
 * @param suppressAnim
 * @param callback
 */
export function batch(suppressAnim: true, callback: () => void): void;

/**
 * Performs template transformation and triggers `mounted` event for the element.
 * @param element
 */
export function mountElement(element: Element): void;

/**
 * Checks whether the app or browser should prevent leaving the current page.
 * If the current state allows user to leave, a falsy value will be returned.
 * If user dialog is registered to handle the cancallation request of the current app state,
 * such handler will be executed.
 * The returned promise will be rejected if user rejected to leave.
 * @param suppressPrompt Not to trigger dialog to user.
 * @deprecated Use `locked` and `cancelLock` from `zeta-dom` instead.
 */
export function preventLeave(suppressPrompt?: boolean): Brew.PromiseOrEmpty;

/**
 * Adds a named template that is later applied to element with `apply-template` attribute.
 * @param name Name of the template.
 * @param template A DOM node or a valid HTML string. It should not be a DocumentFragment, nor an HTML string containing multiple root elements.
 * @deprecated
 */
export function addTemplate(name: string, template: Node | JQuery.htmlString): void;

export function addTransformer(name: string, callback: Brew.DOMProcessorCallback): void;

export function addRenderer(name: string, callback: Brew.DOMProcessorCallback): void;
