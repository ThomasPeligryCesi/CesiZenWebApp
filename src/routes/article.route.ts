import { Router } from "express";
import { getAll, getById, create, update, remove, getFavorites, addFavorite, removeFavorite } from '../controllers/article.controller';
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
const router = Router();

// Define routes for authentication
router.get("/",authMiddleware, getAll);
router.post("/", authMiddleware, adminMiddleware, create)
router.put("/:id", authMiddleware, adminMiddleware, update)
router.get("/favorites", authMiddleware, getFavorites)
router.post("/favorites/:articleId", authMiddleware, addFavorite)
router.delete("/favorites/:articleId", authMiddleware, removeFavorite)
router.delete("/:id", authMiddleware, adminMiddleware, remove)
router.get("/:id", authMiddleware, getById);


export default router;