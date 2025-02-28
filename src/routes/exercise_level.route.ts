import { Hono } from 'hono';
import { asyncHandler } from '../utils/async_handler.util.js';
import { ExerciseLevelController } from '../controllers/exercise_level.controller.js';

const app = new Hono();

app.get('/ping', (c: any) => c.text("PING ExerciseLevel API"));
// Create ExerciseLevelController
app.post('/', asyncHandler(ExerciseLevelController.create));

export default app;