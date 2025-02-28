import { Hono } from 'hono';
import { asyncHandler } from '../utils/async_handler.util.js';
import { ProgressController } from '../controllers/progress.controller.js';

const app = new Hono();

// Create progress
app.post('/', asyncHandler(ProgressController.create));
// Get all progress by topic
app.get('/topic/:topic_id', asyncHandler(ProgressController.getAllByTopic));

export default app;