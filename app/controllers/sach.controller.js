const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new Sach
exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "Tên sách không được bỏ trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (
      error.message === "Nhà xuất bản không hợp lệ" ||
      error.message === "Nhà xuất bản không tồn tại trong hệ thống"
    ) {
      return next(new ApiError(400, error.message)); // Trả về lỗi 400 nếu MaNXB không hợp lệ
    }
    return next(new ApiError(500, "Đã xảy ra lỗi trong quá trình tạo sách"));
  }
};

// Retrieve all books from the database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const sachService = new SachService(MongoDB.client);
    const { TenSach } = req.query;

    if (TenSach) {
      documents = await sachService.findByName(TenSach);
    } else {
      documents = await sachService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách sách"));
  }

  return res.send(documents);
};

// Find a single book with an id
exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Đã xảy ra lỗi khi lấy thông tin sách với id=${req.params.id}`
      )
    );
  }
};

// Update a book by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được bỏ trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Đã cập nhật thông tin sách thành công" });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Đã xảy ra lỗi khi cập nhật sách với id=${req.params.id}`
      )
    );
  }
};

// Delete a book with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Đã xóa sách thành công." });
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi xóa sách với id=${req.params.id}`)
    );
  }
};

// Delete all books from the database
exports.deleteAll = async (_req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const deletedCount = await sachService.deleteAll();
    return res.send({
      message: `${deletedCount} sách đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả sách"));
  }
};
