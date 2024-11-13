const express = require("express");
const phieumuon = require("../controllers/phieumuon.controller");
const router = express.Router();

// Route cho tất cả phiếu mượn
router
  .route("/")
  .get(phieumuon.findAll) // Lấy tất cả phiếu mượn
  .post(phieumuon.create) // Tạo phiếu mượn mới
  .delete(phieumuon.deleteAll); // Xóa tất cả phiếu mượn

// Route cho phiếu mượn theo ID
router
  .route("/:id")
  .get(phieumuon.findOne) // Lấy thông tin một phiếu mượn theo ID
  .put(phieumuon.update) // Cập nhật thông tin phiếu mượn theo ID
  .delete(phieumuon.delete); // Xóa một phiếu mượn theo ID

// Route tìm phiếu mượn theo MaDocGia (ID của độc giả)
router.route("/docgia/:maDocGia").get(phieumuon.findByDocGiaId); // Tìm phiếu mượn theo mã độc giả

// Route tìm phiếu mượn theo MaSach (ID của sách)
router.route("/sach/:maSach").get(phieumuon.findBySachId); // Tìm phiếu mượn theo mã sách

module.exports = router;
