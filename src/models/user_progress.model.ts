import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "user_progress";
const COLLECTION_NAME = "user_progresses";

const userProgressSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
  topic_id: { type: Schema.Types.ObjectId, ref: "topic", required: true },
  lesson_id: { type: Schema.Types.ObjectId, ref: "lesson", required: true },
  status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
  score: { type: Number, default: 0 },
  detail: [{
    exercise_id: { type: Schema.Types.ObjectId, ref: "exercise", required: true }, // Bài tập đã làm
    user_answer: { type: Schema.Types.Mixed, required: true }, // Câu trả lời của user (String hoặc Array<String>)
    correct: { type: Boolean, required: true }, // Đáp án đúng/sai
    // time_spent: { type: Number, default: 0 } // Thời gian làm bài (tính bằng giây)
  }]
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const UserProgressModel = model(DOCUMENT_NAME, userProgressSchema);

export default UserProgressModel;