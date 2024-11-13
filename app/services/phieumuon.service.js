const { ObjectId } = require("mongodb");

class PhieuMuonService {
  constructor(client) {
    this.PhieuMuon = client.db().collection("phieumuon");
    this.DocGia = client.db().collection("docgia"); // Collection độc giả
    this.Sach = client.db().collection("sach"); // Collection sách
  }

  // Phương thức để trích xuất dữ liệu của Phiếu Mượn từ payload
  extractPhieuMuonData(payload) {
    const phieuMuon = {
      MaDocGia: ObjectId.isValid(payload.MaDocGia)
        ? new ObjectId(payload.MaDocGia)
        : null,
      MaSach: ObjectId.isValid(payload.MaSach)
        ? new ObjectId(payload.MaSach)
        : null,
      NgayMuon: payload.NgayMuon,
      NgayTra: payload.NgayTra,
    };

    // Xóa các trường undefined
    Object.keys(phieuMuon).forEach(
      (key) => phieuMuon[key] === undefined && delete phieuMuon[key]
    );
    return phieuMuon;
  }

  // Tạo một phiếu mượn mới
  async create(payload) {
    const phieuMuon = this.extractPhieuMuonData(payload);

    // Kiểm tra tính hợp lệ của MaDocGia
    if (!phieuMuon.MaDocGia) {
      throw new Error("Mã độc giả không hợp lệ");
    }
    const docGiaExists = await this.DocGia.findOne({ _id: phieuMuon.MaDocGia });
    if (!docGiaExists) {
      throw new Error("Độc giả không tồn tại trong hệ thống");
    }

    // Kiểm tra tính hợp lệ của MaSach
    if (!phieuMuon.MaSach) {
      throw new Error("Mã sách không hợp lệ");
    }
    const sachExists = await this.Sach.findOne({ _id: phieuMuon.MaSach });
    if (!sachExists) {
      throw new Error("Sách không tồn tại trong hệ thống");
    }

    try {
      const result = await this.PhieuMuon.insertOne(phieuMuon);
      return { _id: result.insertedId, ...phieuMuon };
    } catch (error) {
      throw error;
    }
  }

  // Tìm tất cả phiếu mượn theo bộ lọc
  async find(filter) {
    const cursor = await this.PhieuMuon.find(filter);
    return await cursor.toArray();
  }

  // Tìm phiếu mượn theo ID độc giả
  async findByDocGiaId(maDocGia) {
    return await this.find({
      MaDocGia: ObjectId.isValid(maDocGia) ? new ObjectId(maDocGia) : null,
    });
  }

  // Tìm phiếu mượn theo ID sách
  async findBySachId(maSach) {
    return await this.find({
      MaSach: ObjectId.isValid(maSach) ? new ObjectId(maSach) : null,
    });
  }

  // Tìm phiếu mượn theo ID
  async findById(id) {
    return await this.PhieuMuon.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // Cập nhật thông tin phiếu mượn theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractPhieuMuonData(payload);

    // Kiểm tra tính hợp lệ của MaDocGia
    if (update.MaDocGia) {
      const docGiaExists = await this.DocGia.findOne({ _id: update.MaDocGia });
      if (!docGiaExists) {
        throw new Error("Độc giả không tồn tại trong hệ thống");
      }
    }

    // Kiểm tra tính hợp lệ của MaSach
    if (update.MaSach) {
      const sachExists = await this.Sach.findOne({ _id: update.MaSach });
      if (!sachExists) {
        throw new Error("Sách không tồn tại trong hệ thống");
      }
    }

    const result = await this.PhieuMuon.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // Xóa phiếu mượn theo ID
  async delete(id) {
    const result = await this.PhieuMuon.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // Xóa tất cả phiếu mượn
  async deleteAll() {
    const result = await this.PhieuMuon.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = PhieuMuonService;
