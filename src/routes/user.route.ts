import { Router } from "express";
import { getAll, updateRole, updateState } from '../controllers/user.controller';
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getAll);
router.patch("/:id/role", authMiddleware, adminMiddleware, updateRole);
router.patch("/:id/state", authMiddleware, adminMiddleware, updateState);

export default router;
