import { CognitoIdentityServiceProvider } from "aws-sdk";
import { FilterQuery, UpdateQuery } from "mongoose";

import { BaseService } from "../../services";
import {
  EBillCategories,
  ECredentialTypes,
  ESSMParams,
  ICognitoAppleUserAttributes,
  ICognitoEmailUserAttributes,
  ICognitoFacebookUserAttributes,
  ICognitoSocialUserAttributes,
  ICognitoUserAttributes,
  ICognitoParsedUserIdentities,
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

  /* Pre Sign Up Cognito Event */
  async checkIfEmailExists(userAttributes: ICognitoUserAttributes): Promise<void> {
    const emailAddress = userAttributes.email.toLowerCase().trim();

    const isApple = emailAddress.startsWith("signinwithapple_");
    const isFacebook = emailAddress.startsWith("facebook_");
    if (!isApple && !isFacebook) {
      const emailUserExists = await super.doesOneExist({
        $and: [{ emailAddress }, { credentials: ECredentialTypes.Username }],
      });

      if (emailUserExists) {
        throw new Error("User with email already exists");
      }
    }

    return;
  }

  /* Post Confirmation Cognito Event */
  async cognitoSignUp(userAttributes: ICognitoUserAttributes): Promise<void> {
    if ((userAttributes as ICognitoSocialUserAttributes).identities) {
      await this.cognitoSignUpSocial(userAttributes as ICognitoSocialUserAttributes);
    } else {
      await this.cognitoSignUpEmail(userAttributes as ICognitoEmailUserAttributes);
    }

    return;
  }

  /* Cognito Sign Up Methods */
  async cognitoSignUpSocial(userAttributes: ICognitoSocialUserAttributes): Promise<void> {
    const { providerName }: ICognitoParsedUserIdentities = JSON.parse(
      userAttributes.identities,
    )[0];

    const createSocialUser: () => Promise<User> = {
      SignInWithApple: async () =>
        await this.cognitoSignUpApple(userAttributes as ICognitoAppleUserAttributes),

      Facebook: async () =>
        await this.cognitoSignUpFacebook(
          userAttributes as ICognitoFacebookUserAttributes,
        ),
    }[providerName];

    await createSocialUser();
  }

  async cognitoSignUpApple(userAttributes: ICognitoAppleUserAttributes): Promise<User> {
    const userPoolId = await SSMUtil.getInstance().getVar(ESSMParams.UserPoolId);

    const { userId }: ICognitoParsedUserIdentities = JSON.parse(
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
      userPoolId,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.firstName),
      userId,
      userPoolId,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.lastName),
      userId,
      userPoolId,
    );

    return user;
  }

  async cognitoSignUpFacebook(
    userAttributes: ICognitoFacebookUserAttributes,
  ): Promise<User> {
    const userPoolId = await SSMUtil.getInstance().getVar(ESSMParams.UserPoolId);

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
      userPoolId,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.firstName),
      userId,
      userPoolId,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.lastName),
      userId,
      userPoolId,
    );

    return user;
  }

  async cognitoSignUpEmail(
    userAttributes: ICognitoEmailUserAttributes,
  ): Promise<User | undefined> {
    const userPoolId = await SSMUtil.getInstance().getVar(ESSMParams.UserPoolId);

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
        userPoolId,
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
        userPoolId,
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
    userPoolId: string,
  ): Promise<CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesResponse> {
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

    try {
      return this.cognitoServiceObject.adminUpdateUserAttributes(params).promise();
    } catch (error) {
      throw new Error(`[COGNITO UPDATE USER ATTRIBUTE]: ${error}`);
    }
  }

  /* CRUD methods */
  async createUser(user: User): Promise<User> {
    return super.createOne(user);
  }

  async getOneUser(userId: string): Promise<User> {
    return super.findOne({ _id: userId });
  }

  async findUserId(email: string): Promise<string> {
    return (await super.findOne({ email })).id;
  }

  async updateUser(query: FilterQuery<User>, update: UpdateQuery<User>): Promise<User> {
    return super.updateOne(query, update);
  }

  async deleteUser(id: string): Promise<void> {
    return super.deleteOne({ _id: id });
  }

  async addUserBill(userId: string, billCode: string): Promise<User> {
    return this.updatePush({ _id: userId }, { bills: billCode });
  }

  async removeUserBill(userId: string, billCode: string): Promise<User> {
    return this.updatePull({ _id: userId }, { bills: billCode });
  }

  async addUserCategory(userId: string, category: EBillCategories): Promise<User> {
    return this.updatePush({ _id: userId }, { categories: category });
  }

  async removeUserCategory(userId: string, category: EBillCategories): Promise<User> {
    return this.updatePull({ _id: userId }, { categories: category });
  }
}
