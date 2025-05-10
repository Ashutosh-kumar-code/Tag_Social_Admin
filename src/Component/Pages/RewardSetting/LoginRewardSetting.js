import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSetting, getSettingApi } from "../../store/setting/setting.action";

import Button from "../../extra/Button";
import Input from "../../extra/Input";

const LoginRewardSetting = () => {
  const dispatch = useDispatch();

  const { settingData } = useSelector((state) => state.setting);



  const [loginRewardCoins, setLoginRewardCoins] = useState();

  const [error, setError] = useState({
    loginRewardCoins: "",
  });

  useEffect(() => {
    setLoginRewardCoins(settingData?.loginRewardCoins);
  }, [settingData]);

  useEffect(() => {
    dispatch(getSettingApi());
  }, []);

  const handleSubmit = () => {

    const loginRewardCoinsValue = parseInt(loginRewardCoins);

    if (loginRewardCoins === "" || loginRewardCoinsValue <= 0) {
      let error = {};

      if (loginRewardCoins === "")
        error.loginRewardCoins = "Amount Is Required !";

      if (loginRewardCoinsValue <= 0)
        error.loginRewardCoins = "Amount Invalid !";

      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        loginRewardCoins: parseInt(loginRewardCoins),
      };
      dispatch(editSetting(settingData?._id, settingDataSubmit));
    }
  };
  return (
    <>
      <div className="  userPage withdrawal-page p-0">
        <div className="row">
          <div className="col-6">
            <div className="withdrawal-box payment-setting ">
              <div className="row align-items-center p-2">
                <div className="col-12 col-sm-6 ">
                  <h5>Login Reward</h5>
                </div>
                <div className="col-12 col-sm-6 sm-m-0 d-flex justify-content-end p-0">
                  <Button
                    btnName={"Submit"}
                    type={"button"}
                    onClick={handleSubmit}
                    newClass={"submit-btn"}
                    style={{
                      borderRadius: "0.5rem",
                      width: "88px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 withdrawal-input mt-1">
                  <Input
                    label={"Login Reward Coin"}
                    name={"loginRewardCoins"}
                    value={loginRewardCoins}
                    type={"number"}
                    errorMessage={error.loginRewardCoins}
                    placeholder={"Enter login reward coin.."}
                    onChange={(e) => {
                      setLoginRewardCoins(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRewardSetting;
