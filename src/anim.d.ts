/**
 * @param element
 * @param trigger
 * @param scope
 * @param filterCallback
 */
export function animateIn(element: Element, trigger: string, scope?: string, filterCallback?: (elm: Element) => boolean): Promise<void>;

/**
 * @param element
 * @param trigger
 * @param scope
 * @param filterCallback
 * @param excludeSelf
 */
export function animateOut(element: Element, trigger: string, scope?: string, filterCallback?: (elm: Element) => boolean, excludeSelf?: boolean): Promise<void>;

/**
 * @param name
 * @param callback
 */
export function addAnimateIn(name: string, callback: (elm: Element, attrValue: string) => Promise<any>): void;

/**
 * @param name
 * @param callback
 */
export function addAnimateOut(name: string, callback: (elm: Element, attrValue: string) => Promise<any>): void;
