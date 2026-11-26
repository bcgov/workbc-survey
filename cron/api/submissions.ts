import { Router, type RequestHandler } from "express";
import { exportFormResponse } from "../services/form.service";
import { getFormBySurveyType } from "../surveys/catalog";

const handleSubmissions: RequestHandler = async (req, res) => {
  try {
    const surveyType: unknown = req.query.surveyType;
    if (typeof surveyType !== "string" || surveyType === "") {
      res.status(400).json({ error: "surveyType is required" });
      return;
    }

    const form = getFormBySurveyType(surveyType);
    if (form === undefined) {
      res.status(400).json({ error: "Unknown surveyType" });
      return;
    }

    const minDate: unknown = req.query.minDate;
    if (typeof minDate !== "string" || !isValidDate(minDate)) {
      res.status(400).json({ error: "minDate must be a valid YYYY-MM-DD date" });
      return;
    }

    const maxDateQuery: unknown = req.query.maxDate;
    let maxDate = "";
    if (maxDateQuery !== undefined) {
      if (typeof maxDateQuery !== "string" || !isValidDate(maxDateQuery)) {
        res.status(400).json({ error: "maxDate must be a valid YYYY-MM-DD date" });
        return;
      }
      if (maxDateQuery < minDate) {
        res.status(400).json({ error: "maxDate must not be before minDate" });
        return;
      }
      maxDate = maxDateQuery;
    }

    let body: unknown;
    try {
      body = await exportFormResponse(form.formId, form.token, minDate, maxDate);
    } catch (error) {
      console.error(
        `Failed to fetch submissions from CHEFS for surveyType ${surveyType}: ${String(error)}`,
      );
      res.status(502).json({ error: "Failed to fetch submissions from CHEFS" });
      return;
    }

    res.json(body);
  } catch (error) {
    console.error(`Submissions request failed: ${String(error)}`);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export function submissionsRouter(): Router {
  const router = Router();
  router.get("/submissions", handleSubmissions);
  return router;
}

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match === null) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
