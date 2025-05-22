import { Router } from "express";
import { Register, Login } from "../controllers/auth.controllers.js";

const AuthRoutes = Router();

AuthRoutes.post("/register", Register);
AuthRoutes.post("/login", Login);

export default AuthRoutes;
