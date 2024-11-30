type DirectiveType<T extends Directive> = DirectiveTypeMap[T['type'] extends keyof DirectiveTypeMap ? T['type'] : 'string'];

interface DirectiveTypeMap {
    boolean: boolean;
    number: number | null;
    string: string | null;
}

export interface ComponentContextEventMap {
    destroy: Zeta.ZetaEvent<ComponentContext>;
}

export interface ComponentContext extends Zeta.ZetaEventDispatcher<ComponentContextEventMap, ComponentContext> {
}

export interface DirectiveInit<T extends Zeta.Dictionary<Directive> = {}> {
    /**
     * Initialize callback for element matching a specific selector.
     * The callback should return an interface to expose APIs on the object returned by {@link getDirectiveComponent}.
     */
    component: (element: Element, context: ComponentContext & Zeta.WatchableInstance<{ [P in keyof T]: DirectiveType<T[P]> }>) => object;
    /**
     * A dictionary where each entry maps a context property to a DOM attribute.
     */
    directives?: T;
}

export interface Directive {
    /**
     * Name of the attribute to be mapped.
     */
    attribute: string;
    /**
     * Type of the mapped value. Default is `string`.
     */
    type?: keyof DirectiveTypeMap;
}

/**
 * Register a directive plugin.
 * @param key A unique name that expose the plugin on the object returned by {@link getDirectiveComponent}.
 * @param selector A valid CSS selector that matches elements to have the plugin initialized for.
 * @param options A dictionary specifying options.
 */
export function registerDirective<T extends Zeta.Dictionary<Directive> = {}>(key: string, selector: string, options: DirectiveInit<T>): void;

/**
 * Register a simple directive.
 * @param key A unique name that expose the enabled flag on the object returned by {@link getDirectiveComponent}.
 * @param selector Attribute name.
 * @param init Callback for initialization. A dispose callback can be returned to clean up when the element is detached or the directive is removed from the element.
 */
export function registerSimpleDirective(key: string, attr: string, init: (element: Element) => Zeta.UnregisterCallback | undefined): void;

/**
 * Register a simple directive.
 * @param key A unique name that expose the enabled flag on the object returned by {@link getDirectiveComponent}.
 * @param selector Attribute name.
 * @param init Callback for initialization.
 * @param dispose Callback for cleaning up when the element is detached or the directive is removed from the element.
 */
export function registerSimpleDirective(key: string, attr: string, init: (element: Element) => void, dispose: (element: Element) => void): void;

/**
 * Gets the plugin initialized for a given element.
 * @param element A DOM element.
 */
export function getDirectiveComponent(element: Element): Brew.DirectiveComponent;
