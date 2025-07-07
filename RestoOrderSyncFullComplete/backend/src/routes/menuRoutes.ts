import express from "express";
import { getAllMenus } from "../controllers/menuController";

const router = express.Router();

router.get("/", getAllMenus);

export default router;
