import { TopicService } from "../services/topic.service.js";

export const TopicController = {
    // 📌 Tạo chủ đề
    create: async (c: any) => {
        const { name, description, image } = await c.req.json();
        const result = await TopicService.create(name, description, image);
        return c.json({ message: "Tạo mới chủ đề thành công", data: result }, 201);
    },

    getAll: async (c: any) => {
        const topics = await TopicService.getAll();
        return c.json({ message: "Success", data: topics }, 200);
    }
};
