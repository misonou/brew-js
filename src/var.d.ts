/**
 * Gets the element of which the specified variable is declared on.
 * @param element A string containing the variable name.
 * @param element A DOM element.
 */
export function getVarScope(varname: string, element: Element): Element;

/**
 * Sets template variables on the specified element base on its `set-var` attribute.
 * If any variables are declared on parent elements, values will be set on those parent elements.
 * @param element A DOM element or a valid CSS selector.
 */
export function setVar(element: Element | string): boolean;

/**
 * Sets template variables on the specified element.
 * If any variables are declared on parent elements, values will be set on those parent elements.
 * @param element A DOM element or a valid CSS selector.
 * @param values A dictionary containing variables to set.
 */
export function setVar(element: Element | string, values: Zeta.Dictionary): boolean;

/**
 * Sets a single template variable on the specified element.
 * If such variable is declared on parent element, value will be set on that parent element.
 * @param element A DOM element or a valid CSS selector.
 * @param name Name of the variable.
 * @param value New value to be set on the specified variable.
 */
export function setVar(element: Element | string, name: string, value: any): boolean;

/**
 * Declares template variables on the specified element.
 * Values will be set on this element regardless if such variables are already declared on parent elements.
 * @param element A DOM element.
 * @param values A dictionary containing variables to set.
 */
export function declareVar(element: Element, values: Zeta.Dictionary): boolean;

/**
 * Declares a single template variables on the specified element.
 * Value will be set on this element regardless if such variable is already declared on parent element.
 * @param element A DOM element.
 * @param name Name of the variable.
 * @param value New value to be set on the specified variable.
 */
export function declareVar(element: Element, name: string, value: any): boolean;

/**
 * Resets all variables declared on an element to their initial values or `null`.
 * @param element A DOM element.
 * @param resetToNull When specified to `true`, reset the variables to `null` instead of their initial values in `var` and `auto-var` expression.
 */
export function resetVar(element: Element, resetToNull?: boolean): void;

/**
 * Gets template variables defined on the specified element.
 * @param element A DOM element.
 */
export function getVar(element: Element): Zeta.Dictionary;

/**
 * Gets the value of a single template variable on the specified element.
 * @param element A DOM element.
 * @param name Name of the variable.
 */
export function getVar(element: Element, name: string): any;

/**
 * Gets template variables directly defined on the specified element.
 * @param element A DOM element.
 * @param ownKeys A boolean true value.
 */
export function getVar(element: Element, ownKeys: true): any;

/**
 * Evaluates template or expression.
 * @param template A string representing a template or an expression.
 * @param context Context object of which the template or expression is evaluated against.
 * @param element Source element for debug use.
 * @param attrName Source attribute name for debug use.
 * @param templateMode When specified to `true`, the attribute is evaluated as a template instead of an expression.
 * @deprecated Use {@link evalExpression} or {@link evalTemplate} instead.
 */
export function evaluate(template: string, context: any, element: Element, attrName: string, templateMode?: boolean): any;

/**
 * Evaluates an expression.
 * @param template A valid waterpipe expression.
 * @param context Context object of which the template or expression is evaluated against.
 */
export function evalExpression(template: string, context: any): any;

/**
 * Evaluates a template.
 * @param template A valid waterpipe template.
 * @param context Context object of which the template or expression is evaluated against.
 * @param html Whether to parse and return as valid HTML content.
 */
export function evalTemplate(template: string, context: any, html?: boolean): string;

/**
 * Evaluates attribute value of an element as a template or an expression.
 * @param element A DOM element.
 * @param attrName Name of the attribute which to be evaluated.
 * @param templateMode When specified to `true`, the attribute is evaluated as a template instead of an expression.
 */
export function evalAttr(element: Element, attrName: string, templateMode?: boolean): any;
