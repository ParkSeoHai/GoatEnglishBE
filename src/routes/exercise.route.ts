import { Hono } from 'hono';
import { asyncHandler } from '../utils/async_handler.util.js';
import { ExerciseController } from '../controllers/exercise.controller.js';

const app = new Hono();

app.get('/ping', (c: any) => c.text("PING Exercise API"));
// Create Exercise
app.post('/', asyncHandler(ExerciseController.create));

export default app;