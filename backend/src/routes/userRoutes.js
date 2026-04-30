const express = require("express");

const asyncHandler = require("../utils/asyncHandler");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/users", asyncHandler(userController.listUsers));

module.exports = router;