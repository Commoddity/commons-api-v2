import { FilterQuery, UpdateQuery } from "mongoose";

import { CognitoIdentityServiceProvider, AWSError } from "aws-sdk";

import { BaseService } from "../../services";
import {
  EBillCategories,
  ECredentialTypes,
  ESSMParams,
  IAppleUserAttributes,
  IEmailUserAttributes,
  IFacebookUserAttributes,
  IParsedUserIdentities,
  ISocialUserAttributes,
  IUserAttributes,
} from "../../types";
import { SSMUtil } from "../../utils";

import { User, UserInput } from "./model";
import { Collection as UserCollection } from "./collection";

export class UsersService extends BaseService<User> {
  constructor() {
    super(UserCollection, User);
  }

  private cognitoServiceObject: CognitoIdentityServiceProvider;

  private initCognitoServiceObject() {
    if (!this.cognitoServiceObject) {
      this.cognitoServiceObject = new CognitoIdentityServiceProvider({
        region: "ca-central-1",
      });
    }
    return this.cognitoServiceObject;
  }

  // CRUD methods
  async createUser(user: User): Promise<User> {
    return super.createOne(user);
  }

  async findOneUser(query: FilterQuery<User>): Promise<User> {
    return super.findOne(query);
  }

  async findUserId(email: string): Promise<string> {
    return (await super.findOne({ email })).id!;
  }

  async updateUser(
    query: FilterQuery<User>,
    update: UpdateQuery<User>,
  ): Promise<User> {
    return super.updateOne(query, update);
  }

  async deleteUser(id: string): Promise<void> {
    return super.deleteOne({ _id: id });
  }

  /* Cognito methods */
  async cognitoSignUp({ userAttributes }: IUserAttributes): Promise<void> {
    if (userAttributes.identities) {
      await this.cognitoSignUpSocial({
        userAttributes,
      } as ISocialUserAttributes);
    } else {
      await this.cognitoSignUpWithEmail({
        userAttributes,
      } as IEmailUserAttributes);
    }
  }

  async cognitoSignUpSocial({
    userAttributes,
  }: ISocialUserAttributes): Promise<void> {
    const { providerName }: IParsedUserIdentities = JSON.parse(
      userAttributes.identities,
    )[0];

    const createSocialUser: () => Promise<User> = {
      SignInWithApple: async () =>
        await this.cognitoSignUpApple({
          userAttributes,
        } as IAppleUserAttributes),

      Facebook: async () =>
        await this.cognitoSignUpFacebook({
          userAttributes,
        } as IFacebookUserAttributes),
    }[providerName];

    await createSocialUser();
  }

  async cognitoSignUpApple({
    userAttributes,
  }: IAppleUserAttributes): Promise<User> {
    const { userId }: IParsedUserIdentities = JSON.parse(
      userAttributes.identities,
    )[0];

    let user: User;

    const userExists = await super.doesOneExist({
      email: userAttributes.email,
    });

    if (userExists) {
      user = await this.updatePush(
        { email: userAttributes.email },
        { credentials: ECredentialTypes.Apple },
      );
    } else {
      const firstName = userAttributes.name.split(" ")[0];
      const lastName = userAttributes.name.split(" ")[1];

      const newUser = new UserInput({
        email: userAttributes.email.trim().toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        credentials: [ECredentialTypes.Apple],
      });

      user = await this.createUser(new User(newUser));
    }

    this.initCognitoServiceObject();

    await this.updateCognitoUserAttribute(
      "custom:userId",
      String(user.id),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.firstName),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.lastName),
      userId,
    );

    return user;
  }

  async cognitoSignUpFacebook({
    userAttributes,
  }: IFacebookUserAttributes): Promise<User> {
    const { userId } = JSON.parse(userAttributes.identities)[0];

    let user: User;

    const userExists = await super.doesOneExist({
      email: userAttributes.email,
    });

    if (userExists) {
      user = await this.updatePush(
        { email: userAttributes.email },
        { credentials: ECredentialTypes.Facebook },
      );
    } else {
      const { given_name, family_name } = userAttributes;

      const newUser = new UserInput({
        email: userAttributes.email.trim().toLowerCase(),
        firstName: given_name,
        lastName: family_name,
        credentials: [ECredentialTypes.Facebook],
      });

      user = await this.createUser(new User(newUser));
    }

    this.initCognitoServiceObject();

    await this.updateCognitoUserAttribute(
      "custom:userId",
      String(user.id),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.firstName),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.lastName),
      userId,
    );

    return user;
  }

  async cognitoSignUpWithEmail({
    userAttributes,
  }: IEmailUserAttributes): Promise<User | undefined> {
    const userExists = await super.doesOneExist({
      email: userAttributes.email,
    });

    const userWithEmailCredentialsExists = await super.doesOneExist({
      email: userAttributes.email,
      credentials: [ECredentialTypes.Username],
    });

    let user: User;

    if (userExists && !userWithEmailCredentialsExists) {
      user = await this.updatePush(
        { email: userAttributes.email },
        { credentials: ECredentialTypes.Username },
      );

      this.initCognitoServiceObject();

      await this.updateCognitoUserAttribute(
        "custom:userId",
        String(user.id),
        userAttributes.email,
      );

      return user;
    } else if (!userExists) {
      const newUser = new UserInput({
        email: userAttributes.email.trim().toLowerCase(),
        firstName: userAttributes.given_name,
        lastName: userAttributes.family_name,
        credentials: [ECredentialTypes.Username],
      });

      user = await this.createUser(new User(newUser));

      this.initCognitoServiceObject();

      await this.updateCognitoUserAttribute(
        "custom:userId",
        String(user.id),
        userAttributes.email,
      );

      return user;
    } else if (userExists && userWithEmailCredentialsExists) {
      throw new Error("[COGNITO EMAIL SIGN IN]: User already exists.");
    }
  }

  async updateCognitoUserAttribute(
    name: string,
    value: string,
    email: string,
  ): Promise<CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse> {
    const userPoolId = await SSMUtil.getInstance().getVar(
      ESSMParams.UserPoolId,
    );

    return new Promise((resolve, reject) => {
      const params = {
        UserAttributes: [
          {
            Name: name, // Name of attribute
            Value: value, // The new attribute value
          },
        ],
        UserPoolId: userPoolId,
        Username: email,
      };

      this.cognitoServiceObject.adminUpdateUserAttributes(
        params,
        (
          error: AWSError,
          data: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse,
        ) => (error ? reject(error) : resolve(data)),
      );
    });
  }

  async addUserBill(userId: string, billCode: string): Promise<User> {
    return this.updatePush({ _id: userId }, { bills: billCode });
  }

  async removeUserBill(userId: string, billCode: string): Promise<User> {
    return this.updatePull({ _id: userId }, { bills: billCode });
  }

  async addUserCategory(
    userId: string,
    category: EBillCategories,
  ): Promise<User> {
    return this.updatePush({ _id: userId }, { categories: category });
  }

  async removeUserCategory(
    userId: string,
    category: EBillCategories,
  ): Promise<User> {
    return this.updatePull({ _id: userId }, { categories: category });
  }
}
