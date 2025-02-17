import { Hono } from 'hono';
import { AuthController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/async_handler.util.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, emailSchema } from '../validators/auth.validator.js';

const app = new Hono();

// 📌 Đăng ký người dùng
app.post("/register", validate(registerSchema), asyncHandler(AuthController.register));
// 📌 Đăng nhập
app.post("/login", validate(loginSchema), asyncHandler(AuthController.login));
// 📌 Send OTP
app.post("/send-otp", validate(emailSchema), asyncHandler(AuthController.sendOTP));

export default app;