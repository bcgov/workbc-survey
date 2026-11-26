import express, { Router, type Express } from "express";
import { getApiKey } from "../config/config";
import { requireApiKey } from "./apiKey";
import { submissionsRouter } from "./submissions";

export function createApp(): Express {
  const app = express();

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  if (getApiKey()) {
    const api = Router();
    api.use(requireApiKey);
    api.use(submissionsRouter());
    app.use("/api/v1", api);
  } else {
    console.warn("API_KEY is not set; API is disabled");
  }

  return app;
}
