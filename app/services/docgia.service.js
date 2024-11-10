const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
    // Tạo chỉ mục unique cho DienThoai
    this.DocGia.createIndex({ DienThoai: 1 }, { unique: true });
  }

  // Phương thức để trích xuất dữ liệu của DocGia từ payload
  extractDocGiaData(payload) {
    const docGia = {
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
      Password: payload.Password, // Nếu cần dùng password cho đăng nhập
    };

    // Xóa các trường undefined
    Object.keys(docGia).forEach(
      (key) => docGia[key] === undefined && delete docGia[key]
    );
    return docGia;
  }

  // Tạo một độc giả mới
  async create(payload) {
    const docGia = this.extractDocGiaData(payload);
    try {
      const result = await this.DocGia.insertOne(docGia);
      return { _id: result.insertedId, ...docGia };
    } catch (error) {
      if (error.code === 11000) {
        // Lỗi trùng lặp (nếu `DienThoai` là unique)
        throw new Error("Số điện thoại đã tồn tại. Vui lòng sử dụng số khác.");
      }
      throw error;
    }
  }

  // Tìm tất cả độc giả theo bộ lọc
  async find(filter) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  // Tìm độc giả theo tên
  async findByName(name) {
    return await this.find({
      Ten: { $regex: new RegExp(name), $options: "i" },
    });
  }

  // Tìm độc giả theo ID
  async findById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Tìm độc giả theo số điện thoại
  async findByPhoneNumber(phone) {
    return await this.DocGia.findOne({ DienThoai: phone });
  }

  // Cập nhật thông tin độc giả theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractDocGiaData(payload);
    const result = await this.DocGia.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa độc giả theo ID
  async delete(id) {
    const result = await this.DocGia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả độc giả
  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }

  // Phương thức đăng nhập bằng DienThoai và Password
  async login(DienThoai, Password) {
    const user = await this.DocGia.findOne({ DienThoai, Password });
    if (!user) {
      throw new Error("Số điện thoại hoặc mật khẩu không đúng.");
    }
    return user; // Trả về thông tin độc giả nếu đăng nhập thành công
  }
}

module.exports = DocGiaService;
