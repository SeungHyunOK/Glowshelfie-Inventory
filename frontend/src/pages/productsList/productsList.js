import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./productsList.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// 문자열, 숫자, 날짜 비교 함수들 (기존 코드)
function compareStringAsc(a, b, field) {
  return (a[field] || "").localeCompare(b[field] || "");
}
function compareStringDesc(a, b, field) {
  return (b[field] || "").localeCompare(a[field] || "");
}
function compareNumberAsc(a, b, field) {
  return (a[field] ?? 0) - (b[field] ?? 0);
}
function compareNumberDesc(a, b, field) {
  return (b[field] ?? 0) - (a[field] ?? 0);
}
function compareDateAsc(a, b, field) {
  return new Date(a[field]) - new Date(b[field]);
}
function compareDateDesc(a, b, field) {
  return new Date(b[field]) - new Date(a[field]);
}

// 정렬 로직 (기존 코드)
function sortByMode(products, mode) {
  const sorted = [...products];
  sorted.sort((a, b) => {
    switch (mode) {
      case "createdDesc":
        return compareDateDesc(a, b, "createdAt");
      case "createdAsc":
        return compareDateAsc(a, b, "createdAt");
      case "updatedDesc":
        return compareDateDesc(a, b, "updatedAt");
      case "updatedAsc":
        return compareDateAsc(a, b, "updatedAt");
      case "expirationDesc":
        return compareDateDesc(a, b, "expirationDate");
      case "expirationAsc":
        return compareDateAsc(a, b, "expirationDate");
      case "quantityDesc":
        return compareNumberDesc(a, b, "quantity");
      case "quantityAsc":
        return compareNumberAsc(a, b, "quantity");
      case "brandAsc":
        return compareStringAsc(a, b, "brand");
      case "brandDesc":
        return compareStringDesc(a, b, "brand");
      case "categoryAsc":
        return compareStringAsc(a, b, "category");
      case "categoryDesc":
        return compareStringDesc(a, b, "category");
      case "productAsc":
        return compareStringAsc(a, b, "product");
      case "productDesc":
        return compareStringDesc(a, b, "product");
      case "locationAsc":
        return compareStringAsc(a, b, "location");
      case "locationDesc":
        return compareStringDesc(a, b, "location");
      default:
        return 0;
    }
  });
  return sorted;
}

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 검색 관련 state
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("All");

  // 정렬 관련 state
  const [sortMode, setSortMode] = useState("");

  // 페이지네이션 state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 각 행별로 SeeMore(=createdAt, updatedAt) 정보를 열고 닫는 상태
  const [expandedRows, setExpandedRows] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL ||
        "https://glowshelfe-inventory.onrender.com/api";
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // 행 토글 함수 (SeeMore / Hide)
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // 이전 상태를 반전
    }));
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      alert("삭제 중 오류 발생: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색용 필드들
  const fields = [
    "All",
    "Brand",
    "Category",
    "Product",
    "Expiration Date",
    "Quantity",
    "Location",
    "CreatedAt",
    "UpdatedAt",
  ];

  // 특정 필드 값 추출 함수
  const getFieldValue = (product, field) => {
    switch (field) {
      case "Brand":
        return product.brand || "";
      case "Category":
        return product.category || "";
      case "Product":
        return product.product || "";
      case "Expiration Date":
        return product.expirationDate
          ? new Date(product.expirationDate).toLocaleDateString()
          : "";
      case "Quantity":
        return String(product.quantity ?? "");
      case "Location":
        return product.location || "";
      case "CreatedAt":
        return product.createdAt
          ? new Date(product.createdAt).toLocaleString()
          : "";
      case "UpdatedAt":
        return product.updatedAt
          ? new Date(product.updatedAt).toLocaleString()
          : "";
      default:
        return "";
    }
  };

  // 검색
  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
    setCurrentPage(1);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색 필터
  const lowerSearchTerm = searchTerm.toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (selectedField === "All") {
      const combinedString = [
        product.brand,
        product.category,
        product.product,
        product.expirationDate
          ? new Date(product.expirationDate).toLocaleDateString()
          : "",
        product.quantity,
        product.location,
        product.createdAt ? new Date(product.createdAt).toLocaleString() : "",
        product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "",
      ]
        .join(" ")
        .toLowerCase();

      return combinedString.includes(lowerSearchTerm);
    } else {
      const fieldValue = getFieldValue(product, selectedField).toLowerCase();
      return fieldValue.includes(lowerSearchTerm);
    }
  });

  // 정렬 적용
  const sortedProducts = sortByMode(filteredProducts, sortMode);

  // 페이지네이션
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = sortedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 검색 / 필터 / 정렬 리셋
  function handleSearchReset() {
    setSearchTerm("");
    setTempSearchTerm("");
    setSelectedField("All");
    setSortMode("");
    setCurrentPage(1);
  }

  // 페이지 이동
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="productList-container">
      <Helmet>
        <title>Glowshelfie Products</title>
        <meta
          name="description"
          content="이 페이지는 정말 멋진 페이지입니다."
        />
        <meta property="og:title" content="나의 멋진 페이지" />
        <meta
          property="og:description"
          content="이 페이지는 정말 멋진 페이지입니다."
        />
      </Helmet>
      <h1 className="title">Products List</h1>

      {/* 검색 & 정렬 영역 */}
      <div className="controls-container">
        {/* 검색 영역 */}
        <div className="search-container">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search here"
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleSearchReset}>Reset</button>
        </div>

        {/* 정렬 영역 */}
        <div className="sort-container">
          <label htmlFor="sortMode">Sort of :</label>
          <select
            id="sortMode"
            value={sortMode}
            onChange={(e) => {
              setSortMode(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">No sorting</option>
            <option value="createdDesc">Newest Arrivals</option>
            <option value="createdAsc">Oldest Arrivals</option>
            <option value="updatedDesc">Latest Updates First </option>
            <option value="updatedAsc">Oldest Updates First</option>
            <option value="expirationDesc">Expiration: Latest First</option>
            <option value="expirationAsc">Expiration: Earliest First</option>
            <option value="quantityDesc">Quantity: High to Low</option>
            <option value="quantityAsc">Quantity: Low to High</option>
            <option value="brandAsc">Brand: A to Z</option>
            <option value="brandDesc">Brand: Z to A</option>
            <option value="categoryAsc">Category: A to Z</option>
            <option value="categoryDesc">Category: Z to A</option>
            <option value="productAsc">Product Name: A to Z</option>
            <option value="productDesc">Product Name: Z to A</option>
            <option value="locationAsc">Location: A to Z</option>
            <option value="locationDesc">Location: Z to A</option>
          </select>
          <Link to="/AddProduct">Add Product</Link>
        </div>
      </div>

      <table className="productList-table">
        {error && <p>{error}</p>}
        <thead>
          <tr className="productList-table-thead">
            <th>Brand</th>
            <th>Category</th>
            <th>Product</th>
            <th>EXP</th>
            <th>Qty</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => {
              // 현재 행이 확장(SeeMore) 상태인지 여부
              const isExpanded = expandedRows[product._id] || false;
              return (
                <React.Fragment key={product._id}>
                  {/* 기본 정보 행 */}
                  <tr>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{product.product}</td>
                    <td>
                      {product.expirationDate
                        ? new Date(product.expirationDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td>{product.quantity}</td>
                    <td>{product.location}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/update-product/${product._id}`)
                        }
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                      {/* SeeMore / Hide 토글 버튼 */}
                      <button onClick={() => toggleExpand(product._id)}>
                        {isExpanded ? "Hide" : "See More"}
                      </button>
                    </td>
                  </tr>

                  {/* 확장된 영역(createdAt, updatedAt) */}
                  {isExpanded && (
                    <tr>
                      {/* colSpan: 테이블 전체 컬럼 수(7)와 일치 */}
                      <td colSpan={7} style={{ backgroundColor: "#fffbea" }}>
                        <div style={{ padding: "0.5rem" }}>
                          <p>
                            <strong>CreatedAt: </strong>
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleString()
                              : "N/A"}
                          </p>
                          <p>
                            <strong>UpdatedAt: </strong>
                            {product.updatedAt
                              ? new Date(product.updatedAt).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination-container">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsList;
