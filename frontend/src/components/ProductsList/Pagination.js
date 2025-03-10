import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  goToPrevPage,
  goToNextPage,
}) => {
  return (
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
  );
};

export default Pagination;
