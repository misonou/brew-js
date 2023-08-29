import $ from "../include/external/jquery.js";
import { combineFn, extend, matchWord, setTimeoutOnce } from "../include/zeta-dom/util.js";
import { bind, containsOrEquals, getClass, getRect, isVisible, rectIntersects, selectIncludeSelf } from "../include/zeta-dom/domUtil.js";
import dom, { beginDrag, focusable } from "../include/zeta-dom/dom.js";
import { animateIn, animateOut } from "../anim.js";
import { addExtension, isElementActive } from "../app.js";
import { registerDirective } from "../directive.js";

const SELECTOR_SCROLLABLE = '[scrollable]';
const SELECTOR_TARGET = '[scrollable-target]';

export default addExtension('scrollable', function (app, defaultOptions) {
    defaultOptions = extend({
        bounce: false
    }, defaultOptions);

    // @ts-ignore: non-standard member
    var DOMMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;

    function initScrollable(container, context) {
        var dir = container.getAttribute('scrollable');
        var paged = container.getAttribute('scroller-snap-page') || '';
        var varname = container.getAttribute('scroller-state') || '';
        var selector = container.getAttribute('scroller-page') || '';
        var persistScroll = container.hasAttribute('persist-scroll');
        var savedOffset = {};
        var cleanup = [];

        var scrolling = false;
        var needRefresh = false;
        var isControlledScroll;
        var currentIndex = 0;

        // @ts-ignore: signature ignored
        var scrollable = $.scrollable(container, extend({}, defaultOptions, {
            handle: matchWord(dir, 'auto scrollbar content') || 'content',
            hScroll: !matchWord(dir, 'y-only'),
            vScroll: !matchWord(dir, 'x-only'),
            content: '[scrollable-target]:not(.disabled)',
            pageItem: selector,
            snapToPage: (paged === 'always' || paged === app.orientation)
        }));

        cleanup.push(function () {
            scrollable.destroy();
        });

        cleanup.push(dom.on(container, {
            drag: function () {
                beginDrag();
            },
            getContentRect: function (e) {
                if (e.target === container || containsOrEquals(scrollable.scrollTarget, e.target)) {
                    var padding = scrollable.scrollPadding(e.target);
                    return getRect(container).expand(-padding.left, -padding.top, padding.right, padding.bottom);
                }
            },
            scrollBy: function (e) {
                var result = scrollable.scrollBy(e.x, e.y, 200);
                return {
                    x: result.deltaX,
                    y: result.deltaY
                };
            }
        }));

        function getItem(index) {
            return selector && $(selector, container).get()[index];
        }

        function setState(index) {
            var oldIndex = currentIndex;
            currentIndex = index;
            if (varname && app.setVar) {
                app.setVar(container, varname, index);
            }
            if (oldIndex !== index) {
                app.emit('scrollIndexChange', container, {
                    oldIndex: oldIndex,
                    newIndex: index
                }, true);
            }
        }

        function scrollTo(index, align) {
            var item = getItem(index);
            align = align || 'center top';
            if (!scrolling && isVisible(container) && item) {
                scrolling = true;
                isControlledScroll = true;
                setState(index);
                scrollable.scrollToElement(item, align, align, 200, function () {
                    scrolling = false;
                    isControlledScroll = false;
                });
            }
        }

        function refresh() {
            var isPaged = (paged === 'always' || paged === app.orientation);
            if (isPaged && isVisible(container)) {
                if (scrolling) {
                    needRefresh = true;
                } else {
                    needRefresh = false;
                    scrollTo(currentIndex);
                }
            }
        }

        if (selector) {
            if (paged !== 'always') {
                cleanup.push(app.on('orientationchange', function () {
                    scrollable.setOptions({
                        snapToPage: paged === app.orientation
                    });
                }));
            }
            cleanup.push(app.on(container, {
                statechange: function (e) {
                    var newIndex = e.data[varname];
                    if (!scrolling) {
                        if ((getRect(getItem(newIndex)).width | 0) > (getRect().width | 0)) {
                            scrollTo(newIndex, 'left center');
                        } else {
                            scrollTo(newIndex);
                        }
                    }
                },
                scrollMove: function (e) {
                    scrolling = true;
                    if (!isControlledScroll) {
                        setState(e.pageIndex);
                    }
                },
                scrollStop: function (e) {
                    setState(e.pageIndex);
                    scrolling = false;
                    if (needRefresh) {
                        refresh();
                    }
                }
            }, true));
            var timeout;
            cleanup.push(bind(window, 'resize', function () {
                clearTimeout(timeout);
                timeout = setTimeout(refresh, 200);
            }));
        }

        if (persistScroll) {
            var hasAsync = false;
            var restoreScroll = function () {
                let offset = savedOffset[history.state];
                if (offset) {
                    scrollable.scrollTo(offset.x, offset.y, 0);
                }
            };
            cleanup.push(
                dom.on('asyncStart', function () {
                    hasAsync = true;
                }),
                dom.on('asyncEnd', function () {
                    hasAsync = false;
                    restoreScroll();
                }),
                app.on(container, 'scrollStart', function (e) {
                    if (e.source !== 'script') {
                        delete savedOffset[history.state];
                    }
                }, true),
                app.on('navigate', function (e) {
                    savedOffset[e.oldStateId] = {
                        x: scrollable.scrollLeft(),
                        y: scrollable.scrollTop()
                    };
                    setTimeout(function () {
                        if (!hasAsync) {
                            restoreScroll();
                        }
                    });
                })
            );
        }

        context.on('destroy', combineFn(cleanup));
        scrollable[focusable(container) ? 'enable' : 'disable']();
        return scrollable;
    }

    registerDirective('scrollable', SELECTOR_SCROLLABLE, {
        component: initScrollable
    });

    $.scrollable.hook({
        scrollStart: function (e) {
            app.emit('scrollStart', this, e, true);
        },
        scrollMove: function (e) {
            app.emit('scrollMove', this, e, true);
        },
        scrollEnd: function (e) {
            app.emit('scrollStop', this, e, true);
        },
        scrollProgressChange: function (e) {
            app.emit('scrollProgressChange', this, e, true);
        }
    });

    // update scroller on events other than window resize
    function refresh() {
        $(SELECTOR_SCROLLABLE).scrollable('refresh');
    }
    app.on('statechange orientationchange animationcomplete', function () {
        setTimeoutOnce(refresh);
    });
    app.on('pageenter', function (e) {
        var $scrollables = $(selectIncludeSelf(SELECTOR_SCROLLABLE, e.target)).add($(e.target).parents(SELECTOR_SCROLLABLE));
        $(selectIncludeSelf(SELECTOR_TARGET, e.target)).each(function (i, v) {
            $(v).toggleClass('disabled', !isElementActive(v));
        });
        $scrollables.scrollable('refresh');
        $scrollables.filter(':not([keep-scroll-offset])').scrollable('scrollTo', 0, 0);
    });

    // scroll-into-view animation trigger
    function updateScrollIntoView() {
        $('[animate-on~="scroll-into-view"]').filter(':visible').each(function (i, v) {
            var m = new DOMMatrix(getComputedStyle(v).transform);
            var rootRect = getRect(dom.root);
            var thisRect = getRect(v);
            var isInView = rectIntersects(rootRect, thisRect.translate(-m.e || 0, 0)) || rectIntersects(rootRect, thisRect.translate(0, -m.f || 0));
            // @ts-ignore: boolean arithmetics
            if ((isInView ^ getClass(v, 'tweening-in')) && (isInView || v.attributes['animate-out'])) {
                (isInView ? animateIn : animateOut)(v, 'scroll-into-view');
            }
        });
    }

    app.on('resize pageenter statechange scrollMove orientationchange', function () {
        setTimeoutOnce(updateScrollIntoView);
    });

    dom.on('modalchange', function () {
        $(SELECTOR_SCROLLABLE).each(function (i, v) {
            $(v).scrollable(focusable(v) ? 'enable' : 'disable');
        });
    });

    dom.on('keystroke', function (e) {
        const originalEvent = dom.event;
        if (dom.modalElement && originalEvent && originalEvent.target === document.body && matchWord(e.data, 'space pageUp pageDown leftArrow rightArrow upArrow downArrow')) {
            var target = selectIncludeSelf(SELECTOR_SCROLLABLE, dom.modalElement)[0];
            if (target) {
                $(target).triggerHandler($.Event('keydown', {
                    keyCode: originalEvent.keyCode
                }));
            }
        }
    });
});
