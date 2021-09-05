import mongoose from "mongoose";

const parliamentarySessionsSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    bills: { type: [String], required: true },
  },
  { timestamps: true },
);

const parliamentSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    parliamentarySessions: {
      type: [parliamentarySessionsSchema],
      required: true,
    },
  },
  { timestamps: true },
);

parliamentSchema.index({ number: 1 }, { unique: true });

const collection = mongoose.model("Parliament", parliamentSchema);

export { collection as Collection };
