const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        error: { message: "Username and password are required" },
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: { message: "Password must be at least 6 characters long" },
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ username: username.trim() });
    if (userExists) {
      return res.status(400).json({
        error: { message: "Username is taken" },
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username: username.trim(),
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: Object.values(error.errors).map((e) => e.message),
        },
      });
    }

    res.status(500).json({
      error: {
        message: "Failed to register user",
        details:
          process.env.NODE_ENV === "production" ? undefined : error.message,
      },
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        error: { message: "Username and password are required" },
      });
    }

    console.log("Login attempt:", username);

    // Find user by email
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({
        error: { message: "Invalid email or password" },
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({
        error: { message: "Invalid email or password" },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
        issuer: "furniture-store",
        audience: "furniture-store-users",
      }
    );

    console.log("Login success for:", username);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: {
        message: "Failed to authenticate user",
        details:
          process.env.NODE_ENV === "production" ? undefined : error.message,
      },
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        error: { message: "User not found" },
      });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      error: {
        message: "Failed to fetch user data",
        details:
          process.env.NODE_ENV === "production" ? undefined : error.message,
      },
    });
  }
};

// Update user profile (admin only)
exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!username) {
      return res.status(400).json({
        error: { message: "Username is required" },
      });
    }
    // Check if username is already taken by another user
    const existingUser = await User.findOne({
      username: username.trim(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        error: { message: "Username is already taken by another user" },
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username.trim(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        error: { message: "User not found" },
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        isAdmin: updatedUser.isAdmin,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: Object.values(error.errors).map((e) => e.message),
        },
      });
    }

    res.status(500).json({
      error: {
        message: "Failed to update profile",
        details:
          process.env.NODE_ENV === "production" ? undefined : error.message,
      },
    });
  }
};
