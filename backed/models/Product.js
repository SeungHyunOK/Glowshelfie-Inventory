const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, minlength: 2, maxlength: 50 },
    category: { type: String, required: true, minlength: 2, maxlength: 50 },
    product: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
      minlength: 2,
      maxlength: 70,
    },
    expirationDate: { type: Date, required: true },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: (v) => Number.isInteger(v) && v > 0,
        message: "Quantity must be a positive integer.",
      },
    },
    location: { type: String, required: true, minlength: 2, maxlength: 50 },
  },
  { timestamps: true }, // createdAt, updatedAt 자동 추가
  { versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
