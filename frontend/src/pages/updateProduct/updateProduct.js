import React, { useState, useEffect } from "react";
import "./updateProduct.css";
import { Link, useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날짜/시간 포맷 함수 (예: 2025-01-31 13:45:59)
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_BASE_URL =
          process.env.REACT_APP_API_BASE_URL ||
          "https://glowshelfe-inventory.onrender.com/api";

        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://glowshelfe-inventory.onrender.com/api/products/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      navigate("/");
    } catch (error) {
      alert("Error updating product: " + error.message);
    }
  };

  if (loading)
    return <p className="update-product__message">Loading product data...</p>;
  if (error) return <p className="update-product__message">{error}</p>;
  if (!product)
    return (
      <p className="update-product__message">Error loading product data.</p>
    );

  return (
    <div className="update-product__container">
      <h2 className="update-product__title">Update Product</h2>
      <form className="update-product__form" onSubmit={handleSubmit}>
        {/* 폼 필드들 동적 렌더링 */}
        {Object.keys(product).map((key) => {
          // _id 필드는 수정하지 않으므로 표시 X
          if (key === "_id") return null;

          return (
            <div className="form-group" key={key}>
              <label className="form-group__label" htmlFor={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>

              {/* createdAt, updatedAt은 readOnly, expirationDate는 날짜, quantity(QTY)는 숫자 */}
              {key === "createdAt" || key === "updatedAt" ? (
                <input
                  className="form-group__input"
                  type="text"
                  id={key}
                  name={key}
                  value={formatDateTime(product[key])}
                  readOnly
                />
              ) : (
                <input
                  className="form-group__input"
                  type={
                    key === "quantity"
                      ? "number"
                      : key === "expirationDate"
                      ? "date"
                      : "text"
                  }
                  id={key}
                  name={key}
                  // --- placeholder, maxLength, min 등 추가 ---
                  placeholder={
                    key === "brand" || key === "category" || key === "location"
                      ? "2 to 50 characters"
                      : key === "quantity"
                      ? "Min 1 number"
                      : key === "product"
                      ? "2 to 70 characters"
                      : "Error"
                  }
                  maxLength={
                    key === "brand" || key === "category" || key === "location"
                      ? 50
                      : key === "product"
                      ? 70
                      : undefined
                  }
                  // 숫자 타입이 아닌 경우 min은 효과가 없습니다. 필요시 minLength로 변경하세요.
                  minLength={
                    key === "brand" || key === "category" || key === "location"
                      ? 2
                      : key === "product"
                      ? 2
                      : undefined
                  }
                  value={
                    key === "expirationDate"
                      ? product.expirationDate
                        ? new Date(product.expirationDate)
                            .toISOString()
                            .slice(0, 10) // "YYYY-MM-DD" 형태
                        : ""
                      : product[key] || ""
                  }
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          );
        })}

        <div className="form-actions">
          <button className="form-actions__submit" type="submit">
            Update Product
          </button>
          <Link className="form-actions__back" to="/">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
