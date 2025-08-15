import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import Joi from "joi";

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 50 characters',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  isAdmin: Joi.boolean().default(false)
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const profileUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 50 characters',
    'any.required': 'Username is required'
  })
});

// Register new user
router.post("/register", validate(registerSchema), userController.register);

// Login user
router.post("/login", validate(loginSchema), userController.login);

// Get current user
router.get("/me", auth, userController.getMe);

// Update user profile
router.put("/profile", auth, validate(profileUpdateSchema), userController.updateProfile);

export default router;
