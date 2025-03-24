import express, { Request, Response } from "express";
// @ts-ignore
import Datastore from "nedb-promise";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

const users = Datastore.create("users.db");
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.post(
  "/api/auth/register",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res
          .status(400)
          .json({ message: "Tous les champs doivent être remplis" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await users.insert({
        name,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "Utilisateur enregistré avec succès" });
      return;
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }
  }
);
app.listen(5000, () => console.log("Server running on port 5000"));
