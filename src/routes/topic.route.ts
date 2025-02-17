import { Hono } from 'hono';
import { asyncHandler } from '../utils/async_handler.util.js';
import { TopicController } from '../controllers/topic.controller.js';

const app = new Hono();

// Create topic
app.post('/', asyncHandler(TopicController.create));
// Get all
app.get('/', asyncHandler(TopicController.getAll));

export default app;