export interface IParliament {
  id?: string;
  number: number;
  start_date: Date;
  end_date?: Date;
  parliamentarySessions: IParliamentarySession[];
  createdAt?: Date;
}

export interface IParliamentarySession {
  id?: string;
  number: number;
  start_date: Date;
  end_date?: Date;
  createdAt?: Date;
  bills: string[];
}

export class Parliament implements IParliament {
  id?: string;
  number: number;
  start_date: Date;
  end_date?: Date;
  parliamentarySessions: IParliamentarySession[];
  createdAt?: Date;

  constructor({
    id,
    number,
    start_date,
    end_date,
    parliamentarySessions,
  }: IParliament) {
    this.id = id;
    this.number = number;
    this.start_date = start_date;
    this.end_date = end_date;
    this.parliamentarySessions = parliamentarySessions;
  }
}
