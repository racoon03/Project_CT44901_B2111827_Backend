const express = require("express");
const nhanvien = require("../controllers/nhanvien.controller");
const router = express.Router();

// Route cho tất cả nhân viên
router
  .route("/")
  .get(nhanvien.findAll) // Lấy tất cả nhân viên hoặc theo tên
  .post(nhanvien.create) // Tạo nhân viên mới
  .delete(nhanvien.deleteAll); // Xóa tất cả nhân viên

// Route cho nhân viên theo ID
router
  .route("/:id")
  .get(nhanvien.findOne) // Lấy thông tin một nhân viên theo ID
  .put(nhanvien.update) // Cập nhật thông tin một nhân viên theo ID
  .delete(nhanvien.delete); // Xóa một nhân viên theo ID

// Route tìm nhân viên theo số điện thoại
router.route("/phone/:phone").get(nhanvien.findByPhoneNumber); // Tìm nhân viên theo số điện thoại
// Route đăng nhập độc giả
router.post("/login", nhanvien.login);

module.exports = router;
