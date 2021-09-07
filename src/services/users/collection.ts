import mongoose from "mongoose";

import { ECredentialTypes, ERecordStatus } from "@types";

const billEventSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    credentials: {
      type: [String],
      enum: Object.values(ECredentialTypes),
      required: true,
    },
    emailNotification: { type: Boolean },
    smsNotification: { type: Boolean },
    active: { type: Boolean },
    phoneNumber: { type: String },
    address: { type: String },
    street: { type: String },
    city: { type: String },
    province: { type: String },
    postalCode: { type: String },
    mp: { type: String },
    party: { type: String },
    ridingName: { type: String },
    recordStatus: {
      type: String,
      required: true,
      enum: Object.values(ERecordStatus),
      default: ERecordStatus.Created,
    },
  },
  { timestamps: true },
);

billEventSchema.index({ email: 1 }, { unique: true });

const collection = mongoose.model("User", billEventSchema);

export { collection as Collection };
