import { AuthService } from "../services/auth.service.js";

export const AuthController = {
    // 📌 Đăng ký người dùng
    register: async (c: any) => {
        const { username, email, password, otp_code, topic } = await c.req.json();
        // call service
        const newUser = await AuthService.register(username, email, password, otp_code, topic);
        return c.json({ status: 201, message: "Đăng ký thành công!", data: newUser }, 201);
    },

    // 📌 Đăng nhập
    login: async (c: any) => {
        const { username, password } = await c.req.json();
        const data = await AuthService.login(username, password);
        return c.json({ status: 200, message: `Đăng nhập thành công!`, data }, 200);
    },

    // 📌 Gửi OTP xác thực email
    sendOTP: async (c: any) => {
        const { email } = await c.req.json();
        await AuthService.getOTP({
            emailTo: email
        });
        return c.json({ status: 200, message: "Mã OTP đã được gửi!" }, 200);
    },
};
