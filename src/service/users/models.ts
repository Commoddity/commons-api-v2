export interface UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  email_notification?: number;
  sms_notification?: number;
  active?: boolean;
  phone_number?: string;
  address?: string;
  street?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  mp?: string;
  party?: string;
  riding_name?: string;
  created_at?: Date;
}

export class User implements UserInterface {
  id;
  first_name;
  last_name;
  username;
  email;
  phone_number;
  email_notification;
  sms_notification;
  active;
  address;
  street;
  city;
  province;
  postal_code;
  mp;
  party;
  riding_name;
  credentials;
  created_at;

  constructor({
    id = null,
    first_name = null,
    last_name = null,
    username = null,
    email = null,
    phone_number = null,
    email_notification = null,
    sms_notification = null,
    active = null,
    created_at = null,
    address = null,
    street = null,
    city = null,
    province = null,
    postal_code = null,
    mp = null,
    party = null,
    riding_name = null,
    credentials = null,
  } = {}) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.username = username;
    this.email = email;
    this.phone_number = phone_number;
    this.email_notification = email_notification;
    this.sms_notification = sms_notification;
    this.active = active;
    this.address = address;
    this.street = street;
    this.city = city;
    this.province = province;
    this.postal_code = postal_code;
    this.mp = mp;
    this.party = party;
    this.riding_name = riding_name;
    this.credentials = credentials;
    this.created_at = created_at;
  }

  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  get fullAddress(): string {
    return `${this.address} ${this.street} ${this.city} ${this.province} ${this.postal_code}`;
  }
}

interface CredentialsInterface {
  user_id: string;
  type: string;
}

export class UserCredentials implements CredentialsInterface {
  user_id: string;
  type: string;

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
