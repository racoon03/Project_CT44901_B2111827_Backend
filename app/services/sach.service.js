const { ObjectId } = require("mongodb");

class SachService {
  constructor(client) {
    this.Sach = client.db().collection("sach");
    this.NhaXuatBan = client.db().collection("nhaxuatban");
  }

  // Phương thức để trích xuất dữ liệu của Sach từ payload
  extractSachData(payload) {
    const sach = {
      TenSach: payload.TenSach,
      DonGia: payload.DonGia,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: ObjectId.isValid(payload.MaNXB)
        ? new ObjectId(payload.MaNXB)
        : null,
      TacGia: payload.TacGia,
    };

    // Xóa các trường undefined
    Object.keys(sach).forEach(
      (key) => sach[key] === undefined && delete sach[key]
    );
    return sach;
  }

  // Tạo một sách mới
  async create(payload) {
    const sach = this.extractSachData(payload);

    // Kiểm tra tính hợp lệ của MaNXB
    if (!sach.MaNXB) {
      throw new Error("Nhà xuất bản không hợp lệ");
    }

    // Kiểm tra xem MaNXB có tồn tại trong collection nhaxuatban không
    const nxbExists = await this.NhaXuatBan.findOne({ _id: sach.MaNXB });
    if (!nxbExists) {
      throw new Error("Nhà xuất bản không tồn tại trong hệ thống");
    }

    try {
      const result = await this.Sach.insertOne(sach);
      return { _id: result.insertedId, ...sach };
    } catch (error) {
      throw error;
    }
  }

  // Tìm tất cả sách theo bộ lọc
  async find(filter) {
    const cursor = await this.Sach.find(filter);
    return await cursor.toArray();
  }

  // Tìm sách theo tên
  async findByName(name) {
    return await this.find({
      TenSach: { $regex: new RegExp(name), $options: "i" },
    });
  }

  // Tìm sách theo ID
  async findById(id) {
    return await this.Sach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật thông tin sách theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa sách theo ID
  async delete(id) {
    const result = await this.Sach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả sách
  async deleteAll() {
    const result = await this.Sach.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = SachService;
