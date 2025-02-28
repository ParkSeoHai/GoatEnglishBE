import type { Context, Next } from "hono";
import { UserService } from "../services/user.service.js";


export const UserController = {
    // 📌 Get user by id
    getById: async (c: Context, next: Next) => {
        const user = c.get("user");
        const foundUser = await UserService.getById(user.userId);
        return c.json({ message: "Success", data: foundUser }, 200);
    },
    // 📌 Get info user
    getInfo: async (c: Context, next: Next) => {
        const user = c.get("user");
        const foundUser = await UserService.getInfo(user.userId);
        return c.json({ message: "Success", data: foundUser }, 200);
    },
    // 📌 Change topic user
    changeTopic: async (c: Context, next: Next) => {
        const { topic_id, type } = await c.req.json();
        const user = c.get("user");
        const result = await UserService.changeTopic(user.userId, topic_id, type);
        return c.json({ message: "Success", data: result }, 200);
    },
    // 📌 Get topics đã học
    getTopics: async (c: Context, next: Next) => {
        // get data user from token
        const user = c.get("user");
        const topics = await UserService.getTopics(user.userId);
        return c.json({ message: "Success", data: topics }, 200);
    },
    // 📌 Get lesson hiện tại cần học
    getLessonCurrent: async (c: Context, next: Next) => {
        // get data user from token
        const user = c.get("user");
        const { topic_id } = c.req.param();
        const lesson = await UserService.getLessonCurrent(user.userId, topic_id);
        return c.json({ message: "Lấy bài học hiện tại thành công", data: lesson }, 200);
    },
    // 📌 submit lesson
    submitLesson: async (c: Context, next: Next) => {
        // get data user from token
        const user = c.get("user");
        const { data } = await c.req.json();
        const result = await UserService.submitLesson({
            user_id: user.userId, lesson_id: data.lesson_id,
            topic_id: data.topic_id, userAnswer: data.userAnswer
        });
        return c.json({ message: "Hoàn thành bài học thành công", data: result }, 200);
    },
};
