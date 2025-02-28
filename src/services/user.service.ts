import { HTTPException } from "hono/http-exception";
import { getInfoData } from "../utils/index.js";
import UserModel from "../models/user.model.js";
import { Types } from "mongoose";
import { TopicService } from "./topic.service.js";
import { UserProgressService } from "./user_progress.service.js";
import { LessonService } from "./lesson.service.js";
import { ProgressService } from "./progress.service.js";
import _ from "lodash";

export const UserService = {
    // 📌 Get user by id
    getById: async (user_id: string) => {
        const user = await UserModel.findById(user_id).lean();
        if (!user) throw new HTTPException(404, { message: "User not found" });
        return getInfoData({ fields: ["_id", "username", "email", "topic_id"], data: user });
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
            // update user progress nếu chưa có lịch sử học tập
            const userProgress = await UserProgressService.processDB({
                user_id, score: 0, topic_id
            });
        }
        return getInfoData({ fields: ["_id", "username", "email", "topic_id"], data: user });
    },
    // 📌 Get topics đã học
    getTopics: async (user_id: string) => {
        const data = await UserProgressService.getTopicLearned(user_id);
        return data;
    },
    // 📌 Get lesson hiện tại cần học
    getLessonCurrent: async (user_id: string, topic_id: string) => {
        // get user progress theo user_id, topic_id và status == in_progress
        const userProgress = await UserProgressService.getByUserTopicAndStatus(user_id, topic_id);
        let lessonCurrent = await LessonService.getById(userProgress.lesson_id);
        // lấy bài học đầu tiên nếu lesson_id === null
        const progress = await ProgressService.getFirstByTopic(topic_id);
        // get bài học tiếp theo của progress
        // const lesson_id_next = progress.lessons.length > 1 ? progress.lessons[1] : null;
        // if (lesson_id_next) {
        //     lessonNext = await LessonService.getNextByProgress(topic_id, progress.order, lessonCurrent.order, lesson_id_next);
        // }
        let lessonNext = null;
        if (lessonCurrent.next_lesson_id) {
            lessonNext = await LessonService.getById(lessonCurrent.next_lesson_id);
        }
        return { 
            ...getInfoData({
                data: lessonCurrent,
                fields: ["title", "vocabulary", "min_score"]
            }),
            ...getInfoData({ data: progress, fields: ["name", "description", "icon", "topic_id"] }),
            lesson_order: lessonCurrent.order,
            progress_order: progress.order,
            min_score_next: lessonNext?.min_score,
            lesson_id: lessonCurrent._id,
            lesson_description: lessonCurrent.description
        };
    },
    // 📌 submit lesson
    submitLesson: async (
        { user_id, lesson_id, topic_id, userAnswer }:
        { user_id: string, lesson_id: string, topic_id: string, userAnswer: []}
    ) => {
        // update
        const result = await UserProgressService.processDB({
            user_id, lesson_id, topic_id, score: 50, status: 'completed', detail: userAnswer
        });
        // add lesson tiếp theo vào user progress

        return result;
    },
};