import type { Context, Next } from "hono";
import { ExerciseService } from "../services/exercise.service.js";

export const ExerciseController = {
    // 📌 Tạo Exercise
    create: async (c: Context, next: Next) => {
        const { type, level, question, options, multiple_correct, correct_answer, audio, answer, correct_text } = await c.req.json();
        const result = await ExerciseService.create({
            type, level, question, options, multiple_correct, correct_answer, audio, answer, correct_text
        });
        return c.json({ message: "Tạo mới bài tập thành công", data: result }, 201);
    },
};
