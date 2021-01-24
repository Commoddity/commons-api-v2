"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const _utils_1 = require("../../utils");
class Event {
    constructor({ description, title, pubDate }) {
        this.bill_code = _utils_1.FormatUtils.formatCode(description);
        this.title = _utils_1.FormatUtils.formatTitle(title);
        this.publication_date = _utils_1.FormatUtils.formatDate(pubDate);
    }
}
exports.Event = Event;
