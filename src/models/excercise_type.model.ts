import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "excercise_type";
const COLLECTION_NAME = "excercise_types";

const excerciseTypeSchema = new Schema({
  ma_muc: { type: String, require: true },
  ten_muc: { type: String, require: true }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const ExcerciseTypeModel = model(DOCUMENT_NAME, excerciseTypeSchema);

export default ExcerciseTypeModel;