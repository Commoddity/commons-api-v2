"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParliamentarySession = exports.Parliament = void 0;
class Parliament {
    constructor({ id = null, number = null, start_date = null, end_date = null, created_at = null, } = {}) {
        this.id = id;
        this.number = number;
        this.start_date = start_date;
        this.end_date = end_date;
        this.created_at = created_at;
    }
}
exports.Parliament = Parliament;
class ParliamentarySession {
    constructor({ id = null, parliament_id = null, number = null, start_date = null, end_date = null, created_at = null, } = {}) {
        this.id = id;
        this.parliament_id = parliament_id;
        this.number = number;
        this.start_date = start_date;
        this.end_date = end_date;
        this.created_at = created_at;
    }
}
exports.ParliamentarySession = ParliamentarySession;
