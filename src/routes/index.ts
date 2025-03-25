import { Hono } from 'hono';
import userRouter from './user.route.js';
import authRouter from './auth.route.js';
import topicRouter from './topic.route.js';
import progressRouter from './progress.route.js';
import lessonRouter from './lesson.route.js';
import exerciseLevelRouter from './exercise_level.route.js';
import exerciseTypeRouter from './exercise_type.route.js';
import exerciseRouter from './exercise.route.js';
import vocabularyRouter from './vocabulary.route.js';

const app = new Hono();

// auth
app.route('/auth', authRouter);
// user
app.route('/user', userRouter);
// topic
app.route('/topic', topicRouter);
// progress
app.route('/progress', progressRouter);
// lesson
app.route('/lesson', lessonRouter);
// exercise
app.route('/exercise', exerciseRouter);
// exercise level
app.route('/exercise-level', exerciseLevelRouter);
// exercise type
app.route('/exercise-type', exerciseTypeRouter);
// vocabulary
app.route('/vocabulary', vocabularyRouter);

export default app