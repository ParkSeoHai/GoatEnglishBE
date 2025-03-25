import type { Context, Next } from "hono";
import { UserService } from "../services/user.service.js";


export const UserController = {
    // 📌 Tạo chủ đề
    createOrUpdate: async (c: Context) => {
        const { _id, username, email, role } = await c.req.json();
        const result = await UserService.createOrUpdate(_id, username, email, role || "user");
        return c.json({ message: "Thực hiện thành công", data: result }, 200);
    },
    // 📌 Get all user
    getAll: async (c: Context, next: Next) => {
        const users = await UserService.getAll();
        return c.json({ message: "Success", data: users }, 200);
    },
    // 📌 Get user by id
    getById: async (c: Context, next: Next) => {
        const { user_id } = c.req.param();
        const user = c.get("user");
        const foundUser = await UserService.getById(user_id || user.userId);
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
    getTopicsLearned: async (c: Context, next: Next) => {
        // get data user from token
        const user = c.get("user");
        const topics = await UserService.getTopicsLearned(user.userId);
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
            user_id: user.userId,
            ...data
        });
        return c.json({ message: "Hoàn thành bài học thành công", data: result }, 200);
    },
    deleteById: async (c: Context) => {
        const { user_id } = c.req.param();
        const result = await UserService.deleteById(user_id);
        return c.json({ message: "Xóa người dùng thành công", data: result }, 200);
    },
    getOldMistake: async (c: Context) => {
        const { user_id, topic_id } = c.req.param();
        const result = await UserService.getOldMistake(user_id, topic_id);
        return c.json({ message: "Lấy lỗi cũ thành công", data: result }, 200);
    }
};
