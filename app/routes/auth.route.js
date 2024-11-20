const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// API kiểm tra vai trò của người dùng
router.get("/checkrole/:userId", authController.checkRole);

module.exports = router;
