import React from "react";
import "./SearchControls.css";
import { Link } from "react-router-dom";

const SearchControls = ({
  fields,
  selectedField,
  setSelectedField,
  tempSearchTerm,
  setTempSearchTerm,
  handleKeyDown,
  handleSearch,
  handleSearchReset,
  sortMode,
  setSortMode,
  currentPage,
  setCurrentPage,
  loggedIn,
}) => {
  return (
    <div className="controls-container">
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
        {loggedIn && (
          <>
            <Link to="/AddProduct">Add Product</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchControls;
