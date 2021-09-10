import mongoose from "mongoose";

import { Parliament, IParliamentarySession } from "./model";
import { ERecordStatus } from "../../types";

const parliamentarySessionsSchema = new mongoose.Schema<IParliamentarySession>(
  {
    sessionId: { type: String, required: true },
    number: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    bills: { type: [String], required: true },
  },
  { timestamps: true, _id: false },
);

const parliamentSchema = new mongoose.Schema<Parliament>(
  {
    number: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    parliamentarySessions: {
      type: [parliamentarySessionsSchema],
      required: true,
    },
    recordStatus: {
      type: String,
      required: true,
      enum: Object.values(ERecordStatus),
      default: ERecordStatus.Created,
    },
  },
  { timestamps: true },
);

parliamentSchema.index({ number: 1 }, { unique: true });

const collection = mongoose.model<Parliament>("Parliament", parliamentSchema);

export { collection as Collection };
