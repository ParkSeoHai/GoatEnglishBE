import { HTTPException } from "hono/http-exception";
import { getInfoData } from "../utils/index.js";
import LessonModel, { type ILesson } from "../models/lesson.model.js";
import { ExerciseService } from "./exercise.service.js";
import { VoCabularyService } from "./vocabulary.service.js";
import { Types } from "mongoose";
import { ProgressService } from "./progress.service.js";
import { TopicService } from "./topic.service.js";

export const LessonService = {
    // 📌 Tạo mới hoặc cập nhật bài học
    createOrUpdate: async (
        _id: string | null, title: string, description: string, order: number,
        exercises: { 
            _id: string, type: string, level: string, question: string, options: string[], 
            multiple_correct: boolean, correct_answer: string, audio: string, explain_answer: string,
            explain_answer_vn: string
        }[],
        vocabularies: string[], progress_id: string, status: string
    ) => {
        // Kiểm tra trạng thái hợp lệ
        if (!["publish", "draft"].includes(status)) {
            throw new HTTPException(400, { message: "Trạng thái không hợp lệ" });
        }
        // Xử lý bài tập
        const processExercises = async () => {
            return Promise.all(exercises.map(async (exercise) => {
                const newExercise = await ExerciseService.createOrUpdate(exercise);
                if (!newExercise) throw new HTTPException(400, { message: "Không thể tạo hoặc cập nhật bài tập" });
                return newExercise._id;
            }));
        };
        const [newExercises] = await Promise.all([processExercises()]);
        // Kiểm tra xem bài học đã tồn tại chưa
        const updateData = { title, description, order, exercises: newExercises, vocabularies, progress_id, status };
        const lesson = await LessonModel.findByIdAndUpdate(_id || new Types.ObjectId(), updateData, { new: true, upsert: true });
        return lesson;
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
        // get exercises by ref id
        const exercisesPromise = await Promise.all(lesson.exercises.map(async (exercise_id: string) => {
            const exercise = await ExerciseService.getById(exercise_id);
            return getInfoData({ 
                data: exercise, fields: [
                    "_id", "type", "level", "question", "options", "multiple_correct", 
                    "correct_answer", "audio", "explain_answer", "explain_answer_vn"]
            });
        }));
        // get vocabularies by ref id
        const vocabulariesPromise = await Promise.all(lesson.vocabularies.map(async (vocabulary_id: string) => {
            const vocabulary = await VoCabularyService.getById(vocabulary_id);
            return vocabulary;
        }));
        // get progress by ref id
        const progress = await ProgressService.getById(lesson.progress_id);
        // get topic by ref id
        const topic = await TopicService.getById(progress.topic_id);
        return {
            ...getInfoData({ data: lesson, fields: ["_id", "title", "description", "order", "progress_id", "exercises", "vocabularies", "status"] }),
            exercises: exercisesPromise, progress, vocabularies: vocabulariesPromise, topic
        };
    },
    getFirstByProgress: async (progress_id: string) => {
        const lesson = await LessonModel
            .findOne({ progress_id, is_delete: false })
            .sort({ createdAt: 1 }).lean();
        return lesson;
    },
    // 📌 Get lesson by progress
    getByProgressId: async (progress_id: string) => {
        const lessons = await LessonModel.find({ progress_id, is_delete: false }).sort({ createdAt: 1 }).lean();
        return lessons;
    },
    // 📌 Get all lesson
    getAll: async (page = 1, limit = 10, search = '') => {
        const query: any = { is_delete: false };
        // Nếu có từ khóa tìm kiếm, tìm theo tiêu đề hoặc mô tả của topic
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // Tìm trong name của lesson
                { description: { $regex: search, $options: 'i' } }, // Tìm trong description của lesson
            ];
        }
        // Tính toán số bản ghi bỏ qua
        const skip = (page - 1) * limit;
        // Truy vấn dữ liệu với populate, phân trang và tìm kiếm
        const lessons = await LessonModel.find(query)
            .skip(skip) // Bỏ qua số lượng bản ghi tương ứng với trang
            .limit(limit) // Giới hạn số lượng bản ghi mỗi trang
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước
        // Lấy tổng số lượng bản ghi (phục vụ cho tổng số trang)
        const totalRecords = await LessonModel.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / limit);
        return {
            lessons,
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
            },
        };
    },
    // 📌 Xóa bài học
    deleteLesson: async (lesson_id: string) => {
        const lesson = await LessonModel.findByIdAndUpdate(lesson_id, { is_delete: true }, { new: true });
        if (!lesson) throw new HTTPException(404, { message: "Không tìm thấy bài học" });
        return lesson;
    }
};