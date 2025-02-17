import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "excercise";
const COLLECTION_NAME = "excercises";

const excerciseSchema = new Schema({
  type: { type: Schema.Types.ObjectId, ref: "excercise_type", required: true }, // Liên kết với ExerciseType
  level: { type: Schema.Types.ObjectId, ref: "excercise_level", required: true }, // Liên kết với ExerciseLevel
  question: { type: String, required: true },
  options: [{ type: String }],
  multiple_correct: { type: Boolean, default: false },
  correct_answer: { type: Schema.Types.Mixed, required: true }, // String hoặc Array<String>
  audio: { type: String },
  answer: { type: String }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const ExcerciseModel = model(DOCUMENT_NAME, excerciseSchema);

export default ExcerciseModel;