import React, { useEffect, useState } from "react";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import NewTitle from "../../extra/Title";
import {
  getSettingApi,
  editSetting,
  switchApi,
  getWithdrawalApi,
} from "../../store/setting/setting.action";
import { FormControlLabel, Switch } from "@mui/material";
import styled from "@emotion/styled";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: "76px",
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    top: "8px",
    transform: "translateX(10px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(38px)",
      top: "8px",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.5992 5.06724L16.5992 5.06719C16.396 4.86409 16.1205 4.75 15.8332 4.75C15.546 4.75 15.2705 4.86409 15.0673 5.06719L15.0673 5.06721L7.91657 12.2179L4.93394 9.23531C4.83434 9.13262 4.71537 9.05067 4.58391 8.9942C4.45174 8.93742 4.30959 8.90754 4.16575 8.90629C4.0219 8.90504 3.87925 8.93245 3.74611 8.98692C3.61297 9.04139 3.49202 9.12183 3.3903 9.22355C3.28858 9.32527 3.20814 9.44622 3.15367 9.57936C3.0992 9.7125 3.07179 9.85515 3.07304 9.99899C3.07429 10.1428 3.10417 10.285 3.16095 10.4172C3.21742 10.5486 3.29937 10.6676 3.40205 10.7672L7.15063 14.5158L7.15066 14.5158C7.35381 14.7189 7.62931 14.833 7.91657 14.833C8.20383 14.833 8.47933 14.7189 8.68249 14.5158L8.68251 14.5158L16.5992 6.5991L16.5992 6.59907C16.8023 6.39592 16.9164 6.12042 16.9164 5.83316C16.9164 5.54589 16.8023 5.27039 16.5992 5.06724Z" fill="white" stroke="white" stroke-width="0.5"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette === "dark" ? "#0FB515" : "red",
    width: 24,
    height: 24,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.1665 5.83301L5.83325 14.1663" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M5.83325 5.83301L14.1665 14.1663" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: "52px",
    border: "0.5px solid rgba(0, 0, 0, 0.14)",
    background: " #FFEDF0",
    boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.08) inset",
    opacity: 1,
    width: "60px",
    height: "28px",
    borderRadius: "52px",
  },
}));

function PaymentSetting(props) {
  const { settingData, withdrawData } = useSelector((state) => state.setting);

  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [stripePublishableKey, setStripePublishableKey] = useState();
  const [stripeSecretKey, setStripeSecretKey] = useState();
  const [razorPayId, setRazorPayId] = useState();
  const [razorSecretKey, setRazorSecretKey] = useState();
  const [stripeSwitch, setStripeSwitch] = useState();
  const [razorPaySwitch, setRazorPaySwitch] = useState();
  const [bankTransfer, setBankTransfer] = useState();
  const [customMethod, setCustomMethod] = useState();
  const [payPal, setPayPal] = useState();
  const [skrill, setSkrill] = useState();
  const [googlePlaySwitch, setGooglePlaySwitch] = useState();
  const [minWithdrawalRequest, setMinWithdrawalRequest] = useState();
  const [customMethodText, setCustomMethodText] = useState();
  const [withdrawDataName, setWithdrawDataName] = useState([]);

  const [flutterWaveId, setFlutterWaveId] = useState();
  const [flutterWaveSwitch, setFlutterWaveSwitch] = useState();

  const [error, setError] = useState({
    razorPayId: "",
    razorSecretKey: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
    minWithdrawalRequest: "",
    customMethodText: "",
  });

  useEffect(() => {
    dispatch(getSettingApi());
    dispatch(getWithdrawalApi());
  }, [dispatch]);

  useEffect(() => {
    setData(settingData);
  }, [settingData]);

  useEffect(() => {
    const filterData = withdrawData?.filter((item) => item?.isEnabled === true);
    const getNameWithdrawData = filterData?.map(
      (item) => " " + item?.name + " "
    );
    setWithdrawDataName(getNameWithdrawData);
  }, [withdrawData]);

  useEffect(() => {
    setRazorPayId(settingData?.razorPayId);
    setRazorSecretKey(settingData?.razorSecretKey);
    setRazorPaySwitch(settingData?.razorPaySwitch);
    setStripeSwitch(settingData?.stripeSwitch);
    setStripePublishableKey(settingData?.stripePublishableKey);
    setStripeSecretKey(settingData?.stripeSecretKey);
    setBankTransfer(settingData?.bankTransfer);
    setCustomMethod(settingData?.customMethod);
    setPayPal(settingData?.payPal);
    setSkrill(settingData?.skrill);
    setGooglePlaySwitch(settingData?.googlePlaySwitch);
    setMinWithdrawalRequest(settingData?.minWithdrawalRequest);
    setFlutterWaveId(settingData?.flutterWaveId);
    setFlutterWaveSwitch(settingData?.flutterWaveSwitch);
  }, [settingData]);

  const handleSubmit = () => {

    const minWithdrawalRequestValue = parseInt(minWithdrawalRequest);

    if (
      !razorPayId ||
      !razorSecretKey ||
      !stripePublishableKey ||
      !stripeSecretKey ||
      minWithdrawalRequest === "" ||
      (customMethod && customMethodText) ||
      minWithdrawalRequestValue <= 0
    ) {
      let error = {};
      if (!razorPayId) error.privacyPolicyLink = "RazorPayId Is Required !";
      if (!razorSecretKey)
        error.privacyPolicyText = "RazorSecretKey Is Required !";
      if (!stripePublishableKey)
        error.stripePublishableKey = "StripePublishableKey Is Required !";
      if (!stripeSecretKey)
        error.stripeSecretKey = "StripeSecretKey Is Required !";
      if (minWithdrawalRequest === "")
        error.minWithdrawalRequest = "Withdrawal Amount Request Is Required !";
      if (customMethod && customMethodText)
        error.customMethodText = "Custom Method Is Required !";
      if (minWithdrawalRequestValue <= 0)
        error.minWithdrawalRequest = "Withdrawal Amount Invalid !";
      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        settingId: data?._id,
        razorPayId: razorPayId,
        razorSecretKey: razorSecretKey,
        stripePublishableKey: stripePublishableKey,
        stripeSecretKey: stripeSecretKey,
        minWithdrawalRequest: parseInt(minWithdrawalRequest),
        flutterWaveId: flutterWaveId,
      };
      props.editSetting(data?._id, settingDataSubmit);
    }
  };

  const handleChange = async (method) => {
    try {
      let updatedMethod = null;
      switch (method) {
        case "bankTransfer":
          setBankTransfer(!bankTransfer);
          updatedMethod = bankTransfer;
          break;
        case "payPal":
          setPayPal(!payPal);
          updatedMethod = payPal;
          break;
        case "skrill":
          setSkrill(!skrill);
          updatedMethod = skrill;
          break;
        case "customMethod":
          setCustomMethod(!customMethod);
          updatedMethod = customMethod;
          break;
        case "razorPay":
          setRazorPaySwitch(!razorPaySwitch);
          updatedMethod = razorPaySwitch;
          break;
        case "googlePlaySwitch":
          setGooglePlaySwitch(!googlePlaySwitch);
          updatedMethod = googlePlaySwitch;
          break;
        case "stripe":
          setStripeSwitch(!stripeSwitch);
          updatedMethod = stripeSwitch;
          break;
        case "flutterWave":
          setFlutterWaveSwitch(!flutterWaveSwitch);
          updatedMethod = flutterWaveSwitch;
          break;
        default:
          break;
      }
      await props.switchApi(data?._id, method, updatedMethod);
    } catch (error) {
      console.error("Error updating payment methods:", error);
    }
  };
  return (
    <div className="payment-setting p-0">
      <div className="dashboardHeader primeHeader mb-3 p-0">
        {/* <NewTitle dayAnalyticsShow={false} titleShow={true} name={``} /> */}
      </div>
      <div className="payment-setting-box p-1 p-sm-3 ">
        <div className="row align-items-center mb-2 p-2">
          <div className="col-12 col-sm-6 ">
            <h5 className="m-0">Payment Setting</h5>
          </div>
          <div className="col-12 col-sm-6 mt-2 sm-m-0 d-flex justify-content-end">
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
        <div className="row" style={{ padding: "15px" }}>
          <div className="col-lg-6 col-sm-12 m-lg-0">
            <div className="withdrawal-box">
              <h6>Razor Pay Payment Setting</h6>
              <div className="row withdrawal-input">
                <div className="col-12 mt-1 d-flex justify-content-between align-items-center">
                  <button className="payment-content-button">
                    <span>
                      Razor Pay Switch (enable/disable razorpay in app)
                    </span>
                  </button>
                  <FormControlLabel
                    control={
                      <MaterialUISwitch
                        sx={{ m: 1 }}
                        checked={razorPaySwitch}
                        onChange={() => handleChange("razorPay")}
                      />
                    }
                  />
                </div>
                <div className="col-12 withdrawal-input">
                  <Input
                    label={"Razor Pay Id"}
                    name={"razorPayId"}
                    type={"text"}
                    value={razorPayId}
                    errorMessage={error.razorPayId && error.razorPayId}
                    placeholder={" Enter Details..."}
                    onChange={(e) => {
                      setRazorPayId(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          razorPayId: `RazorPayId Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          razorPayId: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 withdrawal-input">
                  <Input
                    label={"Razor Secret Key"}
                    name={"durationOfShorts"}
                    type={"text"}
                    value={razorSecretKey}
                    errorMessage={error.razorSecretKey && error.razorSecretKey}
                    placeholder={" Enter Details..."}
                    onChange={(e) => {
                      setRazorSecretKey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          razorSecretKey: `RazorSecretKey Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          razorSecretKey: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 mt-lg-0 mt-4">
            <div className="withdrawal-box">
              <h6>Stripe Payment Setting</h6>
              <div className="row withdrawal-input">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <button className="payment-content-button">
                    <span>Stripe Switch (enable/disable stripe in app)</span>
                  </button>
                  <FormControlLabel
                    control={
                      <MaterialUISwitch
                        sx={{ m: 1 }}
                        checked={stripeSwitch}
                        onChange={() => handleChange("stripe")}
                      />
                    }
                  />
                </div>
                <div className="col-12 withdrawal-input">
                  <Input
                    label={"Stripe Publishable Key"}
                    name={"stripePublishableKey"}
                    type={"text"}
                    value={stripePublishableKey}
                    errorMessage={
                      error.stripePublishableKey && error.stripePublishableKey
                    }
                    placeholder={" Enter Details..."}
                    onChange={(e) => {
                      setStripePublishableKey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          stripePublishableKey: `StripePublishableKey Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          stripePublishableKey: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 withdrawal-input">
                  <Input
                    label={"Stripe Secret Key"}
                    name={"stripeSecretKey"}
                    type={"text"}
                    value={stripeSecretKey}
                    errorMessage={
                      error.stripeSecretKey && error.stripeSecretKey
                    }
                    placeholder={" Enter Details..."}
                    onChange={(e) => {
                      setStripeSecretKey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          stripeSecretKey: `StripeSecretKey Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          stripeSecretKey: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 mt-4">
            <div className="">
              <div className="withdrawal-box ">
                <h6>Flutter Wave Setting</h6>
                <div className="row withdrawal-input">
                  <div className="row ">
                    <div className="col-12 mt-1 d-flex justify-content-between align-items-center">
                      <button className="payment-content-button">
                        <span>
                          FlutterWave Switch (enable/disable flutter Wave in
                          app)
                        </span>
                      </button>
                      <FormControlLabel
                        control={
                          <MaterialUISwitch
                            sx={{ m: 1 }}
                            checked={flutterWaveSwitch}
                            onChange={() => handleChange("flutterWave")}
                          />
                        }
                      />
                    </div>
                    <div className="col-12 withdrawal-input">
                      <Input
                        label={"Flutter Wave Id"}
                        name={"flutterWaveId"}
                        type={"text"}
                        value={flutterWaveId}
                        errorMessage={
                          error.flutterWaveId && error.flutterWaveId
                        }
                        placeholder={" Enter Details..."}
                        onChange={(e) => {
                          setFlutterWaveId(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              flutterWaveId: `flutterWaveId Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              flutterWaveId: "",
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12 mt-4">
            <div className="">
              <div className="withdrawal-box ">
                <h6>GooglePlay Setting</h6>
                <div className="row withdrawal-input">
                  <div className="row ">
                    <div className="col-12 mt-1 d-flex justify-content-between align-items-center">
                      <button className="payment-content-button">
                        <span>
                          GooglePlay Switch (enable/disable google play in app)
                        </span>
                      </button>
                      <FormControlLabel
                        control={
                          <MaterialUISwitch
                            sx={{ m: 1 }}
                            checked={googlePlaySwitch}
                            onChange={() => handleChange("googlePlaySwitch")}
                          />
                        }
                      />
                    </div>
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
  getSettingApi,
  editSetting,
  switchApi,
  getWithdrawalApi,
})(PaymentSetting);
