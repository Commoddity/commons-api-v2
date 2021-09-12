import mongoose from "mongoose";

import { User } from "./model";
import { EBillCategories, ECredentialTypes, ERecordStatus } from "../../types";

const userSchema = new mongoose.Schema<User>(
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
    bills: { type: [String] },
    categories: { type: [String], enum: Object.values(EBillCategories) },
    recordStatus: {
      type: String,
      required: true,
      enum: Object.values(ERecordStatus),
      default: ERecordStatus.Created,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

const collection = mongoose.model<User>("User", userSchema);

export { collection as Collection };
