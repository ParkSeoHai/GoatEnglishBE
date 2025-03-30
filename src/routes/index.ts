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
import adminRouter from './admin.route.js';

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
// admin
app.route('/admin', adminRouter);
// text to speech
app.post("/text-to-speech", async (c) => {
    const { text, lang } = await c.req.json()
    if (!text) return c.json({ error: "Missing text input" }, 400)
    // Tạo URL Google Translate TTS
    const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang || "en"}&client=tw-ob&q=${encodeURIComponent(text)}`
    // Gửi request với User-Agent giả mạo
    const response = await fetch(googleTTSUrl, {
        headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
    })
    if (!response.ok) {
        return c.json({ error: `Google TTS API error: ${response.status}` }, 500)
    }
    // Proxy dữ liệu về client
    const audioBuffer = await response.arrayBuffer()
    return new Response(audioBuffer, {
        headers: { "Content-Type": "audio/mpeg" },
    })
});

export default app;