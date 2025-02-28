import { Document, Schema, model } from "mongoose";

const DOCUMENT_NAME = "lesson";
const COLLECTION_NAME = "lessons";

export interface ILesson extends Document {
  title: string;
  description: string;
  order: number;
  exercises: string[];
  vocabulary: string[];
  min_score: number;
  progress_id: string;
  previous_lesson_id?: string;
  next_lesson_id?: string;
}

const lessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  order: { type: Number, required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "exercise" }],
  vocabulary: [{ type: Schema.Types.ObjectId, ref: "vocabulary" }],
  min_score: { type: Number, min: 0, default: 0 },  // Điểm tối thiểu để mở khóa bài học này
  progress_id: { type: Schema.Types.ObjectId, ref: "progress" },
  previous_lesson_id: { type: Schema.Types.ObjectId, ref: "lesson" }, // Bài học trước
  next_lesson_id: { type: Schema.Types.ObjectId, ref: "lesson" }, // Bài học tiếp theo
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const LessonModel = model<ILesson>(DOCUMENT_NAME, lessonSchema);

export default LessonModel;