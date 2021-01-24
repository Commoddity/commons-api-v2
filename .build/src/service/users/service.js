"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const aws_sdk_1 = require("aws-sdk");
const _services_1 = require("..");
const models_1 = require("./models");
class UsersService extends _services_1.BaseService {
    constructor() {
        super(...arguments);
        this.table = "users";
        this.credentialsTable = "user_credentials";
    }
    initCognitoServiceObject() {
        if (!this.cognitoServiceObject) {
            this.cognitoServiceObject = new aws_sdk_1.CognitoIdentityServiceProvider({
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
            });
        }
        return this.cognitoServiceObject;
    }
    createUser(user) {
        const _super = Object.create(null, {
            createOne: { get: () => super.createOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createOne.call(this, { table: this.table, tableValues: user });
        });
    }
    findOneUser(where) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.findOne.call(this, { table: this.table, where });
        });
    }
    findUserId(email) {
        const _super = Object.create(null, {
            findOneId: { get: () => super.findOneId }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.findOneId.call(this, { table: this.table, where: { email } });
        });
    }
    updateUser({ id, values }) {
        const _super = Object.create(null, {
            updateOne: { get: () => super.updateOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.updateOne.call(this, { table: this.table, data: Object.assign({ id }, values) });
        });
    }
    deleteUser(id) {
        const _super = Object.create(null, {
            deleteOne: { get: () => super.deleteOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.deleteOne.call(this, { table: this.table, where: { id } });
        });
    }
    createUserCredentials(credentials) {
        const _super = Object.create(null, {
            createOne: { get: () => super.createOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createOne.call(this, {
                table: this.credentialsTable,
                tableValues: credentials,
            });
        });
    }
    findUserCredentials(userId) {
        const _super = Object.create(null, {
            findMany: { get: () => super.findMany }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.findMany.call(this, {
                table: this.credentialsTable,
                where: { user_id: userId },
            });
        });
    }
    cognitoSignUp({ userAttributes }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userAttributes.identities) {
                yield this.cognitoSignUpSocial({
                    userAttributes,
                });
            }
            else {
                yield this.cognitoSignUpWithEmail({
                    userAttributes,
                });
            }
        });
    }
    cognitoSignUpSocial({ userAttributes, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { providerName } = JSON.parse(userAttributes.identities)[0];
            const createSocialUser = {
                SignInWithApple: () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.cognitoSignUpApple({
                        userAttributes,
                    });
                }),
                Facebook: () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.cognitoSignUpFacebook({
                        userAttributes,
                    });
                }),
            }[providerName];
            yield createSocialUser();
        });
    }
    cognitoSignUpApple({ userAttributes, }) {
        const _super = Object.create(null, {
            findIfRowExists: { get: () => super.findIfRowExists }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = JSON.parse(userAttributes.identities)[0];
            let user;
            const userExists = yield _super.findIfRowExists.call(this, {
                table: this.table,
                where: { email: userAttributes.email },
            });
            if (userExists) {
                user = yield this.findOneUser({ email: userAttributes.email });
                const appleCredentials = new models_1.UserCredentials({
                    type: models_1.UserCredentials.CredentialTypes.Apple,
                    user_id: user.id,
                });
                yield this.createUserCredentials(appleCredentials);
            }
            else {
                const firstName = userAttributes.name.split(" ")[0];
                const lastName = userAttributes.name.split(" ")[1];
                const newUser = new models_1.User({
                    email: userAttributes.email.trim().toLowerCase(),
                    first_name: firstName,
                    last_name: lastName,
                });
                user = yield this.createUser(newUser);
                const appleCredentials = new models_1.UserCredentials({
                    type: models_1.UserCredentials.CredentialTypes.Apple,
                    user_id: user.id,
                });
                yield this.createUserCredentials(appleCredentials);
            }
            this.initCognitoServiceObject();
            yield this.updateCognitoUserAttribute("custom:userid", String(user.id), userId);
            yield this.updateCognitoUserAttribute("given_name", String(user.first_name), userId);
            yield this.updateCognitoUserAttribute("family_name", String(user.last_name), userId);
            return user;
        });
    }
    cognitoSignUpFacebook({ userAttributes, }) {
        const _super = Object.create(null, {
            findIfRowExists: { get: () => super.findIfRowExists }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = JSON.parse(userAttributes.identities)[0];
            let user;
            const userExists = yield _super.findIfRowExists.call(this, {
                table: this.table,
                where: { email: userAttributes.email },
            });
            if (userExists) {
                user = yield this.findOneUser({ email: userAttributes.email });
                const facebookCredentials = new models_1.UserCredentials({
                    type: models_1.UserCredentials.CredentialTypes.Facebook,
                    user_id: user.id,
                });
                yield this.createUserCredentials(facebookCredentials);
            }
            else {
                const { given_name, family_name } = userAttributes;
                const newUser = new models_1.User({
                    email: userAttributes.email.trim().toLowerCase(),
                    first_name: given_name,
                    last_name: family_name,
                });
                user = yield this.createUser(newUser);
                const facebookCredentials = new models_1.UserCredentials({
                    type: models_1.UserCredentials.CredentialTypes.Facebook,
                    user_id: user.id,
                });
                yield this.createUserCredentials(facebookCredentials);
            }
            this.initCognitoServiceObject();
            yield this.updateCognitoUserAttribute("custom:userid", String(user.id), userId);
            yield this.updateCognitoUserAttribute("given_name", String(user.first_name), userId);
            yield this.updateCognitoUserAttribute("family_name", String(user.last_name), userId);
            return user;
        });
    }
    cognitoSignUpWithEmail({ userAttributes, }) {
        const _super = Object.create(null, {
            findIfRowExists: { get: () => super.findIfRowExists }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield _super.findIfRowExists.call(this, {
                table: this.table,
                where: { email: userAttributes.email },
            });
            const userWithEmailCredentialsExists = yield _super.findIfRowExists.call(this, {
                table: this.credentialsTable,
                where: [
                    { user_id: userAttributes.email.toLowerCase() },
                    { type: models_1.UserCredentials.CredentialTypes.Username },
                ],
            });
            let user;
            if (userExists && !userWithEmailCredentialsExists) {
                user = yield this.findOneUser({
                    where: {
                        emailAddress: userAttributes.email.toLowerCase(),
                    },
                });
                const usernameCredentials = new models_1.UserCredentials({
                    type: models_1.UserCredentials.CredentialTypes.Username,
                    user_id: user.id,
                });
                yield this.createUserCredentials(usernameCredentials);
                this.initCognitoServiceObject();
                yield this.updateCognitoUserAttribute("custom:userid", String(user.id), userAttributes.email);
                return user;
            }
            else if (!userExists) {
                const newUser = new models_1.User({
                    email: userAttributes.email.trim().toLowerCase(),
                    first_name: userAttributes.given_name,
                    last_name: userAttributes.family_name,
                });
                user = yield this.createUser(newUser);
                const usernameCredentials = new models_1.UserCredentials({
                    type: models_1.UserCredentials.CredentialTypes.Username,
                    user_id: user.id,
                });
                yield this.createUserCredentials(usernameCredentials);
                this.initCognitoServiceObject();
                yield this.updateCognitoUserAttribute("custom:userid", String(user.id), userAttributes.email);
                return user;
            }
            else if (userExists && userWithEmailCredentialsExists) {
                throw new Error("[COGNITO EMAIL SIGN IN]: User already exists.");
            }
        });
    }
    updateCognitoUserAttribute(name, value, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPoolId = process.env.COGNITO_USER_POOL_ID;
            return new Promise((resolve, reject) => {
                const params = {
                    UserAttributes: [
                        {
                            Name: name,
                            Value: value,
                        },
                    ],
                    UserPoolId: userPoolId,
                    Username: email,
                };
                this.cognitoServiceObject.adminUpdateUserAttributes(params, (error, data) => (error ? reject(error) : resolve(data)));
            });
        });
    }
    gqlFindOneUser(query) {
        const _super = Object.create(null, {
            one: { get: () => super.one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.one.call(this, query);
        });
    }
    gqlFindManyUsers(query) {
        const _super = Object.create(null, {
            many: { get: () => super.many }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.many.call(this, query);
        });
    }
    gqlCreateUserBill({ userId, billId }) {
        const _super = Object.create(null, {
            createJoinTable: { get: () => super.createJoinTable }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createJoinTable.call(this, {
                idOne: { user_id: userId },
                idTwo: { bill_id: billId },
                table: this.table,
            });
        });
    }
    gqlDeleteUserBill({ userId, billId }) {
        const _super = Object.create(null, {
            deleteJoinTable: { get: () => super.deleteJoinTable }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.deleteJoinTable.call(this, {
                idOne: { user_id: userId },
                idTwo: { bill_id: billId },
                table: this.table,
            });
        });
    }
    gqlCreateUserCategory({ userId, categoryId }) {
        const _super = Object.create(null, {
            createJoinTable: { get: () => super.createJoinTable }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.createJoinTable.call(this, {
                idOne: { user_id: userId },
                idTwo: { category_id: categoryId },
                table: "user_bills",
            });
        });
    }
    gqlDeleteUserCategory({ userId, categoryId }) {
        const _super = Object.create(null, {
            deleteJoinTable: { get: () => super.deleteJoinTable }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.deleteJoinTable.call(this, {
                idOne: { user_id: userId },
                idTwo: { category_id: categoryId },
                table: "user_categories",
            });
        });
    }
}
exports.UsersService = UsersService;
