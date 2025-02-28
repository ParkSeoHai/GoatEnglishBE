import type { Context, Next } from "hono";
import { LessonService } from "../services/lesson.service.js";

export const LessonController = {
    // 📌 Tạo chủ đề
    create: async (c: Context, next: Next) => {
        const { title, description, order, exercises, vocabulary, progress_id } = await c.req.json();
        const result = await LessonService.create(title, description, order, exercises, vocabulary, progress_id);
        return c.json({ message: "Tạo mới bài học thành công", data: result }, 201);
    },
    // 📌 Lấy chi tiết bài học
    getDetail: async (c: Context, next: Next) => {
        const { lesson_id } = c.req.param();
        const result = await LessonService.getDetail(lesson_id);
        return c.json({ message: "Lấy chi tiết bài học thành công", data: result }, 200);
    }
};
