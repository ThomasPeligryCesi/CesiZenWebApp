import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.route";
import articleRoutes from "./routes/article.route";
import exerciseRoutes from "./routes/exercise.route";
import userRoutes from "./routes/user.route";

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/users", userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur", "status": 500});
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
})

app.listen(port, () => {
  console.log(`CesiZen API listening on port ${port}`);
}) 
