import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signupAdmin } from "../store/admin/admin.action";
import LoginImg from "../../assets/images/loginPage.png";
import Logo from "../../assets/images/MetubeLogo.jpg";
import Input from "../extra/Input";
import Button from "../extra/Button";
import { projectName } from "../../util/config";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState({
    email: "",
    password: "",
    code: "",
    newPassword: "",
  });

  const handleSubmit = () => {
    if (
      !email ||
      !password ||
      !code ||
      !newPassword ||
      newPassword !== password
    ) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      if (!code) error.code = "Purchase code is required !";
      if (!newPassword) error.newPassword = "Confirm password is required !";
      if (newPassword !== password)
        error.newPassword = "Doesn't match password to confirm password !";
      return setError({ ...error });
    } else {
      let login = {
        email,
        newPassword,
        password,
        code,
      };

      dispatch(signupAdmin(login, navigate));
    }
  };

  return (
    <>
      <div className="login-page-content">
        <div className="bg-login">
          <div className="login-page-box">
            <div className="row">
              <div className="col-12 col-md-6 right-login-img d-flex justify-content-center">
                <img src={LoginImg} style={{ width: "414px" }} />
              </div>
              <div className="col-12 col-md-6 text-login">
                <div className="heading-login">
                  <img src={Logo} />
                  <h6>{projectName}</h6>
                </div>
                <div className="login-left-form">
                  <span>Welcome back !!!</span>
                  <h5>Sign up</h5>
                  <Input
                    label={`Email`}
                    id={`loginEmail`}
                    type={`email`}
                    value={email}
                    errorMessage={error.email && error.email}
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
                  <Input
                    label={`Password`}
                    id={`loginPassword`}
                    type={`password`}
                    value={password}
                    className={`form-control`}
                    errorMessage={error.password && error.password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          password: `Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          password: "",
                        });
                      }
                    }}
                  />
                  <Input
                    label={`Confirm Password`}
                    id={`confirmPassword`}
                    type={`password`}
                    value={newPassword}
                    className={`form-control`}
                    errorMessage={error.newPassword && error.newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          newPassword: `Confirm Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          newPassword: "",
                        });
                      }
                    }}
                  />
                  <Input
                    label={`Purachse Code`}
                    id={`loginpurachse Code`}
                    type={`text`}
                    value={code}
                    errorMessage={error.code && error.code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          code: `code Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          code: "",
                        });
                      }
                    }}
                  />

                  <div
                    className="d-flex justify-content-center w-100"
                    style={{ width: "400px" }}
                  >
                    <Button
                      btnName={"Sign Up"}
                      newClass={"login-btn ms-2"}
                      onClick={handleSubmit}
                    />
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

export default Registration;
