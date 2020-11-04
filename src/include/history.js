// @ts-nocheck

var History = window.History;
if (!History || !History.Adapter) {
    window.jQuery = require('jquery');
    require('historyjs/scripts/bundled-uncompressed/html5/jquery.history.js');
    History = window.History;
}
export default History;
