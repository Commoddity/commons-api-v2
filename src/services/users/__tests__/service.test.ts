import { UsersService } from "../service";
import { User, UserInput } from "../../users/model";
import {
  ECredentialTypes,
  ICognitoAppleUserAttributes,
  ICognitoEmailUserAttributes,
  ICognitoFacebookUserAttributes,
} from "../../../types";
import { initClient } from "../../../db";

beforeAll(async () => {
  await initClient();
});

afterEach(async () => {
  await new UsersService().deleteMany({ email: "burgertime@yahoo.com" }, { hard: true });
});

afterAll(async () => {
  await new UsersService().closeDbConnection();
});

describe(`UsersService methods`, () => {
  describe(`Create User`, () => {
    it(`Tests createUser and createUserCredentials methods`, async () => {
      const testNewUser = new UserInput({
        firstName: "Ronald",
        lastName: "McDonald",
        email: "burgertime@yahoo.com",
        credentials: [ECredentialTypes.Username],
      });

      const createdNewUser = await new UsersService().createUser(new User(testNewUser));

      expect(createdNewUser).toMatchObject(testNewUser);
      expect(createdNewUser.id).toBeTruthy();
      expect(createdNewUser.id).toHaveLength(20);
      expect(createdNewUser.createdAt).toBeTruthy();
      expect(createdNewUser.email).toEqual("burgertime@yahoo.com");
    });
  });

  describe(`Cognito sign up`, () => {
    it(`Email sign up - creates a new user in the DB and adds user credentials`, async () => {
      const testNewUserAttributes: ICognitoEmailUserAttributes = {
        given_name: "Turtle",
        family_name: "Kid",
        email: "burgertime@yahoo.com",
      };

      const service = new UsersService();
      await service.cognitoSignUp(testNewUserAttributes);

      const userId = await service.findUserId(testNewUserAttributes.email);
      const newDbUser = await service.getOneUser(userId);

      expect(newDbUser.id).toBeTruthy();
      expect(newDbUser.id).toHaveLength(20);
      expect(newDbUser.createdAt).toBeTruthy();
      expect(newDbUser.email).toEqual("burgertime@yahoo.com");
      expect(newDbUser.credentials).toContain(ECredentialTypes.Username);
    });

    it(`Apple sign up - creates a new user in the DB and adds user credentials`, async () => {
      const testNewUserAttributesApple: ICognitoAppleUserAttributes = {
        identities:
          '[{"userId":"4065b67d-71dc-4e67-a4ac-d56a9fe2c5ba","providerName":"SignInWithApple","providerType":"SignInWithApple","issuer":null,"primary":true,"dateCreated":1600705285940}]',
        name: "Turtle Kid",
        email: "burgertime@yahoo.com",
      };

      const service = new UsersService();
      await service.cognitoSignUp(testNewUserAttributesApple);

      const userId = await service.findUserId(testNewUserAttributesApple.email);
      const newDbUser = await service.getOneUser(userId);

      expect(newDbUser.id).toBeTruthy();
      expect(newDbUser.id).toHaveLength(20);
      expect(newDbUser.createdAt).toBeTruthy();
      expect(newDbUser.email).toEqual("burgertime@yahoo.com");
      expect(newDbUser.credentials).toContain(ECredentialTypes.Apple);
    });

    it(`Facebook sign up - creates a new user in the DB and adds user credentials`, async () => {
      const testNewUserAttributesFacebook: ICognitoFacebookUserAttributes = {
        identities:
          '[{"userId":"4065b67d-71dc-4e67-a4ac-d56a9fe2c5ba","providerName":"Facebook","providerType":"Facebook","issuer":null,"primary":true,"dateCreated":1601588014283}]',
        given_name: "Turtle",
        family_name: "Kid",
        email: "burgertime@yahoo.com",
      };

      const service = new UsersService();
      await service.cognitoSignUp(testNewUserAttributesFacebook);

      const userId = await service.findUserId(testNewUserAttributesFacebook.email);
      const newDbUser = await service.getOneUser(userId);

      expect(newDbUser.id).toBeTruthy();
      expect(newDbUser.id).toHaveLength(20);
      expect(newDbUser.createdAt).toBeTruthy();
      expect(newDbUser.email).toEqual("burgertime@yahoo.com");
      expect(newDbUser.credentials).toContain(ECredentialTypes.Facebook);
    });
  });
});
