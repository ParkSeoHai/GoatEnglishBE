import { Hono } from 'hono';
import { asyncHandler } from '../utils/async_handler.util.js';
import { ExerciseTypeController } from '../controllers/exercise_type.controller.js';

const app = new Hono();

app.get('/ping', (c: any) => c.text("PING ExerciseType API"));
// Create ExerciseLevelController
app.post('/', asyncHandler(ExerciseTypeController.create));

export default app;