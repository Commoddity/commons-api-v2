import mongoose from "mongoose";

import {
  IBillAddedFields,
  EBillCategories,
  ERecordStatus,
  IBillMediaSource,
} from "../../types";

const mediaBiasFactCheckDataSchema = new mongoose.Schema<IBillMediaSource["mbfcData"]>(
  {
    biasRating: { type: String, required: true },
    factualReporting: { type: String, required: true },
    country: { type: String, required: true },
    credibilityRating: { type: String },
    trafficPopularity: { type: String },
  },
  { timestamps: false, _id: false },
);

const mediaSourcesSchema = new mongoose.Schema<IBillMediaSource>(
  {
    mediaSourceId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    source: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    author: { type: String },
    publicationDate: { type: String },
    ttr: { type: Number },
    mbfcData: { type: mediaBiasFactCheckDataSchema, required: true },
    bpPressArticleRating: { type: Number, required: true },
    isEditorial: { type: Boolean, required: true },
  },
  { timestamps: true, _id: false },
);

const billSchema = new mongoose.Schema<IBillAddedFields>(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    pageUrl: { type: String, required: true },
    parliamentarySession: { type: String },
    fullTextUrl: { type: String },
    mediaSources: { type: [mediaSourcesSchema] },
    categories: {
      type: [String],
      enum: Object.values(EBillCategories),
    },
    recordStatus: {
      type: String,
      required: true,
      enum: Object.values(ERecordStatus),
      default: ERecordStatus.created,
    },
  },
  { timestamps: true },
);

billSchema.index({ code: 1, parliamentarySession: 1 }, { unique: true });

const collection = mongoose.model<IBillAddedFields>("Bill", billSchema);

export { collection as Collection };
