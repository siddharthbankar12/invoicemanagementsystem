import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";

const AllRouters = Router();

AllRouters.use("/auth", AuthRoutes);
AllRouters.use("/user", UserRoutes);

export default AllRouters;
