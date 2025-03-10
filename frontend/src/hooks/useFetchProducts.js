// useFetchProducts.js
import { useState, useEffect } from "react";

const useFetchProducts = (authToken) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/products`, {
          headers: {
            Authorization: authToken ? `Bearer ${authToken}` : "",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authToken]);

  return { products, error, loading, setProducts };
};

export default useFetchProducts;
