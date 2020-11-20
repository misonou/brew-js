/**
 * Gets the element of which the specified variable is declared on.
 * @param element A string containing the variable name.
 * @param element A DOM element.
 */
export function getVarScope(varname: string, element: Element): Element;

/**
 * Sets template variables on the specified element.
 * @param element A DOM element or a valid CSS selector.
 * @param newStates A simple object containing variables to set.
 * @param suppressEvent A boolean value specifying whether to suppress statechange event and DOM updates.
 */
export function setVar(element: Element | string, newStates?: (Zeta.Dictionary | null), suppressEvent?: boolean): boolean;

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
export function getVar(element: Element): Brew.VarContext;

/**
 * Evaluates template or expression.
 * @param template A string representing a template or an expression.
 * @param context Context object of which the template or expression is evaluated against.
 * @param element Source element for debug use.
 * @param attrName Source attribute name for debug use.
 * @param templateMode When specified to `true`, the attribute is evaluated as a template instead of an expression.
 */
export function evaluate(template: string, context: any, element: Element, attrName: string, templateMode?: boolean): any;

/**
 * Evaluates attribute value of an element as a template or an expression.
 * @param element A DOM element.
 * @param attrName Name of the attribute which to be evaluated.
 * @param templateMode When specified to `true`, the attribute is evaluated as a template instead of an expression.
 */
export function evalAttr(element: Element, attrName: string, templateMode?: boolean): any;
