const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new NhanVien
exports.create = async (req, res, next) => {
  if (!req.body?.HoTenNV) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.create(req.body);
    return res.send(document);
    // return res.status(201).json(document);
  } catch (error) {
    if (error.message.includes("Số điện thoại đã tồn tại")) {
      return next(
        new ApiError(400, "Số điện thoại đã tồn tại. Vui lòng sử dụng số khác.")
      );
    }
    return next(
      new ApiError(500, "An error occurred while creating the employee")
    );
  }
};

// Retrieve all employees from the database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const { HoTenNV } = req.query;

    if (HoTenNV) {
      documents = await nhanVienService.findByName(HoTenNV);
    } else {
      documents = await nhanVienService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving employees.")
    );
  }

  return res.send(documents);
};

// Find a single employee with an id
exports.findOne = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Employee not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving employee with id=${req.params.id}`)
    );
  }
};

// Find an employee by phone number
exports.findByPhoneNumber = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findByPhoneNumber(req.params.phone);
    if (!document) {
      return next(
        new ApiError(404, "Employee not found with the provided phone number")
      );
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        "Error retrieving employee with the provided phone number"
      )
    );
  }
};

// Update an employee by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Đã cập nhật thông tin nhân viên thành công" });
  } catch (error) {
    if (error.message.includes("Số điện thoại đã tồn tại")) {
      return next(
        new ApiError(400, "Số điện thoại đã tồn tại. Vui lòng sử dụng số khác.")
      );
    }
    return next(
      new ApiError(500, `Error updating employee with id=${req.params.id}`)
    );
  }
};

// Delete an employee with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Đã xóa thông tin nhân viên thành công." });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete employee with id=${req.params.id}`)
    );
  }
};

// Delete all employees from the database
exports.deleteAll = async (_req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const deletedCount = await nhanVienService.deleteAll();
    return res.send({
      message: `${deletedCount} employees were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all employees")
    );
  }
};
