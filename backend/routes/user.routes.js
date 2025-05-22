import { Router } from "express";
import { GetAllUsers } from "../controllers/user.controllers.js";

const UserRoutes = Router();

UserRoutes.post("/get-all-users", GetAllUsers);
// UserRoutes.post("/login", Login);
// UserRoutes.post("/get-current-user", getCurrentUser);

export default UserRoutes;
