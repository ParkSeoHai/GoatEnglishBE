import type { Context, Next } from "hono";
import { ProgressService } from "../services/progress.service.js";

export const ProgressController = {
    // 📌 Tạo chủ đề
    create: async (c: Context, next: Next) => {
        const { name, description, icon, order, topic_id } = await c.req.json();
        const result = await ProgressService.create(name, description, icon, order, topic_id);
        return c.json({ message: "Tạo mới progress thành công", data: result }, 201);
    },
    // 📌 Get all progress by topic
    getAllByTopic: async (c: Context, next: Next) => {
        const { topic_id } = c.req.param();
        const progresses = await ProgressService.getAllByTopic(topic_id);
        return c.json({ message: "Lấy danh sách progress thành công", data: progresses }, 200);
    }
};
