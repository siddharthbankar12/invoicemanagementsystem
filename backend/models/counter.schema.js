import { model, Schema } from "mongoose";

const counterSchema = new Schema({
  role: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = model("Counter", counterSchema);

export default Counter;
