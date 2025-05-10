import { useEffect, useState } from "react";
import Button from "../extra/Button";
import Input from "../extra/Input";
import Logo from "../../assets/images/Logo.svg.jpeg";
import LoginContain from "../../assets/images/LoginContain.png";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../store/admin/admin.action";
import LoginImg from "../../assets/images/loginPage.png";
import { connect, useSelector } from "react-redux";
import { projectName } from "../../util/config";

const Login = (props) => {
  let navigate = useNavigate();

  const isAuth = useSelector((state) => state.admin.isAuth);

  useEffect(() => {
    isAuth && navigate("/admin");
  }, [isAuth]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({
    email: "",
    password: "",
  });


  const handleSubmit = () => {
    if (!email || !password) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      return setError({ ...error });
    } else {
      let login = {
        email,
        password,
      };

      props.loginAdmin(login , navigate);
    }
  };

  const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
  };

  return (
    <>
      <div className="login-page-content">
        <div className="bg-login">
          <div className="login-page-box">
            <div className="row">
              <div className="col-12 col-md-6 right-login-img">
                <img src={LoginImg} />
              </div>
              <div className="col-12 col-md-6 text-login">
                <div className="heading-login">
                  <img src={Logo} />
                  <h6>{projectName}</h6>
                </div>
                <div className="login-left-form">
                  <span>Welcome back !!!</span>
                  <h5>Sign In</h5>
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
                    onKeyPress={handleKeyPress}
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
                    onKeyPress={handleKeyPress}
                  />
                  <div
                    className="w-100"
                    onClick={() => navigate("/forgotPassword")}
                  >
                    <h4>Forgot Password ?</h4>
                  </div>
                  <div
                    className="d-flex justify-content-center w-100"
                    style={{ width: "400px" }}
                  >            
                    <Button
                      btnName={"LOGIN"}
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

export default connect(null, { loginAdmin })(Login);
