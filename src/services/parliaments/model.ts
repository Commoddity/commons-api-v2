export interface IParliament {
  id?: string;
  number: number;
  startDate: Date;
  endDate?: Date;
  parliamentarySessions: IParliamentarySession[];
  createdAt?: Date;
}

export interface IParliamentarySession {
  id?: string;
  number: number;
  startDate: Date;
  endDate?: Date;
  createdAt?: Date;
  bills: string[];
}

export class Parliament implements IParliament {
  id?: string;
  number: number;
  startDate: Date;
  endDate?: Date;
  parliamentarySessions: IParliamentarySession[];
  createdAt?: Date;

  constructor({
    id,
    number,
    startDate,
    endDate,
    parliamentarySessions,
  }: IParliament) {
    this.id = id;
    this.number = number;
    this.startDate = startDate;
    this.endDate = endDate;
    this.parliamentarySessions = parliamentarySessions;
  }
}
