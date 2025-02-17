import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "progress";
const COLLECTION_NAME = "progresses";

const progressSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  order: { type: Number, required: true },
  topic_id: { type: Schema.Types.ObjectId, ref: "topic", required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: "lesson" }]
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const ProgressModel = model(DOCUMENT_NAME, progressSchema);

export default ProgressModel;