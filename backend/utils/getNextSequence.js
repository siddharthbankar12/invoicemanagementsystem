import Counter from "../models/counter.schema.js";

export const getNextSequence = async (role) => {
  const counter = await Counter.findOneAndUpdate(
    { role },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};
