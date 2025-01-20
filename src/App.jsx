import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

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

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //登入功能
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, account);
      const { token, expired } = response.data;
      document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;
      setIsAuth(true);
      getData();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 登入驗證功能
  const checkLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      getData();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common["Authorization"] = token;
    checkLogin();
  }, []);

  // 取input的值到account
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  // modal功能
  const productModalRef = useRef(null);
  const delproductModalRef = useRef(null);
  const [modalMode, setModalMode] = useState(null);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });
    new Modal(delproductModalRef.current, {
      backdrop: false,
    });
  }, []);

  const handleOpenProductModal = (mode, tempProduct) => {
    setModalMode(mode);

    if (mode === "create") {
      setTempProduct(defaultModalState);
    } else {
      setTempProduct(tempProduct);
    }

    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  // 刪除modal

  const handleOpenDelProductModal = (tempProduct) => {
    const modalInstance = Modal.getInstance(delproductModalRef.current);
    setTempProduct(tempProduct);
    modalInstance.show();
  };

  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delproductModalRef.current);
    modalInstance.hide();
  };

  // 取Modalinput的值
  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;

    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ""];

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];

    newImages.pop();

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const addProduct = async () => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: Number(tempProduct.is_enabled),
        },
      });

      getData();
      handleCloseProductModal();
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = async () => {
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: Number(tempProduct.is_enabled),
        },
      });

      getData();
      handleCloseProductModal();
    } catch (error) {
      console.log(error);
    }
  };

  const delProduct = async () => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: Number(tempProduct.is_enabled),
        },
      });

      getData();
      handleCloseDelProductModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = (mode) => {
    setModalMode(mode);

    if (mode === "create") {
      addProduct();
    } else if (mode === "edit") {
      editProduct();
    }
  };

  const handleDelProduct = () => {
    delProduct();
  };

  return (
    <>
      {isAuth ? (
        <div className="container mt-5">
          <div className="row">
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
            </div>
          </div>
        </div>
      ) : (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="username" name="username" placeholder="name@example.com" value={account.username} onChange={handleInputChange} required autoFocus />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={account.password} onChange={handleInputChange} required />
                  <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-lg btn-primary w-100 mt-3">登入</button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}

      <div id="productModal" ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">{modalMode === "create" ? "新增產品" : "編輯產品"}</h5>
              <button onClick={handleCloseProductModal} type="button" className="btn-close" aria-label="Close"></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input value={tempProduct.imageUrl} onChange={handleModalInputChange} name="imageUrl" type="text" id="primary-image" className="form-control" placeholder="請輸入圖片連結" />
                    </div>
                    <img src={tempProduct.imageUrl} alt={tempProduct.title} className="img-fluid" />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">
                          副圖 {index + 1}
                        </label>
                        <input value={image} onChange={(e) => handleImageChange(e, index)} id={`imagesUrl-${index + 1}`} type="text" placeholder={`圖片網址 ${index + 1}`} className="form-control mb-2" />
                        {image && <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-2" />}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== "" && (
                        <button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">
                          新增圖片
                        </button>
                      )}

                      {tempProduct.imagesUrl.length > 1 && (
                        <button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input value={tempProduct.title} onChange={handleModalInputChange} name="title" id="title" type="text" className="form-control" placeholder="請輸入標題" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input value={tempProduct.category} onChange={handleModalInputChange} name="category" id="category" type="text" className="form-control" placeholder="請輸入分類" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input value={tempProduct.unit} onChange={handleModalInputChange} name="unit" id="unit" type="text" className="form-control" placeholder="請輸入單位" />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input value={tempProduct.origin_price} onChange={handleModalInputChange} name="origin_price" id="origin_price" type="number" className="form-control" placeholder="請輸入原價" />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input value={tempProduct.price} onChange={handleModalInputChange} name="price" id="price" type="number" className="form-control" placeholder="請輸入售價" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea value={tempProduct.description} onChange={handleModalInputChange} name="description" id="description" className="form-control" rows={4} placeholder="請輸入產品描述"></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea value={tempProduct.content} onChange={handleModalInputChange} name="content" id="content" className="form-control" rows={4} placeholder="請輸入說明內容"></textarea>
                  </div>

                  <div className="form-check">
                    <input checked={tempProduct.is_enabled} onChange={handleModalInputChange} name="is_enabled" type="checkbox" className="form-check-input" id="isEnabled" />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button onClick={handleCloseProductModal} type="button" className="btn btn-secondary">
                取消
              </button>
              <button onClick={() => handleUpdateProduct(modalMode)} type="button" className="btn btn-primary">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={delproductModalRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button onClick={handleCloseDelProductModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseDelProductModal} type="button" className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleDelProduct} type="button" className="btn btn-danger">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// function App() {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [isAuth, setisAuth] = useState(false);
//   const productModalRef = useRef(null);

//   useEffect(() => {
//     const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
//     axios.defaults.headers.common.Authorization = token;
//     // productModalRef.current = new bootstrap.Modal("#productModal", {
//     //   keyboard: false,
//     // });
//     checkAdmin();
//   }, []);

//   const checkAdmin = async () => {
//     try {
//       await axios.post(`${API_BASE}/api/user/check`);
//       setisAuth(true);
//     } catch (err) {
//       console.log(err.response.data.message);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_BASE}/admin/signin`, formData);
//       const { token, expired } = response.data;
//       document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
//       axios.defaults.headers.common.Authorization = token;
//       setisAuth(true);
//     } catch (error) {
//       alert("登入失敗: " + error.response.data.message);
//     }
//   };

//   return (
//     <>
//       {isAuth ? (
//         <div>
//           <div className="container">
//             <div className="text-end mt-4">
//               <button className="btn btn-primary">建立新的產品</button>
//             </div>
//             <table className="table mt-4">
//               <thead>
//                 <tr>
//                   <th width="120">分類</th>
//                   <th>產品名稱</th>
//                   <th width="120">原價</th>
//                   <th width="120">售價</th>
//                   <th width="100">是否啟用</th>
//                   <th width="120">編輯</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td></td>
//                   <td></td>
//                   <td className="text-end"></td>
//                   <td className="text-end"></td>
//                   <td>
//                     <span className="text-success">啟用</span>
//                     <span>未啟用</span>
//                   </td>
//                   <td>
//                     <div className="btn-group">
//                       <button type="button" className="btn btn-outline-primary btn-sm">
//                         編輯
//                       </button>
//                       <button type="button" className="btn btn-outline-danger btn-sm">
//                         刪除
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="container login">
//           <div className="row justify-content-center">
//             <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
//             <div className="col-8">
//               <form id="form" className="form-signin" onSubmit={handleSubmit}>
//                 <div className="form-floating mb-3">
//                   <input type="email" className="form-control" id="username" placeholder="name@example.com" value={formData.username} onChange={handleInputChange} required autoFocus />
//                   <label htmlFor="username">Email address</label>
//                 </div>
//                 <div className="form-floating">
//                   <input type="password" className="form-control" id="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
//                   <label htmlFor="password">Password</label>
//                 </div>
//                 <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
//                   登入
//                 </button>
//               </form>
//             </div>
//           </div>
//           <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
//         </div>
//       )}
//       <div id="productModal" className="modal fade" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
//         <div className="modal-dialog modal-xl">
//           <div className="modal-content border-0">
//             <div className="modal-header bg-dark text-white">
//               <h5 id="productModalLabel" className="modal-title">
//                 <span>新增產品</span>
//               </h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body">
//               <div className="row">
//                 <div className="col-sm-4">
//                   <div className="mb-2">
//                     <div className="mb-3">
//                       <label htmlFor="imageUrl" className="form-label">
//                         輸入圖片網址
//                       </label>
//                       <input type="text" className="form-control" placeholder="請輸入圖片連結" />
//                     </div>
//                     <img className="img-fluid" src="" alt="" />
//                   </div>
//                   <div>
//                     <button className="btn btn-outline-primary btn-sm d-block w-100">新增圖片</button>
//                   </div>
//                   <div>
//                     <button className="btn btn-outline-danger btn-sm d-block w-100">刪除圖片</button>
//                   </div>
//                 </div>
//                 <div className="col-sm-8">
//                   <div className="mb-3">
//                     <label htmlFor="title" className="form-label">
//                       標題
//                     </label>
//                     <input id="title" type="text" className="form-control" placeholder="請輸入標題" />
//                   </div>

//                   <div className="row">
//                     <div className="mb-3 col-md-6">
//                       <label htmlFor="category" className="form-label">
//                         分類
//                       </label>
//                       <input id="category" type="text" className="form-control" placeholder="請輸入分類" />
//                     </div>
//                     <div className="mb-3 col-md-6">
//                       <label htmlFor="unit" className="form-label">
//                         單位
//                       </label>
//                       <input id="unit" type="text" className="form-control" placeholder="請輸入單位" />
//                     </div>
//                   </div>

//                   <div className="row">
//                     <div className="mb-3 col-md-6">
//                       <label htmlFor="origin_price" className="form-label">
//                         原價
//                       </label>
//                       <input id="origin_price" type="number" min="0" className="form-control" placeholder="請輸入原價" />
//                     </div>
//                     <div className="mb-3 col-md-6">
//                       <label htmlFor="price" className="form-label">
//                         售價
//                       </label>
//                       <input id="price" type="number" min="0" className="form-control" placeholder="請輸入售價" />
//                     </div>
//                   </div>
//                   <hr />

//                   <div className="mb-3">
//                     <label htmlFor="description" className="form-label">
//                       產品描述
//                     </label>
//                     <textarea id="description" className="form-control" placeholder="請輸入產品描述"></textarea>
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="content" className="form-label">
//                       說明內容
//                     </label>
//                     <textarea id="content" className="form-control" placeholder="請輸入說明內容"></textarea>
//                   </div>
//                   <div className="mb-3">
//                     <div className="form-check">
//                       <input id="is_enabled" className="form-check-input" type="checkbox" />
//                       <label className="form-check-label" htmlFor="is_enabled">
//                         是否啟用
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
//                 取消
//               </button>
//               <button type="button" className="btn btn-primary">
//                 確認
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
export default App;
