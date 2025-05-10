import React, { useEffect, useState } from "react";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import NewTitle from "../../extra/Title";
import {
  getSettingApi,
  editSetting,
  switchApi,
  editWaterMark,
} from "../../store/setting/setting.action";
import { FormControlLabel, Switch } from "@mui/material";
import styled from "@emotion/styled";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import { covertURl, uploadFile } from "../../../util/AwsFunction";
import { baseURL } from "../../../util/config";
import noImageFound from "../../../assets/images/noimage.png";

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
function AppSetting(props) {
  const { settingData } = useSelector((state) => state.setting);
  const { defaultCurrency } = useSelector((state) => state.currency);

  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState();
  const [privacyPolicyText, setPrivacyPolicyText] = useState();
  const [zegoAppSignIn, setZegoAppSignIn] = useState();
  const [zegoAppId, setZegoAppId] = useState();
  const [adminCommissionOfPaidChannel, setAdminCommissionOfPaidChannel] =
    useState();
  const [adminCommissionOfPaidVideo, setAdminCommissionOfPaidVideo] =
    useState();
  const [durationOfShorts, setDurationOfShorts] = useState();
  const [privateKey, setPrivateKey] = useState();
  const [minCoinForCashOut, setMinCoinForCashOut] = useState();
  const [minConvertCoin, setMinConvertCoin] = useState();
  const [selectedOption, setSelectedOption] = useState(settingData?.isWatermarkOn ? "Active" : "Inactive");
  const [image, setImage] = useState(null)
  const [imgApi, setImgApi] = useState();
  const [showImg, setShowImg] = useState();

  const [error, setError] = useState({
    privacyPolicyLink: "",
    privacyPolicyText: "",
    zegoAppId: "",
    zegoAppSignIn: "",
    adminCommissionOfPaidChannel: "",
    adminCommissionOfPaidVideo: "",
    durationOfShorts: "",
    privateKey: "",
    minCoinForCashOut: "",
    minConvertCoin: "",
  });

  useEffect(() => {
    dispatch(getSettingApi());
    dispatch(getDefaultCurrency());
  }, [dispatch]);
  useEffect(() => {
    setSelectedOption(settingData?.isWatermarkOn ? "active" : "inactive");
    setImage(settingData?.watermarkIcon ?  settingData?.watermarkIcon : noImageFound);
  }, [settingData]);






  const handleWaterMarkSubmit = () => {
    let data = {
      settingId: settingData?._id,
      watermarkType: selectedOption === "active" ? 1 : 2,
      watermarkIcon: imgApi
    }
    props.editWaterMark(data);

  }


  useEffect(() => {
    setData(settingData);
  }, [settingData]);

  useEffect(() => {
    setPrivacyPolicyLink(settingData?.privacyPolicyLink);
    setPrivacyPolicyText(settingData?.privacyPolicyText);
    setAdminCommissionOfPaidChannel(settingData?.adminCommissionOfPaidChannel);
    setAdminCommissionOfPaidVideo(settingData?.adminCommissionOfPaidVideo);
    setDurationOfShorts(settingData?.durationOfShorts);
    setZegoAppId(settingData?.zegoAppId);
    setZegoAppSignIn(settingData?.zegoAppSignIn);
    setPrivateKey(JSON.stringify(settingData?.privateKey));
    setMinCoinForCashOut(settingData?.minCoinForCashOut);
    setMinConvertCoin(settingData?.minConvertCoin);
  }, [settingData]);

  const handleSubmit = () => {

    const adminCommissionOfPaidChannelValue = parseInt(
      adminCommissionOfPaidChannel
    );
    const adminCommissionOfPaidVideoValue = parseInt(
      adminCommissionOfPaidVideo
    );
    const durationOfShortsValue = parseInt(durationOfShorts);
    const minCoinForCashOutvalue = parseInt(minCoinForCashOut);
    const minConvertCoinvalue = parseInt(minConvertCoin);
    if (
      !privacyPolicyLink ||
      !privacyPolicyText ||
      !privateKey ||
      !zegoAppId ||
      !zegoAppSignIn ||
      adminCommissionOfPaidChannel === "" ||
      adminCommissionOfPaidVideo === "" ||
      durationOfShorts === "" ||
      adminCommissionOfPaidChannelValue < 0 ||
      adminCommissionOfPaidVideoValue < 0 ||
      durationOfShortsValue < 0 ||
      minCoinForCashOutvalue < 0 ||
      minConvertCoinvalue < 0
    ) {
      let error = {};
      if (!privacyPolicyLink)
        error.privacyPolicyLink = "PrivacyPolicyLink Is Required !";
      if (!privacyPolicyText)
        error.privacyPolicyText = "PrivacyPolicyText Is Required !";

      if (!zegoAppId) error.zegoAppId = "Zego AppID Is Required !";
      if (!zegoAppSignIn) error.zegoAppSignIn = "Zego AppSignIn Is Required !";
      if (adminCommissionOfPaidChannel === "")
        error.adminCommissionOfPaidChannel =
          "Commission Of PaidChannel Is Required !";
      if (adminCommissionOfPaidVideo === "")
        error.adminCommissionOfPaidVideo =
          "Commission Of PaidVideo Is Required !";
      if (durationOfShorts === "")
        error.durationOfShorts = "Duration Of Shorts Is Required !";
      if (adminCommissionOfPaidChannelValue < 0)
        error.adminCommissionOfPaidChannel =
          "Commission Of PaidChannel Invalid !";
      if (adminCommissionOfPaidVideoValue < 0)
        error.adminCommissionOfPaidVideo = "Commission Of PaidVideo Invalid !";
      wwwwwwww;
      if (durationOfShortsValue < 0)
        error.durationOfShorts = "Duration Of Shorts Invalid !";
      if (minCoinForCashOutvalue < 0)
        error.minCoinForCashOut = "Minimum coin for cash out Invalid !";
      if (minConvertCoin < 0)
        error.minConvertCoin = "Minimum convert coin Invalid !";
      if (!privateKey) error.privateKey = "Private Key Json Is Required !";
      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        settingId: data?._id,
        privacyPolicyLink: privacyPolicyLink,
        privacyPolicyText: privacyPolicyText,
        adminCommissionOfPaidChannel: adminCommissionOfPaidChannel,
        adminCommissionOfPaidVideo: adminCommissionOfPaidVideo,
        durationOfShorts: durationOfShorts,
        zegoAppId: zegoAppId,
        zegoAppSignIn: zegoAppSignIn,
        privateKey: privateKey,
        minCoinForCashOut: minCoinForCashOut,
        minConvertCoin: minConvertCoin,
      };
      props.editSetting(data?._id, settingDataSubmit);
    }
  };




  let folderStructure = "waterMarkImage";
  const handleFileUpload = async (event) => {
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructure
    );
    setImgApi(resDataUrl);
    if (imageURL) {
      setImage(imageURL);
    }

    if (!event.target.files[0]) {
      return setError({
        ...error,
        image: `Image Is Required`,
      });
    } else {
      return setError({
        ...error,
        image: "",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fileNameWithExtensionThumbnail = settingData?.watermarkIcon?.split("/").pop();

      if (fileNameWithExtensionThumbnail) {
        try {
          const { imageURL: image } = await covertURl(
            "waterMarkImage/" + fileNameWithExtensionThumbnail
          );
          setImage(image);
        } catch (error) {
          console.error("Error fetching watermark image URL:", error);
        }
      }
    };

    if (settingData) {
      fetchData();
      const interval = setInterval(fetchData, 1000 * 60); // 1-minute interval
      return () => clearInterval(interval);
    }
  }, [settingData]);


  return (
    <div className="payment-setting app-setting p-0">
      <div className="dashboardHeader primeHeader mb-3 p-0">
        {/* <NewTitle dayAnalyticsShow={false} titleShow={true} name={``} /> */}
      </div>
      <div className="payment-setting-box p-3">
        <form>
          <div className="row">
            <div className="col-6 d-flex align-ltems-center">
              <h5 className="mb-0 d-flex align-ltems-center pt-2">
                App Setting
              </h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
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
                  <h6>App Setting</h6>
                  <div className="row">
                    <div className="col-12 withdrawal-input border-setting">
                      <Input
                        label={
                          "Privacy Policy Link (User redirected to this link in app)"
                        }
                        name={"privacyPolicyLink"}
                        type={"text"}
                        value={privacyPolicyLink}
                        errorMessage={
                          error.privacyPolicyLink && error.privacyPolicyLink
                        }
                        placeholder={"Enter Detail..."}
                        onChange={(e) => {
                          setPrivacyPolicyLink(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              privacyPolicyLink: `PrivacyPolicyLink Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              privacyPolicyLink: "",
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-12 withdrawal-input mt-2 border-0">
                      <Input
                        label={"Privacy Policy Text (Show in app)"}
                        name={"privacyPolicyText"}
                        value={privacyPolicyText}
                        errorMessage={
                          error.privacyPolicyText && error.privacyPolicyText
                        }
                        type={"text"}
                        placeholder={"Enter Detail..."}
                        onChange={(e) => {
                          setPrivacyPolicyText(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              privacyPolicyText: `PrivacyPolicyText Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              privacyPolicyText: "",
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
                  <h6>Zego Cloud Setting</h6>
                  <div className="row">
                    <div className="col-12 withdrawal-input">
                      <Input
                        label={"Zego AppId"}
                        name={"zegoAppId"}
                        type={"text"}
                        value={zegoAppId}
                        placeholder={"Enter Detail..."}
                        errorMessage={error.zegoAppId && error.zegoAppId}
                        onChange={(e) => {
                          setZegoAppId(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              zegoAppId: `Zego AppId Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              zegoAppId: "",
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-12 withdrawal-input border-0 mt-2">
                      <Input
                        label={"Zego AppSignIn"}
                        name={"zegoAppSignIn"}
                        value={zegoAppSignIn}
                        errorMessage={
                          error.zegoAppSignIn && error.zegoAppSignIn
                        }
                        type={"text"}
                        placeholder={"Enter Detail..."}
                        onChange={(e) => {
                          setZegoAppSignIn(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              zegoAppSignIn: `zegoApp SignIn Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              zegoAppSignIn: "",
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
                <div className="withdrawal-box payment-box video-short-setting">
                  <div className="video-short-setting">
                    <h6 className="mb-1">Firebase Notification Setting</h6>
                  </div>
                  <div className="row">
                    <div className="col-12 withdrawal-input duration-short border-0 mt-0">
                      <div className="custom-input number undefined false">
                        <label class="form-label" htmlFor="privateKey">
                          Private Key JSON (firebase private key for
                          notification)
                        </label>
                        <textarea
                          name=""
                          className="form-control mt-2"
                          id="privateKey"
                          rows={10}
                          value={privateKey}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            try {
                              const newData = JSON.parse(newValue);
                              setPrivateKey(newValue);
                              setError("");
                            } catch (error) {
                              // Handle invalid JSON input
                              console.error("Invalid JSON input:", error);
                              setPrivateKey(newValue);
                              return setError({
                                ...error,
                                privateKey: "Invalid JSON input",
                              });
                            }
                          }}
                        ></textarea>

                        {error.privateKey && (
                          <div className="ml-2 mt-1">
                            {error.privateKey && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {error.privateKey}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-sm-12">
              <div className="mb-4">
                <div className="withdrawal-box payment-box video-short-setting">
                  <div className="video-short-setting">
                    <h6 className="mb-1">Channel Video Short Setting</h6>
                  </div>
                  <div className="row">
                    <div className="col-12 withdrawal-input duration-short border-0 mt-0">
                      <Input
                        label={`Duration Of Shorts in miliseconds (1000 = 1second) (User can upload short video max ${durationOfShorts / 1000
                          } second)`}
                        name={"durationOfShorts"}
                        type={"number"}
                        value={durationOfShorts}
                        errorMessage={
                          error.durationOfShorts && error.durationOfShorts
                        }
                        placeholder={"Enter Detail..."}
                        onChange={(e) => {
                          setDurationOfShorts(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              durationOfShorts: `Duration Of Shorts Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              durationOfShorts: "",
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="withdrawal-box payment-box mt-4">
                  <h6>Coin Setting</h6>

                  <div className="row">
                    <div className="col-6 withdrawal-input">
                      <div className="row">
                        <div className="col-11">
                          <Input
                            label={`Amount(${defaultCurrency?.symbol
                              ? defaultCurrency?.symbol
                              : ""
                              })`}
                            name={"durationOfShorts"}
                            type={"number"}
                            value={`1`}
                            placeholder={""}
                            readOnly
                          />
                        </div>

                        <p className="col-1 d-flex align-items-center mt-3 fs-5">
                          =
                        </p>
                      </div>
                    </div>

                    <div className="col-6 withdrawal-input">
                      <Input
                        label={"Coin(how many coin required for withdraw)"}
                        name={"Coin"}
                        value={minCoinForCashOut}
                        type={"number"}
                        placeholder={""}
                        onChange={(e) => {
                          setMinCoinForCashOut(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-12 withdrawal-input">
                      <Input
                        label={"Coin  (how many coin required for covert)"}
                        name={"minConvertCoin"}
                        value={minConvertCoin}
                        type={"number"}
                        placeholder={""}
                        onChange={(e) => {
                          setMinConvertCoin(e.target.value);
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
                  <h6
                  style={{

                    borderBottom: "1px solid #dbdbdb",
                    paddingBottom : "15px"
                  }}
                  >Water Mark Setting</h6>
                  <div className="row">
                    {/* Radio Button for Inactive */}
                    <div className="d-flex justify-content-center mt-4 ">
                      <div className="col-6">
                        <label className={`radio-label ${selectedOption === "inactive" ? "active-radio" : ""}`}>
                          <input
                            type="radio"
                            name="watermark"
                            value="inactive"
                            className="ms-2 custom-radio"
                            checked={selectedOption === "inactive"}
                            onChange={() => {
                              setSelectedOption("inactive")
                            }}
                          />
                          Inactive
                        </label>
                      </div>
                      {/* Radio Button for Active */}
                      <div className="col-6">
                        <label className={`radio-label ${selectedOption === "active" ? "active-radio" : ""}`}>
                          <input
                            type="radio"
                            name="watermark"
                            value="active"
                            className="ms-2 custom-radio"
                            checked={selectedOption === "active"}
                            onChange={() => setSelectedOption("active")}
                          />
                          Active
                        </label>
                      </div>
                    </div>

                    {
                      selectedOption === "inactive" && (
                        <div className="d-flex justify-content-end mt-4">
                          <Button
                            btnName={"Submit"}
                            type={"button"}
                            onClick={handleWaterMarkSubmit}
                            newClass={"submit-btn"}
                            style={{
                              borderRadius: "0.5rem",
                              width: "88px",
                              marginLeft: "10px",
                            }}
                          />
                        </div>

                      )
                    }

                  </div>

                  {/* Conditionally render the image upload input if 'Active' is selected */}
                  {selectedOption === "active" && (
                    <>
                      {/* <div className="mt-3">
                        <label htmlFor="imageUpload">Upload Watermark Image:</label>
                        <input
                          type="file"
                          id="imageUpload"
                          name="imageUpload"
                          accept="image/*"
                          className="form-control"
                        />
                      </div> */}
                      <div className="mt-4">
                        <Input
                          type={"file"}
                          label={"Upload Watermark Image"}
                          accept={"image/png, image/jpeg"}
                          // errorMessage={error.image && error.image}
                          onChange={handleFileUpload}
                        />
                      </div>

                      <div className=" mt-2 fake-create-img mb-2">
                        {image && (
                          <div className="mt-3">
                            <img
                              src={image}
                              // alt="Watermark Preview"
                              style={{ width: "96px", height: "auto" }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        <Button
                          btnName={"Submit"}
                          type={"button"}
                          onClick={handleWaterMarkSubmit}
                          newClass={"submit-btn"}
                          style={{
                            borderRadius: "0.5rem",
                            width: "88px",
                            marginLeft: "10px",
                          }}
                        />
                      </div>

                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default connect(null, {
  getSettingApi,
  editSetting,
  switchApi,
  editWaterMark
})(AppSetting);
