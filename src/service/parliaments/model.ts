import { keys } from "ts-transformer-keys";

export interface ParliamentInterface {
  id: string;
  start_date: string;
  end_date: string;
  created_at: Date;
}

export class Parliament implements ParliamentInterface {
  id;
  start_date;
  end_date;
  created_at;

  static getColumnNames(): string[] {
    return keys<ParliamentInterface>();
  }

  constructor({
    id = null,
    start_date = null,
    end_date = null,
    created_at = null,
  } = {}) {
    this.id = id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.created_at = created_at;
  }
}
export interface ParliamentarySessionInterface {
  id: string;
  parliament_id: string;
  number: string;
  start_date: string;
  end_date: string;
  created_at: Date;
}

export class ParliamentarySession implements ParliamentarySessionInterface {
  id;
  parliament_id;
  number;
  start_date;
  end_date;
  created_at;

  static getColumnNames(): string[] {
    return keys<ParliamentarySessionInterface>();
  }

  constructor({
    id = null,
    parliament_id = null,
    number = null,
    start_date = null,
    end_date = null,
    created_at = null,
  } = {}) {
    this.id = id;
    this.parliament_id = parliament_id;
    this.number = number;
    this.start_date = start_date;
    this.end_date = end_date;
    this.created_at = created_at;
  }
}
