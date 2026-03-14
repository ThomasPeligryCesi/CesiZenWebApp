import "dotenv/config";
import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.route";
import articleRoutes from "./routes/article.route";
import exerciseRoutes from "./routes/exercise.route";

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/exercises", exerciseRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur", "status": 500});
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`CesiZen API listening on port ${port}`);
}) 
