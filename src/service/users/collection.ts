import mongoose from "mongoose";

const billEventSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    credentials: {
      type: [String],
      enum: Object.values(ECredentialTypes),
      required: true,
    },
    email_notification: { type: Boolean },
    sms_notification: { type: Boolean },
    active: { type: Boolean },
    phone_number: { type: String },
    address: { type: String },
    street: { type: String },
    city: { type: String },
    province: { type: String },
    postal_code: { type: String },
    mp: { type: String },
    party: { type: String },
    riding_name: { type: String },
  },
  { timestamps: true },
);

billEventSchema.index({ bill_code: 1, title: 1 }, { unique: true });

const collection = mongoose.model("BillEvent", billEventSchema);

export { collection as Collection };
