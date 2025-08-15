const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const Joi = require("joi");
const sessionController = require("../controllers/sessionController");

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

module.exports = router;


