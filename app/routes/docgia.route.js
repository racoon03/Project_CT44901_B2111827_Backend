const express = require("express");
const docgia = require("../controllers/docgia.controller");
const router = express.Router();

// Route cho tất cả độc giả
router
  .route("/")
  .get(docgia.findAll) // Lấy tất cả độc giả hoặc theo tên
  .post(docgia.create) // Tạo độc giả mới
  .delete(docgia.deleteAll); // Xóa tất cả độc giả

// Route cho độc giả theo ID
router
  .route("/:id")
  .get(docgia.findOne) // Lấy thông tin một độc giả theo ID
  .put(docgia.update) // Cập nhật thông tin độc giả theo ID
  .delete(docgia.delete); // Xóa độc giả theo ID

// Route tìm độc giả theo số điện thoại
router.route("/phone/:phone").get(docgia.findByPhoneNumber); // Tìm độc giả theo số điện thoại

module.exports = router;
