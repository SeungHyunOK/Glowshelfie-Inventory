const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "토큰이 필요합니다." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    req.user = user;
    next();
  });
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "사용자 이름과 비밀번호를 입력하세요." });
  }
  if (
    username === process.env.LOGIN_USER &&
    password === process.env.LOGIN_PASSWORD
  ) {
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } else {
    return res
      .status(401)
      .json({ message: "로그인 정보가 올바르지 않습니다." });
  }
});

router.post("/products", async (req, res) => {
  const { brand, category, product, expirationDate, quantity, location } =
    req.body;

  if (
    !brand ||
    !category ||
    !product ||
    !expirationDate ||
    !quantity ||
    !location
  ) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//전체 제품 가져오는 코드
router.get("/products", async (req, res) => {
  const { sortBy, order = "asc", category } = req.query;

  try {
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({
      [sortBy]: order === "asc" ? 1 : -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});
//개별 제품 가져오는 코드
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("-__v");

    if (!product) {
      return res.status(404).json({ message: "해당 제품을 찾을 수 없습니다." });
    }

    res.json(product);
  } catch (error) {
    console.error("제품 조회 중 오류:", error);
    res.status(500).json({ message: "서버 에러 발생", error: error.message });
  }
});
//제품 수정하는 코드
router.patch("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // 일부 필드만 업데이트
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "해당 제품을 찾을 수 없습니다." });
    }

    res.json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "제품 업데이트 중 오류 발생", error: error.message });
  }
});

router.delete("/products/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "해당 제품을 찾을 수 없습니다." });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

module.exports = router;
