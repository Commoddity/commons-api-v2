import mongoose from "mongoose";

const billEventSchema = new mongoose.Schema(
  {
    bill_code: { type: String, required: true },
    title: { type: String, required: true },
    publication_date: { type: Date, required: true },
  },
  { timestamps: true },
);

billEventSchema.index({ bill_code: 1, title: 1 }, { unique: true });

const collection = mongoose.model("BillEvent", billEventSchema);

export { collection as Collection };
