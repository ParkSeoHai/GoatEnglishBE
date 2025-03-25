import { HTTPException } from "hono/http-exception";
import { getInfoData } from "../utils/index.js";
import UserModel from "../models/user.model.js";
import { Types } from "mongoose";
import { TopicService } from "./topic.service.js";
import { UserProgressService } from "./user_progress.service.js";
import { LessonService } from "./lesson.service.js";
import { ProgressService } from "./progress.service.js";
import _ from "lodash";
import { UserTopicService } from "./user_topic.service.js";
import UserProgressModel from "../models/user_progress.model.js";
import { ExerciseService } from "./exercise.service.js";

export const UserService = {
    // 📌 Tạo mới user
    createOrUpdate: async (_id: string | null, username: string, email: string, role: string) => {
        // Cập nhật hoặc tạo mới nếu `_id` không tồn tại
        let updatedUser;
        if (!_id) {
            updatedUser = await UserModel.create({
                username, email, role
            });
        } else {
            updatedUser = await UserModel.findOneAndUpdate(
                { _id }, 
                { username, email, role }, 
                { upsert: true, new: true } 
            );
        }
        return updatedUser;
    },
    // 📌 Get all user
    getAll: async () => {
        const users = await UserModel.find({ is_delete: false }).lean();
        return getInfoData({ fields: ["_id", "username", "email", "topic_id", "role"], data: users });
    },
    // 📌 Get user by id
    getById: async (user_id: string) => {
        const user = await UserModel.findById(user_id).lean();
        if (!user) throw new HTTPException(404, { message: "User not found" });
        return getInfoData({ fields: ["_id", "username", "email", "topic_id", "role"], data: user });
    },
    // 📌 Get info user
    getInfo: async (user_id: string) => {
        const user = await UserModel.findById(user_id).lean();
        if (!user) throw new HTTPException(404, { message: "User not found" });
        // get topic and score
        let score = 0;
        let topic = null;
        if (user.topic_id) {
            topic = await TopicService.getById(user.topic_id?.toString());
            // get score user
            const userProgresses = await UserProgressService.getAllByUserAndTopic(user._id?.toString(), user.topic_id?.toString());
            score = _.sumBy(userProgresses, "score");
        }
        return {
            user: getInfoData({ fields: ["_id", "username", "email", "topic_id"], data: user }),
            topic, score
        };
    },
    // 📌 Change topic user
    changeTopic: async (user_id: string, topic_id: string, type: string) => {
        // check user
        const user = await UserModel.findById(user_id);
        if (!user) throw new HTTPException(404, { message: "User not found" });
        // update topic
        user.topic_id = new Types.ObjectId(topic_id);
        await user.save();
        // nếu bắt đầu chủ để mới thì update
        if (type === "start") {
            // update user topic
            const newUserTopic = await UserTopicService.processDB({ user_id, topic_id });
            // update user progress first
            const newUserProgress = await UserProgressService.processDB({
                user_id, status: "in_progress", score: 0, lesson_id: null, progress_id: null, topic_id
            });
            return { user: getInfoData({ fields: ["_id", "username", "email", "topic_id"], data: user }), newUserTopic, newUserProgress };
        }
        return getInfoData({ fields: ["_id", "username", "email", "topic_id"], data: user });
    },
    // 📌 Get topics đã học
    getTopicsLearned: async (user_id: string) => {
        const topicsLearned = await UserTopicService.getByUser(user_id);
        return topicsLearned;
    },
    // 📌 Get lesson hiện tại cần học
    getLessonCurrent: async (user_id: string, topic_id: string) => {
        // Tìm tiến trình học của user
        const userProgress = await UserProgressModel.findOne({ user_id, topic_id, status: "in_progress" })
            .populate("lesson_id").populate("progress_id").lean();
        // Nếu chưa có tiến trình học thì tạo mới
        if (!userProgress) {
            // Lấy progress đầu tiên của chủ đề
            const firstProgress = await ProgressService.getFirstByTopic(topic_id);
            // Lấy bài học đầu tiên của progress
            const lesson: any = await LessonService.getFirstByProgress(firstProgress._id.toString());
            // update user progress
            const newUserProgress = await UserProgressService.processDB({
                user_id, status: "in_progress", score: 0, lesson_id: lesson._id.toString(),
                progress_id: firstProgress._id.toString(), topic_id
            });
            return newUserProgress;
        }
        return userProgress;
    },
    // 📌 submit lesson
    submitLesson: async (
        { user_id, lesson_id, topic_id, progress_id, status = "completed", score = 50, detail }:
        { user_id: string, lesson_id: string, topic_id: string, progress_id: string, status: string, score: number, detail: []}
    ) => {
        const userProgress: any = await UserProgressModel.findOne({ user_id, lesson_id, topic_id, progress_id });
        if (!userProgress) throw new HTTPException(404, { message: "Không tìm thấy bài học" });
        // update
        const result = await UserProgressService.processDB({
            user_id, lesson_id, topic_id, progress_id, status, score, detail, _id: userProgress?._id?.toString()
        });
        if (!result) throw new HTTPException(400, { message: "Không thể cập nhật bài học" });
        // add lesson tiếp theo vào user progress
        // Lấy bài học tiếp theo từ danh sách bài học của progress
        const lessonsProgress = await LessonService.getByProgressId(progress_id);
        const lessonIndex = lessonsProgress.findIndex((lesson) => lesson._id.toString() === lesson_id);
        const nextLesson = lessonsProgress[lessonIndex + 1];
        if (nextLesson) {
            // update user progress
            await UserProgressService.processDB({
                user_id, status: "in_progress", score: 0, lesson_id: nextLesson._id.toString(),
                progress_id, topic_id
            });
        } else {
            // Nếu không có bài học tiếp theo thì chuyển sang progress tiếp theo của chủ đề
            const nextProgress: any = await ProgressService.getNextByTopic(topic_id, progress_id);
            if (nextProgress) {
                // Lấy bài học đầu tiên của progress
                const firstLesson: any = await LessonService.getFirstByProgress(nextProgress._id.toString());
                if (!firstLesson) throw new HTTPException(404, { message: "Không tìm thấy bài học" });
                // update user progress
                await UserProgressService.processDB({
                    user_id, status: "in_progress", score: 0, lesson_id: firstLesson._id.toString(),
                    progress_id: nextProgress._id.toString(), topic_id
                });
            }
        }
        return null;
    },
    deleteById: async (user_id: string) => {
        const user = await UserModel.findOne({ _id: user_id, is_delete: false });
        if (!user) throw new HTTPException(404, { message: "Chủ đề không tồn tại" });
        user.is_delete = true;
        return await user.save();
    },
    getOldMistake: async (user_id: string, topic_id: string) => {
        const userProgresses = await UserProgressService.getAllByUserAndTopic(user_id, topic_id);
        // get exercise from detail of user progress
        let oldMistakes: any = [];
        // get detail exercise
        await Promise.all(userProgresses.map(async (progress) => {
            if (progress.detail) {
                await Promise.all(progress.detail.map(async (item) => {
                    if (item.correct === false) {
                        // get exercise by item.exercise_id
                        const exercise = await ExerciseService.getById(item.exercise_id);
                        oldMistakes.push({ ...item, exercise });
                    }
                }));
            }
        }));
        return oldMistakes;
    }
};