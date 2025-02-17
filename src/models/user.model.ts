import { Document, Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "user";
const COLLECTION_NAME = "users";

// 🛠 Định nghĩa interface cho User
export interface IUser extends Document {
  username: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  topic_id: Types.ObjectId | null;
}

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  topic_id: { type: Schema.Types.ObjectId, ref: "topic", required: false }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

const UserModel = model<IUser>(DOCUMENT_NAME, userSchema);

export default UserModel;