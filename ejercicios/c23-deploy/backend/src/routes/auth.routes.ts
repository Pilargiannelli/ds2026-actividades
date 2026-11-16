import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registroSchema } from "../validations/auth.validation";

const router = Router();

// registro y login son públicas: si pidieran token, no habría forma de conseguir el primero.
router.post("/registro", validate(registroSchema), authController.registrar);
router.post("/login", validate(loginSchema), authController.login);
router.get("/yo", authenticate, authController.yo);

export default router;
