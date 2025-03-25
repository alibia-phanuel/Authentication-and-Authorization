import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import jwt from "jsonwebtoken";
// Load environment variables from .env file
dotenv.config();
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Tous les champs doivent être remplis" });
      return;
    }

    // Normaliser l'email (tout en minuscule pour éviter les doublons)
    const normalizedEmail: string = email.toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    const existingUser: IUser | null = await User.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      res.status(409).json({ message: "Cet email est déjà utilisé" });
      return;
    }

    // Hacher le mot de passe
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser: IUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Tous les champs doivent être remplis" });
      return;
    }

    // Vérifier si l'utilisateur existe
    const existingUser: IUser | null = await User.findOne({ where: { email } });

    if (!existingUser) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // Vérifier si le mot de passe correspond
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Mot de passe incorrect" });
      return;
    }

    res
      .status(200)
      .json({ message: "Connexion réussie", userId: existingUser.id });
    const accessToken = jwt.sign({ userId: existingUser.id });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
