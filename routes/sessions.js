import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import Joi from "joi";
import * as sessionController from "../controllers/sessionController.js";

const createSchema = Joi.object({
  goal: Joi.string().min(1).required(),
  duration: Joi.number().min(1).required(),
  result: Joi.string().allow(""),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  completed: Joi.boolean().default(true),
});

router.get("/", auth, sessionController.getSessions);
router.post("/", auth, validate(createSchema), sessionController.createSession);
router.delete("/", auth, sessionController.clearSessions);

export default router;


