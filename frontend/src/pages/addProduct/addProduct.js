import React, { useState } from "react";
import "./addProduct.css";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !brand ||
      !category ||
      !product ||
      !expirationDate ||
      !quantity ||
      !location
    ) {
      setMessage("모든 필드를 채워주세요.");
      return;
    }

    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        "https://glowshelfe-inventory.onrender.com/api";
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand,
          category,
          product,
          expirationDate,
          quantity: parseInt(quantity, 10),
          location,
        }),
      });

      if (response.ok) {
        setMessage(`Product added successfully!`);
        reset();
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  function reset() {
    setBrand("");
    setCategory("");
    setProduct("");
    setExpirationDate("");
    setQuantity("");
    setLocation("");
  }

  return (
    <div className="add-product__container">
      <h2 className="add-product__title">Add Products</h2>

      <form className="add-product__form" onSubmit={handleSubmit}>
        {/* Brand */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="brand">
            Brand:
          </label>
          <input
            className="form-group__input"
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            placeholder="2 to 50 characters"
            maxLength={50}
            min={2}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="category">
            Category:
          </label>
          <input
            className="form-group__input"
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="2 to 50 characters"
            maxLength={50}
            min={2}
          />
        </div>

        {/* Product */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="product">
            Product:
          </label>
          <input
            className="form-group__input"
            type="text"
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
            placeholder="2 to 70 characters"
            maxLength={70}
            min={2}
          />
        </div>

        {/* Expiration Date */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="expirationDate">
            Expiration Date (YYYY-MM-DD):
          </label>
          <input
            className="form-group__input"
            type="date"
            id="expirationDate"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]} // 과거 날짜 선택 방지
            onFocus={(e) => e.target.showPicker()}
          />
          {expirationDate && diffDays <= 30 && diffDays > 0 && (
            <div className="exp-warning">⚠️ Expires in {diffDays} days!</div>
          )}
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="quantity">
            Qty:
          </label>
          <input
            className="form-group__input"
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            placeholder="Min 1 number"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="location">
            Location:
          </label>
          <input
            className="form-group__input"
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="2 to 50 characters"
            maxLength={50}
            min={2}
          />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button className="form-actions__submit" type="submit">
            Add Product
          </button>
          <button className="form-actions__reset" type="button" onClick={reset}>
            Reset
          </button>
        </div>
        <Link className="backLink" to="/">
          Back
        </Link>
      </form>

      {message && <div className="add-product__message">{message}</div>}
    </div>
  );
};

export default AddProduct;
