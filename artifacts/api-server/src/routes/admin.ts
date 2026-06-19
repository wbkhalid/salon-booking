import { Router, type IRouter } from "express";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminMeResponse,
} from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const SESSION_KEY = "admin_authenticated";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  (req.session as Record<string, unknown>)[SESSION_KEY] = true;
  res.json(
    AdminLoginResponse.parse({
      success: true,
      message: "Logged in successfully",
    }),
  );
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const authenticated = !!(req.session as Record<string, unknown>)[SESSION_KEY];
  res.json(GetAdminMeResponse.parse({ authenticated }));
});

export default router;
