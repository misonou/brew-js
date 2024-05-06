import $ from "../include/external/jquery.js";
import { combineFn, extend, matchWord, setTimeoutOnce } from "zeta-dom/util";
import { bind, containsOrEquals, getClass, getRect, isVisible, rectIntersects, selectIncludeSelf } from "zeta-dom/domUtil";
import dom, { beginDrag, focusable } from "zeta-dom/dom";
import { animateIn, animateOut } from "../anim.js";
import { addExtension, isElementActive } from "../app.js";
import { getDirectiveComponent, registerDirective } from "../directive.js";

const SELECTOR_SCROLLABLE = '[scrollable]';
const SELECTOR_TARGET = '[scrollable-target]';

export default addExtension('scrollable', function (app, defaultOptions) {
    defaultOptions = extend({
        content: '[scrollable-target]:not(.disabled)',
        bounce: false
    }, defaultOptions);

    var DOMMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;

    function getOptions(context) {
        return {
            handle: matchWord(context.dir, 'auto scrollbar content') || 'content',
            hScroll: !matchWord(context.dir, 'y-only'),
            vScroll: !matchWord(context.dir, 'x-only'),
            pageItem: context.selector,
            snapToPage: context.paged === 'always' || context.paged === app.orientation
        };
    }

    function initScrollable(container, context) {
        var scrollable = $.scrollable(container, extend({}, defaultOptions, getOptions(context)));
        var cleanup = [];

        cleanup.push(dom.on(container, {
            drag: function () {
                beginDrag();
            },
            getContentRect: function (e) {
                if (e.target === container || containsOrEquals(container, $(e.target).closest(SELECTOR_TARGET)[0])) {
                    var padding = scrollable.scrollPadding(e.target);
                    return getRect(container).expand(padding, -1);
                }
            },
            scrollBy: function (e) {
                var result = scrollable.scrollBy(e.x, e.y, e.behavior === 'instant' ? 0 : 200);
                return {
                    x: result.deltaX,
                    y: result.deltaY
                };
            }
        }));

        function initPageIndex(enabled) {
            if (!enabled || initPageIndex.d++) {
                return;
            }
            var scrolling = false;
            var needRefresh = false;
            var isControlledScroll;
            var currentIndex = 0;
            var timeout;

            function getItem(index) {
                return context.selector && $(context.selector, container).get()[index];
            }

            function setState(index) {
                var oldIndex = currentIndex;
                currentIndex = index;
                if (context.varname && app.setVar) {
                    app.setVar(container, context.varname, index);
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
                var isPaged = context.paged === 'always' || context.paged === app.orientation;
                if (isPaged && isVisible(container)) {
                    if (scrolling) {
                        needRefresh = true;
                    } else {
                        needRefresh = false;
                        scrollTo(currentIndex);
                    }
                }
            }

            cleanup.push(
                app.on('orientationchange', function () {
                    scrollable.setOptions({
                        snapToPage: context.paged === 'always' || context.paged === app.orientation
                    });
                }),
                app.on(container, {
                    statechange: function (e) {
                        if (context.selector && !scrolling) {
                            var newIndex = e.data[context.varname];
                            if ((getRect(getItem(newIndex)).width | 0) > (getRect().width | 0)) {
                                scrollTo(newIndex, 'left center');
                            } else {
                                scrollTo(newIndex);
                            }
                        }
                    },
                    scrollMove: function (e) {
                        scrolling = true;
                        if (context.selector && !isControlledScroll) {
                            setState(e.pageIndex);
                        }
                    },
                    scrollStop: function (e) {
                        scrolling = false;
                        if (context.selector) {
                            setState(e.pageIndex);
                            if (needRefresh) {
                                refresh();
                            }
                        }
                    }
                }, true),
                bind(window, 'resize', function () {
                    if (context.selector) {
                        clearTimeout(timeout);
                        timeout = setTimeout(refresh, 200);
                    }
                })
            );
        }

        function initPersistScroll(enabled) {
            if (!enabled || initPersistScroll.d++) {
                return;
            }
            var savedOffset = {};
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
                    if (context.persistScroll) {
                        restoreScroll();
                    }
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
                        if (!hasAsync && context.persistScroll) {
                            restoreScroll();
                        }
                    });
                })
            );
        }

        initPageIndex.d = 0;
        initPersistScroll.d = 0;
        context.watch(function () {
            scrollable.setOptions(getOptions(context));
        });
        context.watch('selector', initPageIndex, true);
        context.watch('persistScroll', initPersistScroll, true);
        context.on('destroy', function () {
            combineFn(cleanup)();
            scrollable.destroy();
        });
        scrollable[focusable(container) ? 'enable' : 'disable']();
        return scrollable;
    }

    registerDirective('scrollable', SELECTOR_SCROLLABLE, {
        component: initScrollable,
        directives: {
            dir: { attribute: 'scrollable' },
            paged: { attribute: 'scroller-snap-page' },
            varname: { attribute: 'scroller-state' },
            selector: { attribute: 'scroller-page' },
            persistScroll: { attribute: 'persist-scroll', type: 'boolean' }
        }
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
        $scrollables.each(function (i, v) {
            getDirectiveComponent(v).scrollable.refresh();
        });
        $scrollables.filter(':not([keep-scroll-offset])').scrollable('scrollTo', 0, 0);
    });

    // scroll-into-view animation trigger
    function updateScrollIntoView() {
        $('[animate-on~="scroll-into-view"]').filter(':visible').each(function (i, v) {
            var m = new DOMMatrix(getComputedStyle(v).transform);
            var rootRect = getRect(dom.root);
            var thisRect = getRect(v);
            var isInView = rectIntersects(rootRect, thisRect.translate(-m.e || 0, 0)) || rectIntersects(rootRect, thisRect.translate(0, -m.f || 0));
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
