import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";
import InvoiceRoutes from "./invoice.routes.js";

const AllRouters = Router();

AllRouters.use("/auth", AuthRoutes);
AllRouters.use("/user", UserRoutes);
AllRouters.use("/invoice", InvoiceRoutes);

export default AllRouters;
