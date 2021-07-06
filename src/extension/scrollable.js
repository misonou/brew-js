import $ from "../include/external/jquery.js";
import { createPrivateStore, matchWord, setTimeoutOnce } from "../include/zeta-dom/util.js";
import { getClass, getRect, isVisible, rectIntersects, selectIncludeSelf } from "../include/zeta-dom/domUtil.js";
import dom from "../include/zeta-dom/dom.js";
import { animateIn, animateOut } from "../anim.js";
import { getVar, setVar } from "../var.js";
import { isElementActive } from "./router.js";
import { install } from "../app.js";

install('scrollable', function (app) {
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
        var dir = container.getAttribute('scrollable');
        var paged = container.getAttribute('scroller-snap-page') || '';
        var varname = container.getAttribute('scroller-state') || '';
        var selector = container.getAttribute('scroller-page') || '';

        var items = selector && $(selector, container).get();
        var scrolling = false;
        var needRefresh = false;
        var isControlledScroll;

        // @ts-ignore: signature ignored
        $(container).scrollable({
            bounce: false,
            handle: matchWord(dir, 'auto scrollbar content') || 'content',
            hScroll: !matchWord(dir, 'y-only'),
            vScroll: !matchWord(dir, 'x-only'),
            content: '.' + getState(container).childClass + ':visible:not(.disabled)',
            pageItem: selector,
            snapToPage: (paged === 'always' || paged === app.orientation),
            scrollbar: false,
            scrollStart: function (e) {
                app.emit('scrollStart', container, e, true);
            },
            scrollMove: function (e) {
                app.emit('scrollMove', container, e, true);
            },
            scrollEnd: function (e) {
                app.emit('scrollStop', container, e, true);
            }
        });

        function setState(index) {
            if (varname) {
                var obj = {};
                obj[varname] = index;
                setVar(container, obj);
            }
        }

        function scrollTo(index, align) {
            align = align || 'center top';
            if (!scrolling && isVisible(container)) {
                scrolling = true;
                isControlledScroll = true;
                setState(index);
                $(container).scrollable('scrollToElement', items[index], align, align, 200, function () {
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
                app.on('orientationchange', function () {
                    $(container).scrollable('setOptions', {
                        snapToPage: paged === app.orientation
                    });
                });
            }
            if (varname) {
                app.on(container, {
                    statechange: function (e) {
                        var newIndex = e.data[varname];
                        if (!scrolling) {
                            if ((getRect(items[newIndex]).width | 0) > (getRect().width | 0)) {
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
                }, true);
                var timeout;
                $(window).on('resize', function () {
                    clearTimeout(timeout);
                    timeout = setTimeout(refresh, 200);
                });
            }
        }
    }

    app.on('mounted', function (e) {
        $(selectIncludeSelf('[scrollable-target]', e.target)).each(function (i, v) {
            var scrollable = $(v).closest('[scrollable]')[0];
            $(v).addClass(getState(scrollable).childClass);
        });
        $(selectIncludeSelf('[scrollable]', e.target)).each(function (i, v) {
            initScrollable(v);
        });
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
});

export default null;
