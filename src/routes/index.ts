import { Hono } from 'hono';
import userRouter from './user.route.js';
import authRouter from './auth.route.js';
import topicRouter from './topic.route.js';

const app = new Hono();

// auth
app.route('/auth', authRouter);
// user
app.route('/user', userRouter);
// topic
app.route('/topic', topicRouter);

export default app