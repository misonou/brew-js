namespace Brew {
    interface WithTemplate {
        /**
         * Gets template variables defined on the specified element.
         * @param element A DOM element.
         */
        getVar(element: Element): Zeta.Dictionary;

        /**
         * Gets the value of a single template variable on the specified element.
         * @param element A DOM element.
         * @param name Name of the variable.
         */
        getVar(element: Element, name: string): any;

        /**
         * Gets template variables directly defined on the specified element.
         * @param element A DOM element.
         * @param ownKeys A boolean true value.
         */
        getVar(element: Element, ownKeys: true): any;

        /**
         * Sets template variables on the specified element base on its `set-var` attribute.
         * If any variables are declared on parent elements, values will be set on those parent elements.
         * @param element A DOM element or a valid CSS selector.
         */
        setVar(element: Element | string): boolean;

        /**
         * Sets template variables on the specified element.
         * If any variables are declared on parent elements, values will be set on those parent elements.
         * @param element A DOM element or a valid CSS selector.
         * @param values A dictionary containing variables to set.
         */
        setVar(element: Element | string, values: Zeta.Dictionary): boolean;

        /**
         * Sets a single template variable on the specified element.
         * If such variable is declared on parent element, value will be set on that parent element.
         * @param element A DOM element or a valid CSS selector.
         * @param name Name of the variable.
         * @param value New value to be set on the specified variable.
         */
        setVar(element: Element | string, name: string, value: any): boolean;

        /**
         * Registers handler to perform asychronous operations when DOM is about to change.
         * If the handler returns a promise, DOM changes are delayed until the promise resolves.
         * @param callback A callback function which receives a list of updates.
         */
        beforeUpdate(callback: (domUpdates: Map<Element, DOMUpdateState>) => PromiseOrEmpty): void;

        /**
         * Registers handler to be fired when each matched element is being mounted.
         * @param selector A valid CSS selector identifying elements.
         * @param handler A callback function which receives is the matched element.
         */
        matchElement(selector: string, handler: (element: Element) => void): void;
    }
}
