// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "아이디는 필수 항목입니다."],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "비밀번호는 필수 항목입니다."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 비밀번호를 저장하기 전에 해싱 처리
userSchema.pre("save", async function (next) {
  // 비밀번호가 수정된 경우에만 해싱
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메소드: 로그인 시 사용
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
