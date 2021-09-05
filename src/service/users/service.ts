import { CognitoIdentityServiceProvider, AWSError } from "aws-sdk";

import { BaseService } from "@services";

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
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
      });
    }
    return this.cognitoServiceObject;
  }

  // CRUD methods
  async createUser(user: User): Promise<User> {
    return super.createOne(user);
  }

  async findOneUser(query: PQuery): Promise<User> {
    return super.findOne(query);
  }

  async findUserId(email: string): Promise<string> {
    return (await super.findOne({ email })).id!;
  }

  async updateUser(query: PQuery, update: PQuery): Promise<User> {
    return super.updateOne(query, update);
  }

  async deleteUser(id: string): Promise<void> {
    return super.deleteOne({ _id: id });
  }

  /* Cognito methods */
  async cognitoSignUp({ userAttributes }: UserAttributes): Promise<void> {
    if (userAttributes.identities) {
      await this.cognitoSignUpSocial({
        userAttributes,
      } as SocialUserAttributes);
    } else {
      await this.cognitoSignUpWithEmail({
        userAttributes,
      } as EmailUserAttributes);
    }
  }

  async cognitoSignUpSocial({
    userAttributes,
  }: SocialUserAttributes): Promise<void> {
    const { providerName }: ParsedUserIdentities = JSON.parse(
      userAttributes.identities,
    )[0];

    const createSocialUser: () => Promise<User> = {
      SignInWithApple: async () =>
        await this.cognitoSignUpApple({
          userAttributes,
        } as AppleUserAttributes),

      Facebook: async () =>
        await this.cognitoSignUpFacebook({
          userAttributes,
        } as FacebookUserAttributes),
    }[providerName];

    await createSocialUser();
  }

  async cognitoSignUpApple({
    userAttributes,
  }: AppleUserAttributes): Promise<User> {
    const { userId }: ParsedUserIdentities = JSON.parse(
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
        first_name: firstName,
        last_name: lastName,
        credentials: [ECredentialTypes.Apple],
      });

      user = await this.createUser(new User(newUser));
    }

    this.initCognitoServiceObject();

    await this.updateCognitoUserAttribute(
      "custom:userid",
      String(user.id),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.first_name),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.last_name),
      userId,
    );

    return user;
  }

  async cognitoSignUpFacebook({
    userAttributes,
  }: FacebookUserAttributes): Promise<User> {
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
        first_name: given_name,
        last_name: family_name,
        credentials: [ECredentialTypes.Facebook],
      });

      user = await this.createUser(new User(newUser));
    }

    this.initCognitoServiceObject();

    await this.updateCognitoUserAttribute(
      "custom:userid",
      String(user.id),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "given_name",
      String(user.first_name),
      userId,
    );
    await this.updateCognitoUserAttribute(
      "family_name",
      String(user.last_name),
      userId,
    );

    return user;
  }

  async cognitoSignUpWithEmail({
    userAttributes,
  }: EmailUserAttributes): Promise<User | undefined> {
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
        "custom:userid",
        String(user.id),
        userAttributes.email,
      );

      return user;
    } else if (!userExists) {
      const newUser = new UserInput({
        email: userAttributes.email.trim().toLowerCase(),
        first_name: userAttributes.given_name,
        last_name: userAttributes.family_name,
        credentials: [ECredentialTypes.Username],
      });

      user = await this.createUser(new User(newUser));

      this.initCognitoServiceObject();

      await this.updateCognitoUserAttribute(
        "custom:userid",
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
    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    return new Promise((resolve, reject) => {
      const params = {
        UserAttributes: [
          {
            Name: name, // Name of attribute
            Value: value, // The new attribute value
          },
        ],
        UserPoolId: userPoolId!,
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
}
