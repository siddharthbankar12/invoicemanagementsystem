import { Router } from "express";
import {
  GetAllUsers,
  UpdateUserRole,
  DeleteUser,
} from "../controllers/user.controllers.js";

const UserRoutes = Router();

UserRoutes.post("/get-all-users", GetAllUsers);
UserRoutes.post("/update-role", UpdateUserRole);
UserRoutes.delete("/delete/:userId", DeleteUser);

export default UserRoutes;
