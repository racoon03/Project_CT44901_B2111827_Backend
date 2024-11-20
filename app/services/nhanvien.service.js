const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
    // Tạo chỉ mục unique cho SoDienThoai
    this.NhanVien.createIndex({ SoDienThoai: 1 }, { unique: true });
  }

  // Phương thức để trích xuất dữ liệu của NhanVien từ payload
  extractNhanVienData(payload) {
    const nhanVien = {
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      Chucvu: payload.Chucvu,
      Diachi: payload.Diachi,
      SoDienThoai: payload.SoDienThoai,
    };

    Object.keys(nhanVien).forEach(
      (key) => nhanVien[key] === undefined && delete nhanVien[key]
    );
    return nhanVien;
  }

  // Tạo một nhân viên mới hoặc cập nhật nếu đã tồn tại (dựa trên tên và các thuộc tính khác)
  async create(payload) {
    const nhanVien = this.extractNhanVienData(payload);
    try {
      const result = await this.NhanVien.insertOne(nhanVien);
      return { _id: result.insertedId, ...nhanVien };
    } catch (error) {
      if (error.code === 11000) {
        // 11000 là mã lỗi trùng lặp (duplicate key) trong MongoDB
        throw new Error("Số điện thoại đã tồn tại. Vui lòng sử dụng số khác.");
      }
      throw error;
    }
  }

  // Tìm tất cả nhân viên theo bộ lọc
  async find(filter) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  // Tìm nhân viên theo tên
  async findByName(name) {
    return await this.find({
      HoTenNV: { $regex: new RegExp(name), $options: "i" },
    });
  }

  // Tìm nhân viên theo số điện thoại
  async findByPhoneNumber(SoDienThoai) {
    return await this.NhanVien.findOne({ SoDienThoai });
  }

  // Tìm nhân viên theo ID
  async findById(id) {
    return await this.NhanVien.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật thông tin nhân viên theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractNhanVienData(payload);
    const result = await this.NhanVien.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa nhân viên theo ID
  async delete(id) {
    const result = await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả nhân viên
  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }

  /// Phương thức đăng nhập
  async login(SoDienThoai, Password) {
    const user = await this.NhanVien.findOne({ SoDienThoai });

    if (!user) {
      throw new Error("Số điện thoại không tồn tại.");
    }

    if (user.Password !== Password) {
      throw new Error("Mật khẩu không chính xác.");
    }

    return {
      _id: user._id,
    };
  }
}

module.exports = NhanVienService;
