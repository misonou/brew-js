const visualViewport = Object.assign(new EventTarget(), {
    width: 1024,
    height: 768
});

Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: visualViewport
});

beforeEach(() => {
    setViewportSize(1024, 768);
});

export function setViewportSize(w, h) {
    visualViewport.width = w;
    visualViewport.height = h;
    visualViewport.dispatchEvent(new CustomEvent('resize'));
    window.dispatchEvent(new CustomEvent('resize'));
}
