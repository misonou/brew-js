import { toPlainRect } from "zeta-dom/domUtil";
import { jest } from "@jest/globals";

const cssProperties = [
    'marginTop',
    'marginLeft',
    'marginRight',
    'marginBottom',
    'paddingTop',
    'paddingLeft',
    'paddingRight',
    'paddingBottom',
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'scrollPaddingTop',
    'scrollPaddingLeft',
    'scrollPaddingRight',
    'scrollPaddingBottom',
];
const getComputedStyle = window.getComputedStyle.bind(window);

function getBoundingClientRect(element) {
    const value = element.getAttribute('x-rect');
    if (value) {
        let [x, y, w, h] = value.split(' ');
        let rect = toPlainRect(+x, +y, +x + +w, +y + +h);
        for (let cur = element; cur instanceof Element; cur = cur.parentNode) {
            let style = getComputedStyle(cur);
            if (style.transform) {
                let m = new DOMMatrix(style.transform);
                rect = rect.translate(m.e, m.f);
            }
            if (style.left || style.top) {
                rect = rect.translate(parseFloat(style.left) || 0, parseFloat(style.top) || 0);
            }
        }
        return new DOMRect(rect.left, rect.top, rect.width, rect.height);
    }
    return new DOMRect(0, 0, 0, 0);
}

jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
    return getBoundingClientRect(this);
});

jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
    return getBoundingClientRect(this).width;
});

jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
    return getBoundingClientRect(this).height;
});

jest.spyOn(window, 'getComputedStyle').mockImplementation(function () {
    const style = getComputedStyle.apply(this, arguments);
    for (let p of cssProperties) {
        style[p] = style[p] || '0px';
    }
    return style;
});
