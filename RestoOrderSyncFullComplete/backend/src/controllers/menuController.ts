import { Request, Response } from "express";
import { storage } from "../storage/instance";

export const getAllMenus = (req: Request, res: Response) => {
  const menuArray = Array.from(storage.menuItems.values());
  res.json(menuArray);
};
