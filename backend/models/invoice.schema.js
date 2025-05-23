import mongoose, { model, Schema } from "mongoose";

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    financialYear: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

const Invoice = model("Invoices", invoiceSchema);

export default Invoice;
