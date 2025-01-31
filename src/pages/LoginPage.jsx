import { useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  //登入功能
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, account);
      const { token, expired } = response.data;
      document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;
      setIsAuth(true);
      axios.defaults.headers.common["Authorization"] = token;
      getData();
    } catch (error) {
      // alert(error.response.data.message);
      console.log(error);
    }
  };
  // 取input的值到account
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };
  return (
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
  );
}

export default LoginPage;
