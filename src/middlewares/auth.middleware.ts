import { type MiddlewareHandler } from "hono"
import { verifyToken } from "../utils/auth.util.js"

// 📌 Middleware xác thực JWT
export const authenticate: MiddlewareHandler = async (c, next) => {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) return c.json({ message: "Bạn chưa đăng nhập!" }, 401);

    const decoded = await verifyToken(token);
    if (!decoded) return c.json({ message: "Token không hợp lệ!" }, 401);

    c.set("user", decoded);
    await next();
};

// 📌 Middleware kiểm tra quyền Admin
export const authorizeAdmin: MiddlewareHandler = async (c, next) => {
    const user = c.get("user");
    if (user.role !== "admin") {
        return c.json({ message: "Bạn không có quyền truy cập!" }, 403);
    }
    await next();
};
