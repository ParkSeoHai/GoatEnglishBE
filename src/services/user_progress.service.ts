import { HTTPException } from "hono/http-exception";
import { getInfoData } from "../utils/index.js";
import UserProgressModel, { type IUserProgress } from "../models/user_progress.model.js";

export const UserProgressService = {
    // 📌 Create or Update user progress khi user thay đổi chủ đề học tập
    processDB: async (
        {
            user_id, topic_id, lesson_id, status, score, detail, _id
        }: {
            user_id: string, lesson_id?: string, status?: string,
            topic_id: string, score: number, detail?: [], _id?: string
        }
    ) => {
        const newUserProgress = UserProgressModel.findOneAndUpdate(
            { _id },
            { 
                $set: {
                    user_id, lesson_id, status, score, detail, topic_id
                }
            },
            { upsert: true, returnNewDocument: true }
        );
        return newUserProgress;
    },
    // 📌 Get topic đã học by user_id
    getTopicLearned: async (user_id: string) => {
        const result = await UserProgressModel.find({
            user_id, lesson_id: null, score: 0
        }).lean();
        return result;
    },
    // 📌 Get user progress theo user_id, topic_id và status == in_progress
    getByUserTopicAndStatus: async (user_id: string, topic_id: string) => {
        const result = await UserProgressModel.findOne({
            user_id, topic_id, status: "in_progress"
        }).lean();
        if (!result) throw new HTTPException(404, { message: "User progress not found" });
        return result;
    },
    // 📌 Get all by user and topic 
    getAllByUserAndTopic: async (user_id: string, topic_id: string) => {
        const result = await UserProgressModel.find({
            user_id, topic_id
        }).lean();
        return result;
    },
};