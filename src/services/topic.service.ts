import { HTTPException } from "hono/http-exception";
import TopicModel, { type ITopic } from "../models/topic.model.js";
import { getInfoData } from "../utils/index.js";

export const TopicService = {
    // 📌 Tạo mới chủ đề
    create: async (name: string, description: string, image?: string) => {
        const newTopic: ITopic = new TopicModel({
            name, description, image
        });
        return await newTopic.save();
    },

    // 📌 Get user by id
    getById: async (topic_id: string) => {
        const topic = await TopicModel.findById(topic_id).lean();
        if (!topic) throw new HTTPException(404, { message: "Topic not found" });
        return getInfoData({ fields: ["_id", "name", "description", "image"], data: topic });
    },

    getAll: async () => {
        const topics = await TopicModel.find();
        return topics;
    }
};