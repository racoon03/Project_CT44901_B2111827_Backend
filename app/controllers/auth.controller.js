const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");

exports.checkRole = async (req, res) => {
  const { userId } = req.params;

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const nhanVienService = new NhanVienService(MongoDB.client);

    // Kiểm tra trong bảng nhân viên
    const employee = await nhanVienService.findById(userId);
    if (employee) {
      return res.json({ role: "employee" });
    }

    // Kiểm tra trong bảng đọc giả
    const reader = await docGiaService.findById(userId);
    if (reader) {
      return res.json({ role: "reader" });
    }

    // Nếu không tìm thấy
    res.status(404).json({ message: "Không tìm thấy người dùng." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
