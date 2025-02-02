import { Routes, Route } from "react-router-dom";
import ProductsList from "./pages/productsList/productsList";
import AddUserForm from "./pages/addProduct/addProduct";
import UpdateProduct from "./pages/updateProduct/updateProduct";
import "./App.css";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/AddProduct" element={<AddUserForm />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
      </Routes>
    </div>
  );
};

export default App;
