/**
 * @param state
 * @param varname
 */
export function getVarObjWithProperty(state: any, varname: string): any;

/**
 * Sets template variables on the specified element.
 * @param element A DOM element or a valid CSS selector.
 * @param newStates A simple object containing variables to set.
 * @param suppressEvent A boolean value specifying whether to suppress statechange event and DOM updates.
 */
export function setVar(element: Element | string, newStates?: (Zeta.Dictionary | null), suppressEvent?: boolean): boolean;

/**
 * @param element
 * @param resetToNull
 */
export function resetVar(element: Element, resetToNull?: boolean): void;

/**
 * @param element
 * @param resetToNull
 */
export function getDeclaredVar(element: Element, resetToNull?: boolean): Zeta.Dictionary;

/**
 * Gets template variables defined on the specified element.
 * @param element A DOM element.
 */
export function getVar(element: Element): Brew.VarState;

/**
 * @param template
 * @param context
 * @param element
 * @param attrName
 * @param returnAsIs
 */
export function evaluate(template: string, context: any, element: Element, attrName: string, returnAsIs?: boolean): any;

/**
 * @param element
 * @param attrName
 * @param context
 */
export function evalAttr(element: Element, attrName: string, context?: any): any;
