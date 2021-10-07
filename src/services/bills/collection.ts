import mongoose from "mongoose";

import { Bill, BillEvent, EBillType, IBillMediaSource } from "./model";
import { EBillCategories, ERecordStatus } from "../../types";

const billEventSchema = new mongoose.Schema<BillEvent>(
  {
    eventId: { type: String, required: true },
    title: { type: String, required: true },
    publicationDate: { type: Date, required: true },
  },
  { timestamps: true, _id: false },
);

const mediaBiasFactCheckDataSchema = new mongoose.Schema<
  IBillMediaSource["mbfcData"]
>(
  {
    biasRating: { type: String, required: true },
    factualRating: { type: String, required: true },
    country: { type: String, required: true },
    credibilityRating: { type: String },
  },
  { timestamps: false, _id: false },
);

const mediaSourcesSchema = new mongoose.Schema<IBillMediaSource>(
  {
    articleTitle: { type: String, required: true },
    articleUrl: { type: String, required: true },
    mediaSource: { type: String, required: true },
    excerpt: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    mbfcData: { type: mediaBiasFactCheckDataSchema, required: true },
  },
  { timestamps: true, _id: true },
);

const billSchema = new mongoose.Schema<Bill>(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    pageUrl: { type: String, required: true },
    events: { type: [billEventSchema], required: true },
    parliamentarySessionId: { type: String },
    description: { type: String },
    summaryUrl: { type: String },
    fullTextUrl: { type: String },
    passed: { type: Boolean },
    introducedDate: { type: Date },
    passedDate: { type: Date },
    mediaSources: { type: [mediaSourcesSchema] },
    categories: {
      type: [String],
      enum: Object.values(EBillCategories),
    },
    type: {
      type: String,
      enum: Object.values(EBillType),
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

billSchema.index({ code: 1 }, { unique: true });

const collection = mongoose.model<Bill>("Bill", billSchema);

export { collection as Collection };
