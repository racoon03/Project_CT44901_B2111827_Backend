const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const nhanvienRouter = require("./app/routes/nhanvien.route");
const nxbRouter = require("./app/routes/nxb.route");
const sachRouter = require("./app/routes/sach.route");
const docgiaRouter = require("./app/routes/docgia.route");
const phieumuonRouter = require("./app/routes/phieumuon.route");
const authRouter = require("./app/routes/auth.route");

const app = express();

app.use(cors());
app.use(express.json());
// Đăng ký router
app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/nxb", nxbRouter);
app.use("/api/sach", sachRouter);
app.use("/api/docgia", docgiaRouter);
app.use("/api/phieumuon", phieumuonRouter);
app.use("/api/auth", authRouter);

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
