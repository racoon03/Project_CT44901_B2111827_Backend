const express = require("express");
const nhaxuatban = require("../controllers/nxb.controller");
const router = express.Router();

// Route cho tất cả nhà xuất bản
router
  .route("/")
  .get(nhaxuatban.findAll) // Lấy tất cả nhà xuất bản hoặc theo tên
  .post(nhaxuatban.create) // Tạo nhà xuất bản mới
  .delete(nhaxuatban.deleteAll); // Xóa tất cả nhà xuất bản

// Route cho nhà xuất bản theo ID
router
  .route("/:id")
  .get(nhaxuatban.findOne) // Lấy thông tin một nhà xuất bản theo ID
  .put(nhaxuatban.update) // Cập nhật thông tin nhà xuất bản theo ID
  .delete(nhaxuatban.delete); // Xóa nhà xuất bản theo ID

module.exports = router;
