import { Router } from "express";
import { getAll, getById, create, update, remove, getFavorites, addFavorite, removeFavorite } from '../controllers/exercise.controller';
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
const router = Router();

router.get("/", getAll);
router.post("/", authMiddleware, adminMiddleware, create)
router.put("/:id", authMiddleware, adminMiddleware, update)
router.get("/favorites", authMiddleware, getFavorites)
router.post("/favorites/:exerciseId", authMiddleware, addFavorite)
router.delete("/favorites/:exerciseId", authMiddleware, removeFavorite)
router.delete("/:id", authMiddleware, adminMiddleware, remove)
router.get("/:id", getById);


export default router;