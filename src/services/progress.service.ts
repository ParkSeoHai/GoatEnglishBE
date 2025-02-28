import { HTTPException } from "hono/http-exception";
import ProgressModel, { type IProgress } from "../models/progress.model.js";
import { getInfoData } from "../utils/index.js";
import { LessonService } from "./lesson.service.js";

export const ProgressService = {
    // 📌 Tạo mới chủ đề
    create: async (name: string, description: string, icon: string, order: number, topic_id: string, ) => {
        const newProgress: IProgress = new ProgressModel({
            name, description, icon, order, topic_id
        });
        return await newProgress.save();
    },
    // 📌 Get all progress by topic
    getAllByTopic: async (topic_id: string) => {
        const progresses = await ProgressModel.find({ topic_id })
            .sort({ order: 1 })
            .lean();

        if (!progresses.length) return [];
        // Lấy tất cả lessons cho mỗi progress bằng Promise.all()
        const progressesWithLessons = await Promise.all(
            progresses.map(async (progress) => {
                const lessons = await LessonService.getByProgressId(progress._id.toString());
                return {
                    _id: progress._id,
                    name: progress.name,
                    description: progress.description,
                    icon: progress.icon,
                    order: progress.order,
                    topic_id: progress.topic_id,
                    lessons,
                };
            })
        );
    
        return progressesWithLessons;
    },
    // 📌 Get progress đầu tiên của chủ đề
    getFirstByTopic: async (topic_id: string) => {
        const progress = await ProgressModel.findOne({ topic_id }).lean();
        if (!progress) throw new HTTPException(404, { message: "Không tìm thấy lộ trình" });
        return progress;
    },
    // 📌 Get progress by topic id và thứ tự order
    getByTopicIdAndOrder: async (topic_id: string, order: number) => {
        const progress = await ProgressModel.findOne({ topic_id, order }).lean();
        if (!progress) throw new HTTPException(404, { message: "Không tìm thấy lộ trình" });
        return progress;
    },
};