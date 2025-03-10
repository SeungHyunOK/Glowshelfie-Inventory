import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductTable.css";

const ProductTable = ({
  products,
  loading,
  expandedRows,
  toggleExpand,
  handleDelete,
  loggedIn,
  sortMode,
  selectedField,
}) => {
  const navigate = useNavigate();

  const sortByMode = (a, b) => {
    if (!sortMode) return 0;
    const fieldKey = selectedField.replace(/(Asc|Desc)$/, "").toLowerCase();
    let fieldA = a[fieldKey] || "";
    let fieldB = b[fieldKey] || "";
    if (!isNaN(Number(fieldA)) && !isNaN(Number(fieldB))) {
      fieldA = Number(fieldA);
      fieldB = Number(fieldB);
    }
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortMode.endsWith("Asc")
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    return sortMode.endsWith("Asc") ? fieldA - fieldB : fieldB - fieldA;
  };

  const sortedProducts = sortMode ? [...products].sort(sortByMode) : products;

  return (
    <table className="productList-table">
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
        {loading ? (
          <tr>
            <td colSpan="7">Getting data from the server.</td>
          </tr>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((product) => {
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
                    {loggedIn && (
                      <>
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
                      </>
                    )}
                    <button onClick={() => toggleExpand(product._id)}>
                      {isExpanded ? "Hide" : "See More"}
                    </button>
                  </td>
                </tr>

                {/* 확장 영역 */}
                {isExpanded && (
                  <tr>
                    <td colSpan="7" style={{ backgroundColor: "#fffbea" }}>
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
            <td colSpan="7">No products found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProductTable;
