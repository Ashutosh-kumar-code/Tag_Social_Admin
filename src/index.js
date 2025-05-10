import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "../src/assets/css/style.css";
import "../src/assets/css/default.css";
import "../src/assets/css/custom.css";
import "../src/assets/css/dateRange.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./Component/store/Provider";
import {
  CLOSE_LOADER,
  LOADER_OPEN,
} from "./Component/store/dialogue/dialogue.type";
import { baseURL, secretKey } from "./util/config";
import Loader from "./util/Loader";

const token = sessionStorage.getItem('token');

axios.defaults.baseURL = baseURL;

// Default Key Join In Axios
axios.defaults.headers.common["Authorization"] = token;
axios.defaults.headers.common["key"] = secretKey;

axios.interceptors.request.use(
  (req) => {
    store.dispatch({ type: LOADER_OPEN, payload: req.url });
    return req;
  },
  (error) => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    store.dispatch({ type: CLOSE_LOADER });
    return res;
  },
  (err) => {
    if (err.message === "Network Error") {
    }
    store.dispatch({ type: CLOSE_LOADER });
    return Promise.reject(err);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <ToastContainer style={{ zIndex: "99999999" }} />
      <Loader />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);

reportWebVitals();
