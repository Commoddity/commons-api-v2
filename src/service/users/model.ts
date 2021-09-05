interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  email_notification: boolean;
  sms_notification: boolean;
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
  createdAt: Date;
}

export class User implements IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  credentials: ECredentialTypes[];
  email_notification: boolean;
  sms_notification: boolean;
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
  createdAt: Date;

  constructor({
    id,
    first_name,
    last_name,
    email,
    email_notification,
    sms_notification,
    active,
    phone_number,
    address,
    street,
    city,
    province,
    postal_code,
    mp,
    party,
    riding_name,
    createdAt,
    credentials,
  }: UserInput) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.email_notification = email_notification;
    this.sms_notification = sms_notification;
    this.active = active;
    this.phone_number = phone_number;
    this.address = address;
    this.street = street;
    this.city = city;
    this.province = province;
    this.postal_code = postal_code;
    this.mp = mp;
    this.party = party;
    this.riding_name = riding_name;
    this.createdAt = createdAt;
    this.credentials = credentials;
  }

  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  get fullAddress(): string {
    return `${this.address} ${this.street} ${this.city} ${this.province} ${this.postal_code}`;
  }
}

interface PCognitoUserInput {
  first_name: string;
  last_name: string;
  email: string;
  credentials: ECredentialTypes[];
}

export class UserInput {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  email_notification: boolean;
  sms_notification: boolean;
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
  createdAt: Date;
  credentials: ECredentialTypes[];

  constructor({
    first_name,
    last_name,
    email,
    credentials,
  }: PCognitoUserInput) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.credentials = credentials;
  }
}
