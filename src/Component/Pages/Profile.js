import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import Input from "../extra/Input";
import Button from "../extra/Button";
import {
  getProfile,
  profileUpdate,
  changePassword,
} from "../store/admin/admin.action";
import { connect, useDispatch, useSelector } from "react-redux";
import UserImage from "../../assets/images/8.jpg";

import { covertURl, uploadFile } from "../../util/AwsFunction";

function Profile(props) {
  const { admin } = useSelector((state) => state.admin);


  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showImage, setShowImage] = useState();
  const [error, setError] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    setData(admin);
  }, [admin]);

  useEffect(() => {
    setName(admin?.name);
    setEmail(admin?.email);
    setOldPassword(admin?.password);
  }, [admin]);

  let folderStructureImg = "userImage";
  const handleFileUpload = async (event) => {

    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureImg
    );
    if (resDataUrl) {
      let uploadImg = {
        image: resDataUrl,
      };
      props.profileUpdate(uploadImg);
    }
    if (imageURL) {
      setShowImage(imageURL);
    }
  };

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


  const handleEditProfile = () => {

    if (!email || !name) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!name) error.name = "Name Is Required !";
      return setError({ ...error });
    } else {
      let profileData = {
        name: name,
        email: email,
      };
      props.profileUpdate(profileData);
    }
  };

  const handlePassword = () => {

    if (!newPassword || !oldPassword || !confirmPassword) {
      let error = {};
      if (!newPassword) error.newPassword = "New Password Is Required !";
      if (!oldPassword) error.oldPassword = "Old Password Is Required !";
      if (!confirmPassword)
        error.confirmPassword = "Confirm Password Is Required !";
      return setError({ ...error });
    } else {
      if (newPassword !== confirmPassword) {
        setError({ confirmPassword: "Passwords do not match!" });
      }
      let passwordData = {
        oldPass: oldPassword,
        newPass: newPassword,
        confirmPass: confirmPassword,
      };
      props.changePassword(passwordData);
    }
  };

  return (
    <div>
      <div className="profile-page payment-setting">
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={false}
            titleShow={true}
            name={`Profile`}
          />
        </div>
        <div className="payment-setting-box p-3">
          <div className="row" style={{ padding: "15px" }}>
            <div className="col-lg-6 col-sm-12 ">
              <div className="mb-4 ">
                <div className="withdrawal-box  profile-img d-flex flex-column align-items-center">
                  <h6 className="text-start">Profile Avatar</h6>
                  <di style={{ paddingTop: "14px" }}>
                    <label for="image" onChange={handleFileUpload}>
                      <div className="avatar-img-icon">
                        <i class="fa-solid fa-camera d-flex justify-content-center  rounded-circle  p-2 cursorPointer"></i>
                      </div>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        style={{ display: "none" }}
                      />
                      {showImage && (
                        <img
                          src={showImage}
                          onError={(e) => {
                            e.target.src = UserImage;
                          }}
                        />
                      )}
                    </label>
                  </di>
                  <h5 className="fw-semibold boxCenter mt-2">{data?.name}</h5>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6 className="mb-0">Edit Profile</h6>
                  <div className="row">
                    <form>
                      <div className="row">
                        <div className="col-12 withdrawal-input">
                          <Input
                            label={"Name"}
                            name={"name"}
                            type={"text"}
                            value={name}
                            errorMessage={error.name && error.name}
                            placeholder={"Enter Detail...."}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  name: `Name Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  name: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 withdrawal-input border-0 mt-2">
                          <Input
                            label={"Email"}
                            name={"email"}
                            value={email}
                            type={"text"}
                            errorMessage={error.email && error.email}
                            placeholder={"Enter Detail...."}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  email: `Email Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  email: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 d-flex mt-3 justify-content-end">
                          <Button
                            btnName={"Submit"}
                            type={"button"}
                            onClick={handleEditProfile}
                            newClass={"submit-btn"}
                            style={{
                              borderRadius: "0.5rem",
                              width: "88px",
                              marginLeft: "10px",
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6 className="mb-0">Change Password</h6>
                  <div className="row">
                    <form>
                      <div className="row">
                        <div className="col-12 withdrawal-input">
                          <Input
                            label={"Old Password"}
                            name={"oldPassword"}
                            value={oldPassword}
                            type={"password"}
                            errorMessage={
                              error.oldPassword && error.oldPassword
                            }
                            placeholder={"Enter Old Password"}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  oldPassword: `OldPassword Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  oldPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 withdrawal-input border-0 mt-2">
                          <Input
                            label={"New Password"}
                            name={"newPassword"}
                            value={newPassword}
                            errorMessage={
                              error.newPassword && error.newPassword
                            }
                            type={"password"}
                            placeholder={"Enter New Password"}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  newPassword: `New Password Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  newPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 withdrawal-input border-0 mt-2">
                          <Input
                            label={"Confirm Password"}
                            name={"confirmPassword"}
                            value={confirmPassword}
                            className={`form-control`}
                            type={"password"}
                            errorMessage={
                              error.confirmPassword && error.confirmPassword
                            }
                            placeholder={"Enter Confirm Password"}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  confirmPassword: `Confirm Password Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  confirmPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-12 d-flex mt-3 justify-content-end">
                          <Button
                            btnName={"Submit"}
                            type={"button"}
                            onClick={handlePassword}
                            newClass={"submit-btn"}
                            style={{
                              borderRadius: "0.5rem",
                              width: "88px",
                              marginLeft: "10px",
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getProfile,
  profileUpdate,
  changePassword,
})(Profile);
