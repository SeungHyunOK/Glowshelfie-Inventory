const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

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
    const product = new Product(req.body);
    const savedProduct = await product.save();
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

router.put("/products/:id", async (req, res) => {
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
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true, // 유효성 검사 강제 적용
      }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "해당 제품을 찾을 수 없습니다." });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/products/:id", async (req, res) => {
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
