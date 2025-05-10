import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as NotificationIcon } from "../../assets/icons/notificationIcon.svg";
import { getProfile } from "../store/admin/admin.action";
import UserImage from "../../assets/images/8.jpg";
import Logo from "../../assets/images/Logo.svg.jpeg";
import { connect, useDispatch, useSelector } from "react-redux";

import { covertURl } from "../../util/AwsFunction";
import { getDefaultCurrency } from "../store/currency/currency.action";
import { projectName } from "../../util/config";

const Navbar = (props) => {
  const { admin } = useSelector((state) => state.admin);
  const [showImage, setShowImage] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const fileNameWithExtensionThumbnail = admin?.image?.split("/").pop();
      const { imageURL: image } = await covertURl(
        "userImage/" + fileNameWithExtensionThumbnail
      );
      setShowImage(image);
    };
    if (admin) {
      fetchData();
      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [admin]);

  useEffect(() => {
    dispatch(getDefaultCurrency());
  }, [dispatch]);

  return (
    <>
      <div className="mainNavbar webNav me-4">
        <div className="row">
          <div className="navBox " style={{ paddingTop: "8px" }}>
            <div
              className="navBar boxBetween px-4 "
              style={{ padding: "10px 0px" }}
            >
              <div className="navToggle" id={"toggle"}>
                <i class="fa-solid fa-bars text-white cursor"></i>
              </div>
              <div className=""></div>
              <div className="col-4 logo-show-nav">
                <div className="sideBarLogo boxCenter">
                  <Link
                    to={"/admin/mainDashboard"}
                    className="d-flex align-items-center"
                  >
                    <img src={Logo} alt="" width={"40px"} />
                    <span className="fs-3 fw-bold text-black">
                      {projectName}
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-7">
                <div className="navIcons d-flex align-items-center justify-content-end">
                  <div
                    className="pe-4 cursor"
                    style={{ backgroundColor: "inherit", position: "relative" }}
                  ></div>
                  <div className="pe-4" style={{ backgroundColor: "inherit" }}>
                    <span
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                      }}
                    >
                      {admin?.name}
                    </span>
                  </div>
                  <div className="cursor">
                    <Link
                      to="/admin/profile"
                      style={{ backgroundColor: "inherit" }}
                    >
                      {showImage && (
                        <img
                          src={showImage}
                          alt=""
                          width={`50px`}
                          height={`50px`}
                          style={{
                            borderRadius: "15px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = UserImage;
                          }}
                          className="cursor"
                        />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getProfile,
})(Navbar);
