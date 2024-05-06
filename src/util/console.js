import { is, makeArray } from "zeta-dom/util";

function toElementTag(element) {
    return element.tagName.toLowerCase() + (element.id ? '#' + element.id : element.className.trim() && element.className.replace(/^\s*|\s+(?=\S)/g, '.'));
}

function truncateJSON(json) {
    return '[{"]'.indexOf(json[0]) >= 0 && json.length > 200 ? json[0] + json.substr(1, 199) + '\u2026' + json[json.length - 1] : json;
}

function formatMessage(eventSource, message) {
    message = makeArray(message).map(function (v) {
        return is(v, Element) ? toElementTag(v) + ':' : v && typeof v === 'object' ? truncateJSON(JSON.stringify(v)) : v;
    }).join(' ');
    return '[' + eventSource + '] ' + message;
}

/**
 * @param {string} eventSource
 * @param {string | Element | Record<any, any> | any[]} message
 */
export function writeLog(eventSource, message) {
    console.log(formatMessage(eventSource, message));
}

/**
 * @param {string} eventSource
 * @param {string | Element | Record<any, any> | any[]} message
 * @param {(console: Console) => void} callback
 */
export function groupLog(eventSource, message, callback) {
    var close;
    try {
        console.groupCollapsed(formatMessage(eventSource, message));
        close = true;
    } catch (e) { }
    try {
        callback(console);
    } finally {
        if (close) {
            try {
                console.groupEnd();
            } catch (e) { }
        }
    }
}
