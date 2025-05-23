import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AllRouters from "./routes/index.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://invoicemanagementsystem.vercel.app/",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("welcome to backend server");
});

mongoose.connect(process.env.MONGODBURL).then(() => {
  console.log("MongoDB Connected");
});

app.use("/api/v1", AllRouters);

app.listen(8000, () => console.log("server is running on port 8000"));
