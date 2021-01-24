"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor({ id, name, class_code, created_at }) {
        this.id = id;
        this.name = name;
        this.class_code = class_code;
        this.created_at = created_at;
    }
}
exports.Category = Category;
