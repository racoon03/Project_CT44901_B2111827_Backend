const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new DocGia
exports.create = async (req, res, next) => {
  if (!req.body?.Ten || !req.body?.DienThoai) {
    return next(new ApiError(400, "Tên và số điện thoại không được bỏ trống"));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    if (error.message.includes("Số điện thoại đã tồn tại")) {
      return next(
        new ApiError(400, "Số điện thoại đã tồn tại. Vui lòng sử dụng số khác.")
      );
    }
    return next(new ApiError(500, "Đã xảy ra lỗi trong quá trình tạo độc giả"));
  }
};

// Retrieve all readers from the database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const { Ten } = req.query;

    if (Ten) {
      documents = await docGiaService.findByName(Ten);
    } else {
      documents = await docGiaService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách độc giả"));
  }

  return res.send(documents);
};

// Find a single reader with an id
exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Đã xảy ra lỗi khi lấy thông tin độc giả với id=${req.params.id}`
      )
    );
  }
};

// Find a reader by phone number
exports.findByPhoneNumber = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findByPhoneNumber(req.params.phone);
    if (!document) {
      return next(
        new ApiError(404, "Không tìm thấy độc giả với số điện thoại cung cấp")
      );
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        "Đã xảy ra lỗi khi lấy thông tin độc giả với số điện thoại cung cấp"
      )
    );
  }
};

// Update a reader by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được bỏ trống"));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Đã cập nhật thông tin độc giả thành công" });
  } catch (error) {
    if (error.message.includes("Số điện thoại đã tồn tại")) {
      return next(
        new ApiError(400, "Số điện thoại đã tồn tại. Vui lòng sử dụng số khác.")
      );
    }
    return next(
      new ApiError(
        500,
        `Đã xảy ra lỗi khi cập nhật độc giả với id=${req.params.id}`
      )
    );
  }
};

// Delete a reader with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Đã xóa độc giả thành công." });
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi xóa độc giả với id=${req.params.id}`)
    );
  }
};

// Delete all readers from the database
exports.deleteAll = async (_req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const deletedCount = await docGiaService.deleteAll();
    return res.send({
      message: `${deletedCount} độc giả đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả độc giả"));
  }
};

// Login a reader using DienThoai and Password
exports.login = async (req, res, next) => {
  const { DienThoai, Password } = req.body;
  if (!DienThoai || !Password) {
    return next(
      new ApiError(400, "Số điện thoại và mật khẩu không được bỏ trống")
    );
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const user = await docGiaService.login(DienThoai, Password);
    return res.send(user);
  } catch (error) {
    return next(new ApiError(400, "Số điện thoại hoặc mật khẩu không đúng"));
  }
};
