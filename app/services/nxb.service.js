const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection("nhaxuatban");
  }

  // Phương thức để trích xuất dữ liệu của NhaXuatBan từ payload
  extractNhaXuatBanData(payload) {
    const nhaXuatBan = {
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };

    // Xóa các trường undefined
    Object.keys(nhaXuatBan).forEach(
      (key) => nhaXuatBan[key] === undefined && delete nhaXuatBan[key]
    );
    return nhaXuatBan;
  }

  // Tạo một nhà xuất bản mới
  async create(payload) {
    const nhaXuatBan = this.extractNhaXuatBanData(payload);
    try {
      const result = await this.NhaXuatBan.insertOne(nhaXuatBan);
      return { _id: result.insertedId, ...nhaXuatBan };
    } catch (error) {
      throw error;
    }
  }

  // Tìm tất cả nhà xuất bản theo bộ lọc
  async find(filter) {
    const cursor = await this.NhaXuatBan.find(filter);
    return await cursor.toArray();
  }

  // Tìm nhà xuất bản theo tên
  async findByName(name) {
    return await this.find({
      TenNXB: { $regex: new RegExp(name), $options: "i" },
    });
  }

  // Tìm nhà xuất bản theo ID
  async findById(id) {
    return await this.NhaXuatBan.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật thông tin nhà xuất bản theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractNhaXuatBanData(payload);
    const result = await this.NhaXuatBan.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa nhà xuất bản theo ID
  async delete(id) {
    const result = await this.NhaXuatBan.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả nhà xuất bản
  async deleteAll() {
    const result = await this.NhaXuatBan.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NhaXuatBanService;
