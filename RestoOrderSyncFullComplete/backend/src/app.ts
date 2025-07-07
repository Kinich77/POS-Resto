import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/menu", menuRoutes);

export default app;
