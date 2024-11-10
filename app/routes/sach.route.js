const express = require("express");
const sach = require("../controllers/sach.controller");
const router = express.Router();

// Route cho tất cả sách
router
  .route("/")
  .get(sach.findAll) // Lấy tất cả sách hoặc tìm kiếm theo tên
  .post(sach.create) // Tạo sách mới
  .delete(sach.deleteAll); // Xóa tất cả sách

// Route cho sách theo ID
router
  .route("/:id")
  .get(sach.findOne) // Lấy thông tin một sách theo ID
  .put(sach.update) // Cập nhật thông tin sách theo ID
  .delete(sach.delete); // Xóa sách theo ID

module.exports = router;
