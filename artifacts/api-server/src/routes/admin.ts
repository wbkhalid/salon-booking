import { Router, type CookieOptions, type IRouter } from "express";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminMeResponse,
} from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const SESSION_KEY = "admin_authenticated";
const ADMIN_AUTH_COOKIE = "admin_auth";
const ADMIN_AUTH_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const adminAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  signed: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: ADMIN_AUTH_MAX_AGE_MS,
  path: "/",
};

const adminAuthClearCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

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

  (req.session as unknown as Record<string, unknown>)[SESSION_KEY] = true;
  res.cookie(ADMIN_AUTH_COOKIE, "true", adminAuthCookieOptions);
  res.json(
    AdminLoginResponse.parse({
      success: true,
      message: "Logged in successfully",
    }),
  );
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.clearCookie(ADMIN_AUTH_COOKIE, adminAuthClearCookieOptions);
    res.json({ success: true });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const sessionAuthenticated = !!(
    req.session as unknown as Record<string, unknown>
  )[SESSION_KEY];
  const cookieAuthenticated =
    req.signedCookies?.[ADMIN_AUTH_COOKIE] === "true";
  const authenticated = sessionAuthenticated || cookieAuthenticated;
  res.json(GetAdminMeResponse.parse({ authenticated }));
});

export default router;
