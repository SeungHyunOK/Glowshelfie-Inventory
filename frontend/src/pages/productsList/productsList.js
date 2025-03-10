import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SearchControls from "../../components/ProductsList/SearchControls";
import ProductTable from "../../components/ProductsList/ProductTable";
import Pagination from "../../components/ProductsList/Pagination";
import "./productsList.css";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [fields] = useState(["Brand", "Category", "Product", "Location"]);
  const [selectedField, setSelectedField] = useState("Brand");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const API_BASE_URL =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API 응답이 배열이 아닙니다:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const fieldKey = selectedField.toLowerCase();
    const fieldValue = product[fieldKey] ? String(product[fieldKey]) : "";
    return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortByMode = (a, b) => {
    if (!sortMode) return 0;

    // 필드명을 소문자로 변환하여 일관성 유지
    const fieldKey = selectedField.toLowerCase();

    // 필드 값 가져오기
    let fieldA = a[fieldKey] || "";
    let fieldB = b[fieldKey] || "";

    // 숫자 데이터 정렬 처리
    if (!isNaN(Number(fieldA)) && !isNaN(Number(fieldB))) {
      fieldA = Number(fieldA);
      fieldB = Number(fieldB);
    }

    // 문자열 정렬 처리
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortMode.endsWith("Asc")
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    // 숫자 정렬 처리
    return sortMode.endsWith("Asc") ? fieldA - fieldB : fieldB - fieldA;
  };
  const sortedProducts = sortMode
    ? [...filteredProducts].sort(sortByMode)
    : filteredProducts;

  // 페이지네이션 처리
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 행 확장/축소 토글
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      if (response.ok) {
        // Assuming the backend returns a JSON response with a token or success flag
        const data = await response.json();
        setLoggedIn(true);
        localStorage.setItem("authToken", data.token);
      } else {
        alert("Invalid login information.");
      }
    } catch (error) {
      alert("Error during login: " + error.message);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleDelete = async (id) => {
    if (!loggedIn) {
      alert("You need to log in.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete it?")) return;
    setLoading(true);
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      // 삭제 후 제품 목록 갱신
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm.trim());
    setCurrentPage(1);
  };

  const handleSearchReset = () => {
    setTempSearchTerm("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 페이지네이션 핸들러
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="productList-container">
      <Helmet>
        <title>Glowshelfie Products</title>
        <meta name="description" content="This is Glowshelfie Products List." />
      </Helmet>
      <div className="title">
        <img src="/images/main.webp" alt="mainImage" />
        <h1>Products List</h1>
      </div>
      <div className="login-section">
        {!loggedIn ? (
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>

      {/* 검색 및 정렬 컨트롤 */}
      <SearchControls
        fields={fields}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        tempSearchTerm={tempSearchTerm}
        setTempSearchTerm={setTempSearchTerm}
        handleKeyDown={handleKeyDown}
        handleSearch={handleSearch}
        handleSearchReset={handleSearchReset}
        sortMode={sortMode}
        setSortMode={setSortMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loggedIn={loggedIn}
      />

      {/* 제품 테이블 */}
      <ProductTable
        products={currentProducts}
        loading={loading}
        expandedRows={expandedRows}
        toggleExpand={toggleExpand}
        handleDelete={handleDelete}
        loggedIn={loggedIn}
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </div>
  );
};

export default ProductsList;
