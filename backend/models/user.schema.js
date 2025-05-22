import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "UNIT MANAGER", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

export default User;
