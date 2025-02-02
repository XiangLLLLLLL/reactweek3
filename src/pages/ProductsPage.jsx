import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import UpdateModal from "../components/UpdateModal";
import DelModal from "../components/DelModal";

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function Products({ getData, products, pageInfo, checkLogin }) {
  const [modalMode, setModalMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common["Authorization"] = token;
    if (token) checkLogin();
  }, []);

  // 產品頁面開啟Modal
  const handleOpenProductModal = (mode, tempProduct) => {
    setModalMode(mode);

    if (mode === "create") {
      setTempProduct(defaultModalState);
    } else {
      setTempProduct(tempProduct);
    }

    setIsModalOpen(true);
  };

  const handleOpenDelProductModal = (tempProduct) => {
    setTempProduct(tempProduct);

    setIsDelModalOpen(true);
  };
  return (
    <>
      <div className="container mt-5">
        <div className="row row-cols-1">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                onClick={() => {
                  handleOpenProductModal("create");
                }}
                type="button"
                className="btn btn-primary"
              >
                新增產品資料
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{item.title}</th>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>{item.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span>}</td>
                    <td>
                      <button
                        onClick={() => {
                          handleOpenProductModal("edit", item);
                        }}
                        type="button"
                        className="btn btn-outline-primary"
                      >
                        編輯
                      </button>
                      <button onClick={() => handleOpenDelProductModal(item)} type="button" className="btn btn-outline-danger">
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination getData={getData} pageInfo={pageInfo} />
          </div>
        </div>
      </div>
      <UpdateModal getData={getData} modalMode={modalMode} setModalMode={setModalMode} tempProduct={tempProduct} setTempProduct={setTempProduct} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <DelModal getData={getData} tempProduct={tempProduct} setTempProduct={setTempProduct} isDelModalOpen={isDelModalOpen} setIsDelModalOpen={setIsDelModalOpen} />
    </>
  );
}

export default Products;
