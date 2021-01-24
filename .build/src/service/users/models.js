"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredentials = exports.User = void 0;
class User {
    constructor({ first_name, last_name, email }) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }
    get fullName() {
        return `${this.first_name} ${this.last_name}`;
    }
    get fullAddress() {
        return `${this.address} ${this.street} ${this.city} ${this.province} ${this.postal_code}`;
    }
}
exports.User = User;
class UserCredentials {
    constructor(args) {
        this.user_id = args.user_id;
        this.type = args.type;
    }
    static get CredentialTypes() {
        return CredentialTypes;
    }
}
exports.UserCredentials = UserCredentials;
var CredentialTypes;
(function (CredentialTypes) {
    CredentialTypes["Apple"] = "apple";
    CredentialTypes["Facebook"] = "facebook";
    CredentialTypes["Username"] = "username";
})(CredentialTypes || (CredentialTypes = {}));
