import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "excercise_level";
const COLLECTION_NAME = "excercise_levels";

const excerciseLevelSchema = new Schema({
  ma_muc: { type: String, require: true },
  ten_muc: { type: String, require: true }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const ExcerciseLevelModel = model(DOCUMENT_NAME, excerciseLevelSchema);

export default ExcerciseLevelModel;