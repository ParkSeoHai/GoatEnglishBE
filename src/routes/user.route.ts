import { Hono } from 'hono';
import { UserController } from '../controllers/user.controller.js';
import { asyncHandler } from '../utils/async_handler.util.js';
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware.js";

const app = new Hono();

// get infor user
app.get('/get-info', authenticate, asyncHandler(UserController.getInfo));
// change topic current
app.post('/change-topic', authenticate, asyncHandler(UserController.changeTopic));
// get topic đã học
app.get('/get-topics-learned', authenticate, asyncHandler(UserController.getTopics));
// get lesson hiện tại
app.get('/get-lesson-current/:topic_id', authenticate, asyncHandler(UserController.getLessonCurrent));
// submit lesson
app.post('/submit-lesson', authenticate, asyncHandler(UserController.submitLesson));

export default app;