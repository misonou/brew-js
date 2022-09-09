import $ from "../include/external/jquery.js";
import { combineFn, createPrivateStore, extend, matchWord, setTimeoutOnce } from "../include/zeta-dom/util.js";
import { bind, getClass, getRect, isVisible, rectIntersects, selectIncludeSelf } from "../include/zeta-dom/domUtil.js";
import dom, { beginDrag, focusable } from "../include/zeta-dom/dom.js";
import { registerCleanup, watchElements } from "../include/zeta-dom/observe.js";
import { animateIn, animateOut } from "../anim.js";
import { getVar, setVar } from "../var.js";
import { addExtension, isElementActive } from "../app.js";
import { selectorForAttr } from "../util/common.js";

export default addExtension('scrollable', function (app, defaultOptions) {
    defaultOptions = extend({
        bounce: false
    }, defaultOptions);

    // @ts-ignore: non-standard member
    var DOMMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
    var store = createPrivateStore();
    var id = 0;

    function getState(container) {
        return store(container) || store(container, {
            childClass: 'scrollable-target-' + (++id)
        });
    }

    function initScrollable(container) {
        var childClass = getState(container).childClass;
        var dir = container.getAttribute('scrollable');
        var paged = container.getAttribute('scroller-snap-page') || '';
        var varname = container.getAttribute('scroller-state') || '';
        var selector = container.getAttribute('scroller-page') || '';
        var persistScroll = container.hasAttribute('persist-scroll');
        var savedOffset = {};

        var scrolling = false;
        var needRefresh = false;
        var isControlledScroll;

        // @ts-ignore: signature ignored
        $(container).scrollable(extend({}, defaultOptions, {
            handle: matchWord(dir, 'auto scrollbar content') || 'content',
            hScroll: !matchWord(dir, 'y-only'),
            vScroll: !matchWord(dir, 'x-only'),
            content: '.' + getState(container).childClass + ':visible:not(.disabled)',
            pageItem: selector,
            snapToPage: (paged === 'always' || paged === app.orientation),
            scrollStart: function (e) {
                if (dom.eventSource !== 'script') {
                    delete savedOffset[history.state];
                }
                app.emit('scrollStart', container, e, true);
            },
            scrollMove: function (e) {
                app.emit('scrollMove', container, e, true);
            },
            scrollEnd: function (e) {
                app.emit('scrollStop', container, e, true);
            }
        }));

        registerCleanup(container, function () {
            $(container).scrollable('destroy');
        });

        registerCleanup(container, dom.on(container, {
            drag: function () {
                beginDrag();
            },
            getContentRect: function (e) {
                if (e.target === container || $(e.target).closest('.' + childClass)[0]) {
                    var rect = getRect(container);
                    var padding = $(container).scrollable('scrollPadding');
                    rect.top += padding.top;
                    rect.left += padding.left;
                    rect.right -= padding.right;
                    rect.bottom -= padding.bottom;
                    return rect;
                }
            },
            scrollBy: function (e) {
                $(container).scrollable('stop');
                var origX = $(container).scrollable('scrollLeft');
                var origY = $(container).scrollable('scrollTop');
                $(container).scrollable('scrollBy', e.x, e.y, 200);
                return {
                    x: origX - $(container).scrollable('scrollLeft'),
                    y: origY - $(container).scrollable('scrollTop')
                };
            }
        }));

        function getItem(index) {
            return selector && $(selector, container).get()[index];
        }

        function setState(index) {
            if (varname) {
                var obj = {};
                obj[varname] = index;
                setVar(container, obj);
            }
        }

        function scrollTo(index, align) {
            var item = getItem(index);
            align = align || 'center top';
            if (!scrolling && isVisible(container) && item) {
                scrolling = true;
                isControlledScroll = true;
                setState(index);
                $(container).scrollable('scrollToElement', item, align, align, 200, function () {
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
                    scrollTo(getVar(container, varname));
                }
            }
        }

        if (selector) {
            if (paged !== 'always') {
                registerCleanup(container, app.on('orientationchange', function () {
                    $(container).scrollable('setOptions', {
                        snapToPage: paged === app.orientation
                    });
                }));
            }
            if (varname) {
                registerCleanup(container, app.on(container, {
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
                registerCleanup(container, bind(window, 'resize', function () {
                    clearTimeout(timeout);
                    timeout = setTimeout(refresh, 200);
                }));
            }
        }

        if (persistScroll) {
            var hasAsync = false;
            var restoreScroll = function () {
                let offset = savedOffset[history.state];
                if (offset) {
                    $(container).scrollable('scrollTo', offset.x, offset.y, 0);
                }
            };
            registerCleanup(container, combineFn(
                dom.on('asyncStart', function () {
                    hasAsync = true;
                }),
                dom.on('asyncEnd', function () {
                    hasAsync = false;
                    restoreScroll();
                }),
                app.on('navigate', function (e) {
                    savedOffset[e.oldStateId] = {
                        x: $(container).scrollable('scrollLeft'),
                        y: $(container).scrollable('scrollTop')
                    };
                    setTimeout(function () {
                        if (!hasAsync) {
                            restoreScroll();
                        }
                    });
                })
            ));
        }
    }

    app.on('ready', function () {
        watchElements(dom.root, selectorForAttr(['scrollable', 'scrollable-target']), function (nodes) {
            $(nodes).filter('[scrollable-target]').each(function (i, v) {
                var scrollable = $(v).closest('[scrollable]')[0];
                if (scrollable) {
                    $(v).addClass(getState(scrollable).childClass);
                }
            });
            $(nodes).filter('[scrollable]').each(function (i, v) {
                initScrollable(v);
                $(v).scrollable(focusable(v) ? 'enable' : 'disable');
            });
        }, true);
    });

    // update scroller on events other than window resize
    function refresh() {
        $('[scrollable]:visible').scrollable('refresh');
    }
    app.on('statechange orientationchange animationcomplete', function () {
        setTimeoutOnce(refresh);
    });
    app.on('pageenter', function (e) {
        var $scrollables = $(selectIncludeSelf('[scrollable]', e.target)).add($(e.target).parents('[scrollable]'));
        $(selectIncludeSelf('[scrollable-target]', e.target)).each(function (i, v) {
            $(v).toggleClass('disabled', !isElementActive(v));
        });
        $scrollables.scrollable('refresh');
        $scrollables.filter(':not([keep-scroll-offset])').scrollable('scrollTo', 0, 0);
    });

    // scroll-into-view animation trigger
    function updateScrollIntoView() {
        $('[animate-on~="scroll-into-view"]:visible').each(function (i, v) {
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
        $('[scrollable]').each(function (i, v) {
            $(v).scrollable(focusable(v) ? 'enable' : 'disable');
        });
    });

    dom.on('keystroke', function (e) {
        const originalEvent = dom.event;
        if (dom.modalElement && originalEvent && originalEvent.target === document.body && matchWord(e.data, 'space pageUp pageDown leftArrow rightArrow upArrow downArrow')) {
            var target = selectIncludeSelf('[scrollable]', dom.modalElement)[0];
            if (target) {
                $(target).triggerHandler($.Event('keydown', {
                    keyCode: originalEvent.keyCode
                }));
            }
        }
    });
});
