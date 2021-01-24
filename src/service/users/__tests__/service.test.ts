import { UsersService, User, UserCredentials } from "@services";
import { resetUsers } from "@test";

describe(`UsersService methods`, () => {
  beforeEach(async () => {
    await resetUsers();
  });
  afterEach(async () => {
    await resetUsers();
  });

  describe(`Create User`, () => {
    it(`Tests createUser and createUserCredentials methods`, async () => {
      const testNewUser = new User({
        first_name: "Ronald",
        last_name: "McDonald",
        email: "burgertime@yahoo.com",
      });

      const createdNewUser = await new UsersService().createUser(testNewUser);

      expect(createdNewUser).toMatchObject(testNewUser);
      expect(createdNewUser.id).toBeTruthy();
      expect(createdNewUser.id).toHaveLength(20);
      expect(createdNewUser.created_at).toBeTruthy();
      expect(createdNewUser.email).toEqual("burgertime@yahoo.com");

      const testNewUserCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Apple,
        user_id: createdNewUser.id!,
      });

      const createdNewUserCredentials = await new UsersService().createUserCredentials(
        testNewUserCredentials,
      );

      expect(createdNewUserCredentials).toMatchObject(testNewUserCredentials);
      expect(createdNewUserCredentials.id).toBeTruthy();
      expect(createdNewUserCredentials.user_id).toBeTruthy();
      expect(createdNewUserCredentials.type).toEqual("apple");
    });
  });

  describe(`Cognito sign up`, () => {
    it(`Email sign up - creates a new user in the DB and adds user credentials`, async () => {
      const testNewUserAttributes: EmailUserAttributes = {
        userAttributes: {
          given_name: "Turtle",
          family_name: "Kid",
          email: "pascalvanleeuwen604@gmail.com",
        },
      };

      await new UsersService().cognitoSignUp({
        userAttributes: testNewUserAttributes.userAttributes,
      });

      const newDbUser = await new UsersService().findOneUser({
        email: testNewUserAttributes.userAttributes.email,
      });

      expect(newDbUser.id).toBeTruthy();
      expect(newDbUser.id).toHaveLength(20);
      expect(newDbUser.created_at).toBeTruthy();
      expect(newDbUser.email).toEqual("pascalvanleeuwen604@gmail.com");

      const userCredsAfterEmail = await new UsersService().findUserCredentials(
        newDbUser.id,
      );
      const emailCreds = userCredsAfterEmail.find(
        (creds) => creds.type === "username",
      )!;

      expect(emailCreds.id).toBeTruthy();
      expect(emailCreds.user_id).toBeTruthy();
      expect(emailCreds.type).toEqual("username");
    });

    it(`Apple sign up - creates a new user in the DB and adds user credentials`, async () => {
      const testNewUserAttributesApple: AppleUserAttributes = {
        userAttributes: {
          identities:
            '[{"userId":"4065b67d-71dc-4e67-a4ac-d56a9fe2c5ba","providerName":"SignInWithApple","providerType":"SignInWithApple","issuer":null,"primary":true,"dateCreated":1600705285940}]',
          name: "Turtle Kid",
          email: "pascalvanleeuwen604@gmail.com",
        },
      };

      await new UsersService().cognitoSignUp({
        userAttributes: testNewUserAttributesApple.userAttributes,
      });

      const newDbUser = await new UsersService().findOneUser({
        email: testNewUserAttributesApple.userAttributes.email,
      });

      expect(newDbUser.id).toBeTruthy();
      expect(newDbUser.id).toHaveLength(20);
      expect(newDbUser.created_at).toBeTruthy();
      expect(newDbUser.email).toEqual("pascalvanleeuwen604@gmail.com");

      const userCredsAfterApple = await new UsersService().findUserCredentials(
        newDbUser.id,
      );
      const appleCreds = userCredsAfterApple.find(
        (creds) => creds.type === "apple",
      )!;

      expect(appleCreds.id).toBeTruthy();
      expect(appleCreds.user_id).toBeTruthy();
      expect(appleCreds.type).toEqual("apple");
    });

    it(`Facebook sign up - creates a new user in the DB and adds user credentials`, async () => {
      const testNewUserAttributesFacebook: FacebookUserAttributes = {
        userAttributes: {
          identities:
            '[{"userId":"4065b67d-71dc-4e67-a4ac-d56a9fe2c5ba","providerName":"Facebook","providerType":"Facebook","issuer":null,"primary":true,"dateCreated":1601588014283}]',
          given_name: "Turtle",
          family_name: "Kid",
          email: "pascalvanleeuwen604@gmail.com",
        },
      };

      await new UsersService().cognitoSignUp({
        userAttributes: testNewUserAttributesFacebook.userAttributes,
      });

      const newDbUser = await new UsersService().findOneUser({
        email: testNewUserAttributesFacebook.userAttributes.email,
      });

      expect(newDbUser.id).toBeTruthy();
      expect(newDbUser.id).toHaveLength(20);
      expect(newDbUser.created_at).toBeTruthy();
      expect(newDbUser.email).toEqual("pascalvanleeuwen604@gmail.com");

      const userCredsAfterFacebook = await new UsersService().findUserCredentials(
        newDbUser.id,
      );
      const facebookCreds = userCredsAfterFacebook.find(
        (creds) => creds.type === "facebook",
      )!;

      expect(facebookCreds.id).toBeTruthy();
      expect(facebookCreds.user_id).toBeTruthy();
      expect(facebookCreds.type).toEqual("facebook");
    });
  });
});
