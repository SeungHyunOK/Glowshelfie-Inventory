import { Routes, Route } from "react-router-dom";
import ProductsList from "./pages/productsList/productsList";
import AddUserForm from "./pages/addProduct/addProduct";
import UpdateProduct from "./pages/updateProduct/updateProduct";
import "./App.css";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
  return (
    <div>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<ProductsList />} />
          <Route path="/AddProduct" element={<AddUserForm />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
        </Routes>{" "}
      </HelmetProvider>
    </div>
  );
};

export default App;
