import { useState, useEffect } from "react";
import axios from "axios";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [isAuth, setIsAuth] = useState(false);

  const getData = async (page) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPageInfo(response.data.pagination);
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  // 登入驗證功能
  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      await getData();
      alert("歡迎回來");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common["Authorization"] = token;
    if (token) checkLogin();
  }, []);

  return <>{isAuth ? <ProductsPage getData={getData} checkLogin={checkLogin} products={products} pageInfo={pageInfo} /> : <LoginPage setIsAuth={setIsAuth} />}</>;
}

export default App;
