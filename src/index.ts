import express, { Request, Response } from "express";
import sequelize from "./config/database";
import authRoutes from "./routes/authRoutes.routes";
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion réussie à la base de données.");
    return sequelize.sync();
  })
  .then(() => console.log("Base de données synchronisée."))
  .catch((err) => console.error("Erreur de connexion:", err));

app.use("/api", authRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));
