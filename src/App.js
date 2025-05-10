import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import Admin from "./Component/Pages/Admin";
import Login from "./Component/Pages/Login";
import PrivateRoute from "./util/PrivateRoute";
import ForgotPassword from "./Component/Pages/ForgotPassword";
import SetPassword from "./Component/Pages/SetPassword";
import { useDispatch } from "react-redux";
import { LOGIN_ADMIN } from "./Component/store/admin/admin.type";
import axios from "axios";
import Registration from "./Component/Pages/Registration";
import Updatecode from "./Component/Pages/Updatecode";

function App() {
  const dispatch = useDispatch();
  const activityTimeoutRef = useRef(null);

  const key = localStorage.getItem("key");
  const token = localStorage.getItem("token");
  const [login, setLogin] = useState(false);

  const sessionTimeout = 20 * 60 * 1000; // 5 minutes in milliseconds
  let activityTimeout;

  // const resetTimeout = useCallback(() => {
  //   if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
  //   if (activityTimeout) clearTimeout(activityTimeout);
  //   activityTimeout = setTimeout(() => {
  //     localStorage.clear();
  //     window.location.href = '/';
  //   }, sessionTimeout);
  // }, [activityTimeout, sessionTimeout]);

  // const handleActivity = () => {
  //   resetTimeout();
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const key = localStorage.getItem("key");
  
    axios.get("admin/login", {
      headers: {
        Authorization: `Bearer ${token}`,
        key: key,
      },
    })
      .then((res) => {
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
        setLogin(false);
      });
  }, []);
  
  // useEffect(() => {
  //   axios
  //     .get("admin/login")
  //     .then((res) => {
  //       setLogin(res.data.login);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: LOGIN_ADMIN, payload: token });
  }, [token, key, dispatch]);

  // useEffect(() => {

  //   // Set initial timeout
  //   resetTimeout();

  //   // Add event listeners to track user activity
  //   window.addEventListener("mousemove", handleActivity);
  //   window.addEventListener("keydown", handleActivity);
  //   window.addEventListener("click", handleActivity);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     window.removeEventListener("mousemove", handleActivity);
  //     window.removeEventListener("keydown", handleActivity);
  //     window.removeEventListener("click", handleActivity);
  //     if (activityTimeout) clearTimeout(activityTimeout);
  //   };
  // }, [resetTimeout]);

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 500) {
        localStorage.clear();
        axios.defaults.headers.common["key"] = "";
        axios.defaults.headers.common["Authorization"] = "";
        window.location.href = "/";
      } else if (error.response && error.response.status === 403) {
        localStorage.clear();
        axios.defaults.headers.common["key"] = "";
        axios.defaults.headers.common["Authorization"] = "";
        window.location.href = "/";
      }
      return Promise.reject(error); 
    }
  );

  return (
    <div className="App">
      <Routes>
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/changePassword" element={<SetPassword />} />
        {login === true && <Route path="/" element={<Login />} />}
        {login === false && <Route path="/" element={<Registration />} />}
        { <Route path="/login" element={<Login />} />}   
        {login === false && <Route path="/login" element={<Registration />} />}
        {login && <Route path="/code" element={<Updatecode />} />}
        <Route element={<PrivateRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
