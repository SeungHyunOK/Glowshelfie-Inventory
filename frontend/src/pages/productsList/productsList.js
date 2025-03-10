import React, { useState, useEffect, useMemo, useCallback } from "react";
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

  // 로그인 상태 복구
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  // sortMode 유지
  useEffect(() => {
    const savedSortMode = localStorage.getItem("sortMode");
    if (savedSortMode) {
      setSortMode(savedSortMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sortMode", sortMode);
  }, [sortMode]);

  // 제품 데이터 fetch
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const API_BASE_URL =
          process.env.REACT_APP_API_BASE_URL ||
          "https://glowshelfe-inventory.onrender.com/api";
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

  // 검색 필터링 처리
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const fieldKey = selectedField.toLowerCase();
    const fieldValue = product[fieldKey] ? String(product[fieldKey]) : "";
    return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 정렬 로직: sortMode 값에서 정렬 옵션(예:"brandAsc", "createdDesc" 등)을 추출하여 정렬
  const sortByMode = useCallback(
    (a, b) => {
      if (!sortMode) return 0;
      const isAsc = sortMode.endsWith("Asc");
      // Determine suffix length: 'Asc' is 3 chars, 'Desc' is 4 chars
      const suffixLength = isAsc ? 3 : sortMode.endsWith("Desc") ? 4 : 0;
      const rawField = sortMode.slice(0, -suffixLength).toLowerCase();
      // 매핑: 옵션의 rawField를 실제 데이터 필드명으로 변환
      const fieldMap = {
        created: "createdAt",
        updated: "updatedAt",
        expiration: "expirationDate",
        brand: "brand",
        category: "category",
        product: "product",
        location: "location",
        quantity: "quantity",
      };
      const sortField = fieldMap[rawField] || rawField;
      let fieldA = a[sortField] || "";
      let fieldB = b[sortField] || "";

      // 날짜 필드 처리
      if (
        (sortField === "createdAt" ||
          sortField === "updatedAt" ||
          sortField === "expirationDate") &&
        fieldA &&
        fieldB
      ) {
        fieldA = new Date(fieldA);
        fieldB = new Date(fieldB);
      }
      // 숫자 비교
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return isAsc ? fieldA - fieldB : fieldB - fieldA;
      }
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return isAsc
          ? fieldA.getTime() - fieldB.getTime()
          : fieldB.getTime() - fieldA.getTime();
      }
      if (!isNaN(Number(fieldA)) && !isNaN(Number(fieldB))) {
        fieldA = Number(fieldA);
        fieldB = Number(fieldB);
        return isAsc ? fieldA - fieldB : fieldB - fieldA;
      }
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return isAsc
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      fieldA = String(fieldA);
      fieldB = String(fieldB);
      return isAsc
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    },
    [sortMode]
  );

  const sortedProducts = useMemo(() => {
    return sortMode ? [...filteredProducts].sort(sortByMode) : filteredProducts;
  }, [filteredProducts, sortMode, sortByMode]);

  // 페이지네이션 처리
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 행 확장 토글
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 로그인, 삭제, 검색 등 기타 핸들러는 기존 코드 유지
  const handleLogin = async (e) => {
    e.preventDefault();
    const API_BASE_URL =
      process.env.REACT_APP_API_BASE_URL ||
      "https://glowshelfe-inventory.onrender.com/api";
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
    localStorage.removeItem("authToken");
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
        process.env.REACT_APP_API_BASE_URL ||
        "https://glowshelfe-inventory.onrender.com/api";
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
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
      <ProductTable
        products={currentProducts}
        loading={loading}
        expandedRows={expandedRows}
        toggleExpand={toggleExpand}
        handleDelete={handleDelete}
        loggedIn={loggedIn}
      />
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
