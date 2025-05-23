import { Router } from "express";
import {
  CreateInvoice,
  DeleteInvoices,
  ListInvoices,
  UpdateInvoice,
} from "../controllers/invoice.controllers.js";

const InvoiceRoutes = Router();

InvoiceRoutes.post("/create", CreateInvoice);
InvoiceRoutes.put("/update/:invoiceNumber", UpdateInvoice);
InvoiceRoutes.delete("/delete", DeleteInvoices);
InvoiceRoutes.get("/get-list", ListInvoices);

export default InvoiceRoutes;
