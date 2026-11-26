import type { RequestHandler } from "express";
import { getApiKey } from "../config/config";

export const requireApiKey: RequestHandler = (req, res, next) => {
  const apiKey = getApiKey();
  if (!apiKey || req.get("X-API-Key") !== apiKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
