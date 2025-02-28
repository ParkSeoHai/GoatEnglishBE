import { HTTPException } from "hono/http-exception";
import { getInfoData } from "../utils/index.js";
import type { IExercise } from "../models/exercise.model.js";
import ExerciseModel from "../models/exercise.model.js";
import { ExerciseTypeService } from "./exercise_type.service.js";
import { ExerciseLevelService } from "./exercise_level.service.js";

export const ExerciseService = {
    // 📌 Tạo mới
    create: async (
        { 
            type, level, question, options, multiple_correct, correct_answer, audio, answer, correct_text
        }:
        {
            type: string, level: string, question: string,
            options?: string[], multiple_correct?: boolean,
            correct_answer?: string | string[], audio?: string,
            answer?: string, correct_text?: string
        }
    ) => {
        // Tạo mới Exercise
        const newExercise: IExercise = new ExerciseModel({
            type, level, question, options, multiple_correct,
            correct_answer, audio, answer, correct_text
        });
        // Lưu vào database
        const savedExercise = await newExercise.save();
        return savedExercise;
    },
    // 📌 Get detail by id
    getDetailById: async (exercise_id: string) => {
        const exercise = await ExerciseModel.findById(exercise_id).lean();
        if (!exercise) throw new HTTPException(404, { message: "Không tìm thấy bài tập" });
        // get exercise type and exercise level
        const type = await ExerciseTypeService.getById(exercise.type);
        const level = await ExerciseLevelService.getById(exercise.level);
        // Xử lý question: chuyển đổi "A _ is a collection" => [{ text: A }, { text: _ }]
        const splitQuestion = exercise.question.split(" ");
        const newQuestion = splitQuestion.map((item) => ({ text: item }));
        const splitAnswer = exercise.answer?.split(" ");
        const newAnswer = splitAnswer?.map((item) => ({ text: item }));
        return {
            question: newQuestion,
            answer: newAnswer,
            ...type, ...level,
            ...getInfoData({ data: exercise, fields: ["_id", "options", "multiple_correct", "correct_answer", "correct_text", "audio"] })
        };
    }
};