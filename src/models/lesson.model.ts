import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "lesson";
const COLLECTION_NAME = "lessons";

const lessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  order: { type: Number, required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "exercise" }],
  vocabulary: [{ type: Schema.Types.ObjectId, ref: "vocabulary" }]
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const LessonModel = model(DOCUMENT_NAME, lessonSchema);

export default LessonModel;