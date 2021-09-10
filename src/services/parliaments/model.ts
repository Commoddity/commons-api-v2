import mongoose from "mongoose";
import { ERecordStatus } from "../../types";

export interface IParliament {
  id?: string;
  number: number;
  startDate: Date;
  endDate?: Date;
  parliamentarySessions: IParliamentarySession[];
  createdAt?: Date;
  updatedAt?: Date;
  recordStatus?: ERecordStatus;
}

export interface IParliamentarySession {
  sessionId?: string;
  number: number;
  startDate: Date;
  endDate?: Date;
  bills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Parliament implements IParliament {
  id?: string;
  number: number;
  startDate: Date;
  endDate?: Date;
  parliamentarySessions: IParliamentarySession[];
  createdAt?: Date;
  updatedAt?: Date;
  recordStatus?: ERecordStatus;

  constructor({
    id,
    number,
    startDate,
    endDate,
    parliamentarySessions,
    createdAt,
    updatedAt,
    recordStatus,
  }: IParliament) {
    this.id = id;
    this.number = number;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.recordStatus = recordStatus;

    const sessionsWithIds = Parliament.addSessionIds(parliamentarySessions);
    this.parliamentarySessions = sessionsWithIds;
  }

  private static addSessionIds(
    sessions: IParliamentarySession[],
  ): IParliamentarySession[] {
    return sessions.some(({ sessionId }) => Boolean(sessionId))
      ? sessions
      : sessions.map((session) => ({
          ...session,
          sessionId: new mongoose.Types.ObjectId().toString(),
        }));
  }
}
