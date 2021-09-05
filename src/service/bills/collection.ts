import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    page_url: { type: String, required: true },
    parliamentary_session_id: { type: String },
    description: { type: String },
    introduced_date: { type: String },
    summary_url: { type: String },
    full_text_url: { type: String },
    passed: { type: Boolean },
    createdAt: { type: Date },
    recordStatus: {
      type: String,
      required: true,
      enum: Object.values(ERecordStatus),
      default: ERecordStatus.Created,
    },
    categories: {
      type: [String],
      enum: Object.values(EBillCategories),
    },
  },
  { timestamps: true },
);

billSchema.index({ code: 1 }, { unique: true });

const collection = mongoose.model("Bill", billSchema);

export { collection as Collection };
