import React, { useEffect, useState } from "react";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import NewTitle from "../../extra/Title";
import {
  getSettingApi,
  editSetting,
  switchApi,
  getAdsApi,
  isAdsChange,
  adsApiData,
  getWithdrawalApi,
} from "../../store/setting/setting.action";
import { FormControlLabel, Switch } from "@mui/material";
import styled from "@emotion/styled";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import { getDefaultCurrency } from "../../store/currency/currency.action";

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

const MonetizationSetting = (props) => {
  const { settingData, withdrawData, adsData } = useSelector(
    (state) => state.setting
  );
  const { defaultCurrency } = useSelector((state) => state.currency);


  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [isMonetization, setIsMonetiozation] = useState();
  const [minWatchTime, setMinWatchTime] = useState();
  const [minSubScriber, setMinSubScriber] = useState();
  const [earningPerHour, setEarningPerHour] = useState();
  const [androidGoogleInterstitial, setAndroidGoogleInterstitial] =
    useState("");
  const [adDisplayIndex, setAdDisplayIndex] = useState("");
  const [androidGoogleNative, setAndroidGoogleNative] = useState("");

  const [iosGoogleInterstitial, setIosGoogleInterstitial] = useState("");
  const [iosGoogleNative, setIosGoogleNative] = useState("");
  const [googleAds, setGooglAds] = useState();

  const [iosGoogleReward, setIosGoogleReward] = useState("");
  const [androidGoogleReward, setAndroidGoogleReward] = useState("");

  const [error, setError] = useState({
    minWatchTime: "",
    minSubScriber: "",
    earningPerHour: "",
  });

  useEffect(() => {
    dispatch(getSettingApi());
    dispatch(getDefaultCurrency());
  }, [dispatch]);

  useEffect(() => {
    setData(settingData);
  }, [settingData]);

  useEffect(() => {
    dispatch(getAdsApi());
  }, []);

  useEffect(() => {
    setAndroidGoogleInterstitial(adsData?.android?.google?.interstitial);
    setAndroidGoogleNative(adsData?.android?.google?.native);
    setIosGoogleInterstitial(adsData?.ios?.google?.interstitial);
    setIosGoogleNative(adsData?.ios?.google?.native);
    setGooglAds(adsData?.isGoogle);
    setAndroidGoogleReward(adsData?.android?.google?.reward);
    setIosGoogleReward(adsData?.ios?.google?.reward);
  }, [adsData]);

  useEffect(() => {
    setMinWatchTime(settingData?.minWatchTime);
    setIsMonetiozation(settingData?.isMonetization);
    setMinSubScriber(settingData?.minSubScriber);
    setEarningPerHour(settingData?.earningPerHour);
    setAdDisplayIndex(settingData?.adDisplayIndex);
  }, [settingData]);

  const handleSubmit = () => {


    if (!minWatchTime || !minSubScriber || !earningPerHour) {
      let error = {};
      if (!minWatchTime) error.minWatchTime = "Min Watch Time Is Required !";
      if (!minSubScriber) error.minSubScriber = "Min Subscriber Is Required";
      if (!earningPerHour)
        error.earningPerHour = "earningPerHour Is Required !";
      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        minWatchTime: minWatchTime,
        minSubScriber: minSubScriber,
        adDisplayIndex: parseInt(adDisplayIndex),
        earningPerHour: earningPerHour,
      };
      props.editSetting(data?._id, settingDataSubmit);
    }
  };

  const handleSubmitAds = () => {

    let adsDataApi = {
      androidGoogleInterstitial: androidGoogleInterstitial,
      androidGoogleNative: androidGoogleNative,
      iosGoogleNative: iosGoogleNative,
      iosGoogleInterstitial: iosGoogleInterstitial,
      androidGoogleReward: androidGoogleReward,
      iosGoogleReward: iosGoogleReward,
    };
    dispatch(adsApiData(adsDataApi, adsData?._id));
  };

  const handleChange = async (method) => {
    try {
      let updatedMethod = null;
      switch (method) {
        case "monetization":
          setIsMonetiozation(!isMonetization);
          updatedMethod = isMonetization;
          break;

        default:
          break;
      }
      await props.switchApi(data?._id, method, updatedMethod);
    } catch (error) {
      console.error("Error updating payment methods:", error);
    }
  };

  const handleChangeAds = () => {
    dispatch(isAdsChange(adsData?.isGoogle, adsData?._id));
  };

  return (
    <div className="payment-setting p-0">
      <div className="dashboardHeader primeHeader mb-3 p-0">
        {/* <NewTitle dayAnalyticsShow={false} titleShow={true} name={``} /> */}
      </div>
      <div className="payment-setting-box p-1 p-sm-3 ">
        <div className="row align-items-center mb-2 p-2">
          <div className="col-12 col-sm-6 ">
            <h5 className="m-0">Monetize Setting</h5>
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
          <div className="col-lg-6 col-sm-12">
            <div className="mb-4">
              <div className="withdrawal-box payment-box">
                <div className="row">
                  <div className="col-12 d-flex justify-content-between align-items-center ">
                    <button className="payment-content-button">
                      <span>
                        Monetization Switch (enable/disable monetization in app)
                      </span>
                    </button>
                    <FormControlLabel
                      control={
                        <MaterialUISwitch
                          sx={{ m: 1 }}
                          checked={isMonetization}
                          onChange={() => handleChange("monetization")}
                        />
                      }
                    />
                  </div>
                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={
                        "Min Watch Time of hours of Viewership in channel Required for Monetization"
                      }
                      name={"minWatchTime"}
                      type={"text"}
                      value={minWatchTime}
                      errorMessage={error.minWatchTime && error.minWatchTime}
                      placeholder={"Enter Detail..."}
                      onChange={(e) => {
                        setMinWatchTime(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            minWatchTime: `Min Watch Time Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            minWatchTime: "",
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="col-12 withdrawal-input border-setting">
                    <Input
                      label={
                        "Minimum Subscriber Count for Monetization Eligibility"
                      }
                      name={"minSubScriber"}
                      type={"text"}
                      value={minSubScriber}
                      errorMessage={error.minSubScriber && error.minSubScriber}
                      placeholder={"Enter Detail..."}
                      onChange={(e) => {
                        setMinSubScriber(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            minSubScriber: `Min SubScriber Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            minSubScriber: "",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12">
            <div className="mb-4">
              <div className="withdrawal-box payment-box">
                <h6>Set earnings rate per Hour of viewership for user</h6>
                <div className="row withdrawal-input">
                  <div className="row">
                    <div className="col-5">
                      <Input
                        label={"Hour"}
                        name={"Hour"}
                        type={"number"}
                        value={"1"}
                        placeholder={"Enter Detail..."}
                        disabled={true}
                      />
                    </div>
                    <div
                      className="col-1"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p className="mb-0 mt-4" style={{ fontSize: "22px" }}>
                        =
                      </p>
                    </div>
                    <div className="col-6">
                      <Input
                        label={`Earning (${
                          defaultCurrency?.symbol ? defaultCurrency?.symbol : ""
                        })`}
                        name={"earningPerHour"}
                        type={"number"}
                        value={earningPerHour}
                        placeholder={"Enter Detail..."}
                        errorMessage={
                          error.earningPerHour && error.earningPerHour
                        }
                        onChange={(e) => {
                          setEarningPerHour(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              earningPerHour: `EarningPerHour Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              earningPerHour: "",
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
          <div className=" col-12">
            <div className="mb-4  ">
              <div className="withdrawal-box payment-box">
                <h6>Show Ads After Every {adDisplayIndex} Video Views</h6>
                <div className="row withdrawal-input">
                  <div className="row">
                    <div className="col-12">
                      <Input
                        label={"Ad Display Frequency (Number of Videos)"}
                        name={"adDisplayIndex"}
                        type={"number"}
                        value={adDisplayIndex}
                        placeholder={"Enter Detail..."}
                        onChange={(e) => [setAdDisplayIndex(e.target.value)]}
                      />
                    </div>
                    <div
                      className="col-1"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="payment-setting-box p-1 p-sm-3 ">
        <div className="row align-items-center mb-2 p-2">
          <div className="col-12 col-sm-6 ">
            <h5 className="m-0">Ads Setting</h5>
          </div>
          <div className="col-12 col-sm-6 mt-2 sm-m-0 d-flex justify-content-end">
            <Button
              btnName={"Submit"}
              type={"button"}
              onClick={handleSubmitAds}
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
          <div className="col-12 col-lg-6">
            <div className="mb-4">
              <div className="withdrawal-box payment-box">
                <div className="row">
                  <div className="col-12 d-flex justify-content-between align-items-center ">
                    <button className="payment-content-button">
                      <span>Google Ad (enable/disable google ads in app)</span>
                    </button>
                    <FormControlLabel
                      control={
                        <MaterialUISwitch
                          sx={{ m: 1 }}
                          checked={googleAds}
                          onChange={() => handleChangeAds()}
                        />
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-4">
              <div className="withdrawal-box payment-box">
                <h6>Android</h6>
                <div className="col-12 withdrawal-input border-setting">
                  <Input
                    label={"Android Google Interstitial"}
                    name={"androidGoogleInterstitial"}
                    type={"text"}
                    value={androidGoogleInterstitial}
                    errorMessage={
                      error.androidGoogleInterstitial &&
                      error.androidGoogleInterstitial
                    }
                    placeholder={"Enter Detail..."}
                    onChange={(e) => {
                      setAndroidGoogleInterstitial(e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <Input
                    label={"Android Google Native"}
                    name={"androidGoogleNative"}
                    type={"text"}
                    value={androidGoogleNative}
                    errorMessage={
                      error.androidGoogleNative && error.androidGoogleNative
                    }
                    placeholder={"Enter Detail..."}
                    onChange={(e) => {
                      setAndroidGoogleNative(e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <Input
                    label={"Android Google Reward"}
                    name={"androidGoogleReward"}
                    type={"text"}
                    value={androidGoogleReward}
                    errorMessage={
                      error.androidGoogleReward && error.androidGoogleReward
                    }
                    placeholder={"Enter Detail..."}
                    onChange={(e) => {
                      setAndroidGoogleReward(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <div className="withdrawal-box payment-box">
                <h6>IOS</h6>
                <div className="col-12 withdrawal-input border-setting">
                  <Input
                    label={"IOS Google Interstitial"}
                    name={"iosGoogleInterstitial"}
                    type={"text"}
                    value={iosGoogleInterstitial}
                    errorMessage={
                      error.iosGoogleInterstitial && error.iosGoogleInterstitial
                    }
                    placeholder={"Enter Detail..."}
                    onChange={(e) => {
                      setIosGoogleInterstitial(e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <Input
                    label={"IOS Google Native"}
                    name={"iosGoogleNative"}
                    type={"text"}
                    value={iosGoogleNative}
                    errorMessage={
                      error.iosGoogleNative && error.iosGoogleNative
                    }
                    placeholder={"Enter Detail..."}
                    onChange={(e) => {
                      setIosGoogleNative(e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <Input
                    label={"Ios Google Reward"}
                    name={"iosGoogleReward"}
                    type={"text"}
                    value={iosGoogleReward}
                    errorMessage={
                      error.iosGoogleReward && error.iosGoogleReward
                    }
                    placeholder={"Enter Detail..."}
                    onChange={(e) => {
                      setIosGoogleReward(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(null, {
  getSettingApi,
  editSetting,
  switchApi,
  getAdsApi,
  getWithdrawalApi,
})(MonetizationSetting);
