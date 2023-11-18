/**
 * Starts intro animation for contents within the specified element.
 * @param element A DOM element.
 * @param trigger A string specifying the type of event, which is matched against whitespace-seperated list of values of the `animate-on` attribute.
 * @param scope A CSS selector which when specified, any descendant elements which are also descendant of such elements will be excluded from animation.
 * @param autoStart Whether newly matched elements should be animated automatically without needs for calling {@link animateIn} again.
 * @returns A promise that resolves when all animations are completed, or after 1.5 seconds timeout.
 */
export function animateIn(element: Element, trigger: string, scope?: string, autoStart?: boolean): Promise<void>;

/**
 * Starts intro animation for contents within the specified element.
 * @param element A DOM element.
 * @param trigger A string specifying the type of event, which is matched against whitespace-seperated list of values of the `animate-on` attribute.
 * @param scope A CSS selector which when specified, any descendant elements which are also descendant of such elements will be excluded from animation.
 * @param filterCallback Callback to filter out target elements to be animated.
 * @returns A promise that resolves when all animations are completed, or after 1.5 seconds timeout.
 */
export function animateIn(element: Element, trigger: string, scope: string, filterCallback: (elm: Element) => boolean): Promise<void>;

/**
 * Starts outro animation for contents within the specified element.
 * @param element A DOM element.
 * @param trigger A string specifying the type of event, which is matched against whitespace-seperated list of values of the `animate-on` attribute.
 * @param scope A CSS selector which when specified, any descendant elements which are also descendant of such elements will be excluded from animation.
 * @param filterCallback Optional callback to filter out target elements to be animated.
 * @param excludeSelf Whether the supplied element should be excluded from being animated.
 * @returns A promise that resolves when all animations are completed, or after 1.5 seconds timeout.
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
