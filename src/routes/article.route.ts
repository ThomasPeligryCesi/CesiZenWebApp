import { Router } from "express";
import { getAll, getById, create, update, remove, getFavorites, addFavorite, removeFavorite, getArticlePage } from '../controllers/article.controller';
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
const router = Router();

// Define routes for authentication
router.get("/", getAll);
router.post("/", authMiddleware, adminMiddleware, create)
router.get("/page", getArticlePage)
router.get("/favorites", authMiddleware, getFavorites)
router.put("/:id", authMiddleware, adminMiddleware, update)
router.post("/favorites/:articleId", authMiddleware, addFavorite)
router.delete("/favorites/:articleId", authMiddleware, removeFavorite)
router.delete("/:id", authMiddleware, adminMiddleware, remove)
router.get("/:id", getById);


export default router;