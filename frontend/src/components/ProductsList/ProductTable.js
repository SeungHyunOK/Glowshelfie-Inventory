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
}) => {
  const navigate = useNavigate();

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
        ) : products.length > 0 ? (
          products.map((product) => {
            const isExpanded = expandedRows[product._id] || false;
            return (
              <React.Fragment key={product._id}>
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
