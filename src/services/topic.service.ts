import { HTTPException } from "hono/http-exception";
import TopicModel, { type ITopic } from "../models/topic.model.js";

export const TopicService = {
    // 📌 Tạo mới chủ đề
    create: async (name: string, description: string, image?: string) => {
        const newTopic: ITopic = new TopicModel({
            name, description, image
        });
        return await newTopic.save();
    },

    getAll: async () => {
        const topics = await TopicModel.find();
        return topics;
    }
};