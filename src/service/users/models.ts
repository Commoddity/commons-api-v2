import { UsersService } from "./service";

export interface UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  email_notification: number;
  sms_notification: number;
  active: boolean;
  phone_number: string;
  address: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  mp: string;
  party: string;
  riding_name: string;
  created_at: Date;
}

interface CognitoUserInput {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

export class User implements UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  email_notification: number;
  sms_notification: number;
  active: boolean;
  phone_number: string;
  address: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  mp: string;
  party: string;
  riding_name: string;
  created_at: Date;

  constructor({ first_name, last_name, username, email }: CognitoUserInput) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.username = username;
    this.email = email;
  }

  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  get fullAddress(): string {
    return `${this.address} ${this.street} ${this.city} ${this.province} ${this.postal_code}`;
  }

  async getId() {
    return await new UsersService().findUserId(this.username);
  }
}

interface CredentialsInterface {
  user_id: string;
  type: CredentialTypes;
}

export class UserCredentials implements CredentialsInterface {
  id: string;
  user_id: string;
  type: CredentialTypes;

  constructor(args: CredentialsInterface) {
    this.user_id = args.user_id;
    this.type = args.type;
  }

  static get CredentialTypes() {
    return CredentialTypes;
  }
}

enum CredentialTypes {
  Apple = "apple",
  Facebook = "facebook",
  Username = "username",
}
