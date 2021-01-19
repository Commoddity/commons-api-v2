import AWS from "aws-sdk";

import { BaseService } from "@services";
import {
  UserInterface as User,
  UserCredentials,
  User as UserType,
} from "./models";
export class UsersService extends BaseService<User> {
  private table = "users";
  private credentialsTable = "user_credentials";

  private cognitoServiceObject;

  private initCognitoServiceObject() {
    if (!this.cognitoServiceObject) {
      this.cognitoServiceObject = new AWS.CognitoIdentityServiceProvider({
        region: "ca-central-1",
      });
    }
    return this.cognitoServiceObject;
  }

  // CRUD methods
  async createUser(user: User): Promise<User> {
    return super.createOne({ table: this.table, tableValues: user });
  }

  async updateUser({ id, values }): Promise<User> {
    return super.updateOne({ table: this.table, data: { id, ...values } });
  }

  async deleteUser(id: string): Promise<boolean> {
    return super.deleteOne({ table: this.table, where: { id } });
  }

  async findOneUser(where: WhereCondition | WhereCondition[]): Promise<User> {
    return super.findOne({ table: this.table, where });
  }

  async findUserCredentials(userId: string): Promise<UserCredentials[]> {
    return super.findMany<UserCredentials>({
      table: this.credentialsTable,
      where: { user_id: userId },
    });
  }

  async createUserCredentials(
    credentials: UserCredentials,
  ): Promise<UserCredentials> {
    return super.createOne<UserCredentials>({
      table: this.credentialsTable,
      tableValues: credentials,
    });
  }

  // Cognito methods
  async cognitoSignUp({ userAttributes }) {
    if (userAttributes.identities) {
      await this.cognitoSignUpSocial({ userAttributes });
    } else {
      await this.cognitoSignUpWithEmail({ userAttributes });
    }
  }

  async cognitoSignUpSocial({ userAttributes }) {
    const identities = JSON.parse(userAttributes.identities);

    if (identities[0].providerName === "Facebook") {
      await this.cognitoSignUpFacebook({ userAttributes });
    } else if (identities[0].providerName === "SignInWithApple") {
      await this.cognitoSignUpApple({ userAttributes });
    }
  }

  async cognitoSignUpApple({ userAttributes }) {
    const identities = JSON.parse(userAttributes.identities);

    let user: User;

    if (
      await super.findIfRowExists({
        table: this.table,
        where: { email: userAttributes.email },
      })
    ) {
      user = await this.findOneUser({ email: userAttributes.email });

      const appleCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Apple,
        user_id: user.id!,
      });
      await this.createUserCredentials(appleCredentials);
    } else {
      const firstName = userAttributes.name.split(" ")[0];
      const lastName = userAttributes.name.split(" ")[1];

      const newUser = new UserType({
        email: userAttributes.email.trim().toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        username: userAttributes.username,
      });
      user = await this.createUser(newUser);

      const appleCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Apple,
        user_id: user.id!,
      });
      await this.createUserCredentials(appleCredentials);
    }

    await this.initCognitoServiceObject();

    await this.updateCognitoUserAttribute(
      "custom:userid",
      String(user.id),
      `signinwithapple_${identities[0].userId}`,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.first_name),
      `signinwithapple_${identities[0].userId}`,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.last_name),
      `signinwithapple_${identities[0].userId}`,
    );

    return user;
  }

  async cognitoSignUpFacebook({ userAttributes }) {
    const identities = JSON.parse(userAttributes.identities);

    let user: User;

    if (
      await super.findIfRowExists({
        table: this.table,
        where: { email: userAttributes.email },
      })
    ) {
      user = await this.findOneUser({ email: userAttributes.email });

      const facebookCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Facebook,
        user_id: user.id!,
      });
      await this.createUserCredentials(facebookCredentials);
    } else {
      const firstName: string = userAttributes.name.split(" ")[0];
      const lastName: string = userAttributes.name.split(" ")[1];

      const newUser = new UserType({
        email: userAttributes.email.trim().toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        username: userAttributes.username,
      });
      user = await this.createUser(newUser);

      const facebookCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Facebook,
        user_id: user.id!,
      });
      await this.createUserCredentials(facebookCredentials);
    }

    await this.initCognitoServiceObject();

    await this.updateCognitoUserAttribute(
      "custom:userid",
      String(user.id),
      `signinwithfacebook_${identities[0].userId}`,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.first_name),
      `signinwithfacebook_${identities[0].userId}`,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.last_name),
      `signinwithfacebook_${identities[0].userId}`,
    );

    return user;
  }

  async cognitoSignUpWithEmail({ userAttributes }) {
    const userExists = await super.findIfRowExists({
      table: this.table,
      where: { email: userAttributes.email },
    });

    const userWithEmailCredentialsExists = await super.findIfRowExists({
      table: this.credentialsTable,
      where: [
        { user_id: userAttributes.email.toLowerCase() },
        { type: UserCredentials.CredentialTypes.Username },
      ],
    });

    let user: User;

    if (userExists && !userWithEmailCredentialsExists) {
      user = await this.findOneUser({
        where: {
          emailAddress: userAttributes.email.toLowerCase(),
        },
      });

      const usernameCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Username,
        user_id: user.id!,
      });
      await this.createUserCredentials(usernameCredentials);

      await this.initCognitoServiceObject();

      await this.updateCognitoUserAttribute(
        "custom:userid",
        String(user.id),
        userAttributes.email,
      );

      return user;
    } else if (!userExists) {
      // DEV NOTE --> Rename attributes when I figure out what they're called when returned from Cognito
      const newUser = new UserType({
        email: userAttributes.email.trim().toLowerCase(),
        first_name: userAttributes.firstName,
        last_name: userAttributes.lastName,
        username: userAttributes.username,
      });

      user = await this.createUser(newUser);

      const usernameCredentials = new UserCredentials({
        type: UserCredentials.CredentialTypes.Username,
        user_id: user.id!,
      });

      await this.createUserCredentials(usernameCredentials);

      await this.initCognitoServiceObject();

      await this.updateCognitoUserAttribute(
        "custom:userid",
        String(user.id),
        userAttributes.email,
      );

      return user;
    } else if (userExists && userWithEmailCredentialsExists) {
      throw new Error("user already exists");
    }
  }

  async updateCognitoUserAttribute(name, value, username) {
    const userPoolId = "THIS IS NOT A USER ID";

    return new Promise((resolve, reject) => {
      const params = {
        UserAttributes: [
          {
            Name: name, // name of attribute
            Value: value, // the new attribute value
          },
        ],
        UserPoolId: userPoolId,
        Username: username,
      };

      this.cognitoServiceObject.adminUpdateUserAttributes(
        params,
        (error, data) => (error ? reject(error) : resolve(data)),
      );
    });
  }

  // GraphQL methods
  async gqlFindOneUser(query: string): Promise<User> {
    return super.one<User>(query);
  }

  async gqlFindManyUsers(query: string): Promise<User[]> {
    return super.many<User>(query);
  }

  async gqlCreateUserBill({ userId, billId }): Promise<boolean> {
    return super.createJoinTable({
      idOne: { user_id: userId },
      idTwo: { bill_id: billId },
      table: this.table,
    });
  }

  async gqlDeleteUserBill({ userId, billId }): Promise<boolean> {
    return super.deleteJoinTable({
      idOne: { user_id: userId },
      idTwo: { bill_id: billId },
      table: this.table,
    });
  }

  async gqlCreateUserCategory({ userId, categoryId }): Promise<boolean> {
    return super.createJoinTable({
      idOne: { user_id: userId },
      idTwo: { category_id: categoryId },
      table: "user_bills",
    });
  }

  async gqlDeleteUserCategory({ userId, categoryId }): Promise<boolean> {
    return super.deleteJoinTable({
      idOne: { user_id: userId },
      idTwo: { category_id: categoryId },
      table: "user_categories",
    });
  }
}
