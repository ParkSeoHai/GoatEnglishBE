import type { Context, Next } from "hono";
import { ExerciseLevelService } from "../services/exercise_level.service.js";

export const ExerciseLevelController = {
    // 📌 Tạo ExerciseLevel
    create: async (c: Context, next: Next) => {
        const { ma_muc, ten_muc } = await c.req.json();
        const result = await ExerciseLevelService.create(ma_muc, ten_muc);
        return c.json({ message: "Tạo mới cấp độ bài tập thành công", data: result }, 201);
    },
};
