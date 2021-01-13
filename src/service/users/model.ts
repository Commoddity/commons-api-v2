import { keys } from "ts-transformer-keys";

export interface UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  email_notification: boolean;
  sms_notification: boolean;
  active: boolean;
  metadata: UserMetadata;
  created_at: Date;
}

interface UserMetadata {
  address: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  riding: {
    mp: string;
    party: string;
    name: string;
  };
}

export class User implements UserInterface {
  id;
  first_name;
  last_name;
  username;
  email;
  phone_number;
  postal_code;
  email_notification;
  sms_notification;
  active;
  metadata;
  created_at;

  constructor({
    id = null,
    first_name = null,
    last_name = null,
    username = null,
    email = null,
    phone_number = null,
    postal_code = null,
    email_notification = null,
    sms_notification = null,
    active = null,
    metadata = null,
    created_at = null,
  } = {}) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.username = username;
    this.email = email;
    this.phone_number = phone_number;
    this.postal_code = postal_code;
    this.email_notification = email_notification;
    this.sms_notification = sms_notification;
    this.active = active;
    this.metadata = metadata;
    this.created_at = created_at;
  }

  static getColumnNames(): string[] {
    return keys<UserInterface>();
  }

  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  get address(): string {
    return `${this.metadata.address} ${this.metadata.street_name} ${this.metadata.city} ${this.metadata.province} ${this.metadata.postal_code}`;
  }

  get postalCode(): string {
    return this.metadata.postal_code;
  }
}
