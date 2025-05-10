import React from "react";
import { useSelector } from "react-redux";
import "../assets/css/style.css";
import { useLocation } from "react-router-dom";
const Loader = () => {
  const { isLoading, loadingUrl } = useSelector((state) => state.dialogue);

  const location = useLocation();
  return (
    <>
      {isLoading && (
        <div
          style={{
            display: `${
              location.pathname === "/admin/videos" &&
              loadingUrl === "admin/file/upload-file"
                ? "none"
                : location.pathname === "/admin/shorts" &&
                  loadingUrl === "admin/file/upload-file"
                ? "none"
                : location.pathname === "/admin/sound" &&
                  loadingUrl === "admin/file/upload-file"
                ? "none"
                : "block"
            }`,
          }}
        >
          <div className="mainLoaderBox">
            <div className="sk-cube-grid">
              <div className="sk-cube sk-cube1"></div>
              <div className="sk-cube sk-cube2"></div>
              <div className="sk-cube sk-cube3"></div>
              <div className="sk-cube sk-cube4"></div>
              <div className="sk-cube sk-cube5"></div>
              <div className="sk-cube sk-cube6"></div>
              <div className="sk-cube sk-cube7"></div>
              <div className="sk-cube sk-cube8"></div>
              <div className="sk-cube sk-cube9"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
