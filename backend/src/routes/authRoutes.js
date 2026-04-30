const express = require("express");

const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", asyncHandler(authController.signup));
router.post("/login", asyncHandler(authController.login));
router.get("/profile", auth, asyncHandler(authController.profile));

module.exports = router;