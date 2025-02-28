import { HTTPException } from "hono/http-exception";
import { getInfoData } from "../utils/index.js";
import LessonModel, { type ILesson } from "../models/lesson.model.js";
import { ProgressService } from "./progress.service.js";
import { ExerciseService } from "./exercise.service.js";

export const LessonService = {
    // 📌 Tạo mới chủ đề
    create: async (title: string, description: string, order: number, exercises: [string], vocabulary: [string], progress_id: string) => {
        const newLesson: ILesson = new LessonModel({
            title, description, order, exercises, vocabulary, progress_id
        });
        return await newLesson.save();
    },
    // 📌 Get lesson by id
    getById: async (lesson_id: string) => {
        const lesson = await LessonModel.findById(lesson_id).lean();
        if (!lesson) throw new HTTPException(404, { message: "Không tìm thấy bài học" });
        // return getInfoData({ data: lesson, fields: ["_id", "title", "description", "order", "exercises", "vocabulary", "min_score"] });
        return lesson;
    },
    // 📌 Lấy chi tiết bài học
    getDetail: async (lesson_id: string) => {
        const lesson = await LessonModel.findById(lesson_id).lean();
        if (!lesson) throw new HTTPException(404, { message: "Không tìm thấy bài học" });
        // get exercises
        const exercisesPromise = await Promise.all(
            lesson.exercises.map(async (exercise_id) => {
                const data = await ExerciseService.getDetailById(exercise_id);
                return data;
            })
        );
        return {
            ...getInfoData({ data: lesson, fields: ["_id", "title", "description", "order", "vocabulary", "min_score"] }),
            exercises: exercisesPromise
        };
    },
    // 📌 Get lesson by progress
    getByProgressId: async (progress_id: string) => {
        const lesson = await LessonModel.findOne({ progress_id }).lean();
        return lesson;
    }
};