import { HTTPException } from "hono/http-exception";
import { getInfoData } from "../utils/index.js";
import type { IExerciseType } from "../models/exercise_type.model.js";
import ExerciseTypeModel from "../models/exercise_type.model.js";

export const ExerciseTypeService = {
    // 📌 Tạo mới
    create: async (ma_muc: string, ten_muc: string) => {
        const newItem: IExerciseType = new ExerciseTypeModel({
            ma_muc, ten_muc
        });
        return await newItem.save();
    },
    // 📌 Get by id
    getById: async (id: string) => {
        const data = await ExerciseTypeModel.findById(id).lean();
        if (!data) throw new HTTPException(404, { message: "Không tìm thấy loại bài tập" });
        return {
            type_id: data._id,
            type_ma_muc: data.ma_muc,
            type_ten_muc: data.ten_muc
        };
    },
    getAll: async () => {
        const data = await ExerciseTypeModel.find().lean();
        return data;
    }
};