import { Hono, type Context } from 'hono';
import { asyncHandler } from '../utils/async_handler.util.js';
import { LessonController } from '../controllers/lesson.controller.js';
import LessonModel from '../models/lesson.model.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const app = new Hono();

app.get('/ping', (c: any) => c.text("PING LESSON API"));
// Create Lesson
app.post('/', asyncHandler(LessonController.create));
// Get lesson detail
app.get('/:lesson_id', asyncHandler(LessonController.getDetail));

// app.post('/add-score', async (c: Context, next) => {
//     try {
//         // Cập nhật tất cả bài học một lần duy nhất
//         await LessonModel.updateMany({}, { min_score: 200 });

//         return c.json({ success: true, message: "Cập nhật điểm tối thiểu thành công!" });
//     } catch (error) {
//         console.error("Lỗi khi cập nhật min_score:", error);
//         return c.status(500);
//     }
// });

export default app;