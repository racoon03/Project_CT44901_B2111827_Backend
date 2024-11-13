const PhieuMuonService = require("../services/phieumuon.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new PhieuMuon
exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach || !req.body?.NgayMuon) {
    return next(
      new ApiError(400, "Mã độc giả, mã sách và ngày mượn không được bỏ trống")
    );
  }

  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    const document = await phieuMuonService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "Đã xảy ra lỗi trong quá trình tạo phiếu mượn"
      )
    );
  }
};

// Retrieve all loan records from the database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    documents = await phieuMuonService.find({});
  } catch (error) {
    return next(
      new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách phiếu mượn")
    );
  }

  return res.send(documents);
};

// Find a loan record by ID
exports.findOne = async (req, res, next) => {
  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    const document = await phieuMuonService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Đã xảy ra lỗi khi lấy thông tin phiếu mượn với id=${req.params.id}`
      )
    );
  }
};

// Find loan records by MaDocGia
exports.findByDocGiaId = async (req, res, next) => {
  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    const documents = await phieuMuonService.findByDocGiaId(
      req.params.maDocGia
    );
    if (documents.length === 0) {
      return next(
        new ApiError(404, "Không tìm thấy phiếu mượn cho độc giả này")
      );
    }
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(
        500,
        "Đã xảy ra lỗi khi lấy thông tin phiếu mượn theo mã độc giả"
      )
    );
  }
};

// Find loan records by MaSach
exports.findBySachId = async (req, res, next) => {
  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    const documents = await phieuMuonService.findBySachId(req.params.maSach);
    if (documents.length === 0) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn cho sách này"));
    }
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(
        500,
        "Đã xảy ra lỗi khi lấy thông tin phiếu mượn theo mã sách"
      )
    );
  }
};

// Update a loan record by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được bỏ trống"));
  }

  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    const document = await phieuMuonService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send({ message: "Đã cập nhật thông tin phiếu mượn thành công" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message ||
          `Đã xảy ra lỗi khi cập nhật phiếu mượn với id=${req.params.id}`
      )
    );
  }
};

// Delete a loan record with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    const document = await phieuMuonService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send({ message: "Đã xóa phiếu mượn thành công." });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Đã xảy ra lỗi khi xóa phiếu mượn với id=${req.params.id}`
      )
    );
  }
};

// Delete all loan records from the database
exports.deleteAll = async (_req, res, next) => {
  try {
    const phieuMuonService = new PhieuMuonService(MongoDB.client);
    const deletedCount = await phieuMuonService.deleteAll();
    return res.send({
      message: `${deletedCount} phiếu mượn đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả phiếu mượn"));
  }
};
