export interface ComponentContextEventMap {
    destroy: Zeta.ZetaEvent;
}

export interface ComponentContext extends Zeta.ZetaEventDispatcher<ComponentContextEventMap, ComponentContext> {
}

export interface DirectiveInit {
    /**
     * Initialize callback for element matching a specific selector.
     * The callback should return an interface to expose APIs on the object returned by {@link getDirectiveComponent}.
     */
    component: (element: Element, context: ComponentContext) => object;
}

/**
 * Register a directive plugin.
 * @param key A unique name that expose the plugin on the object returned by {@link getDirectiveComponent}.
 * @param selector A valid CSS selector that matches elements to have the plugin initialized for.
 * @param options A dictionary specifying options.
 */
export function registerDirective(key: string, selector: string, options: DirectiveInit): void;

/**
 * Gets the plugin initialized for a given element.
 * @param element A DOM element.
 */
export function getDirectiveComponent(element: Element): Brew.DirectiveComponent;
