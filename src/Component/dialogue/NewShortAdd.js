import React, { useEffect, useState } from "react";
import Button from "../extra/Button";
import Input from "../extra/Input";
import Selector from "../extra/Selector";

import {
  getCountry,
  createFakeUser,
  getIpAddress,
  getFakeUserName,
} from "../store/user/user.action";
import { createShort, editShort } from "../store/shorts/shorts.action";
import { getSettingApi } from "../store/setting/setting.action";
import { connect, useDispatch, useSelector } from "react-redux";
import { covertURl, uploadFile } from "../../util/AwsFunction";
import noImageFrom from "../../assets/images/noimage.png";


import { CLOSE_DIALOGUE } from "../store/dialogue/dialogue.type";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import SmallLoader from "../extra/SmallLoader";

function NewShortAdd(props) {
  const AgeNumber = Array.from({ length: 100 }, (_, index) => index + 1);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const { setMultiButtonSelect, multiButtonSelect } = props;
  const { userProfile, countryData } = useSelector((state) => state.user);
  const { uploadFilePercent, loaderType } = useSelector(
    (state) => state.dialogue
  );
  const { settingData } = useSelector((state) => state.setting);

  const { fakeUser } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const [videoUploadLoader, setVideoUploadLoader] = useState(false);
  const [imageUploadLoader, setImageUploadLoader] = useState(false);
  const [title, setTitle] = useState();
  const [videoDescription, setVideoDescription] = useState();
  const [data, setData] = useState();
  const [country, setCountry] = useState();
  const [countryDataSelect, setCountryDataSelect] = useState();
  const [visibilityType, setVisibilityType] = useState(1);
  const [commentType, setCommentType] = useState(1);
  const [scheduleType, setScheduleType] = useState(1);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [reportType, setReportType] = useState(1);
  const [hashTag, setHashTag] = useState();
  const [videoTime, setVideoTime] = useState();
  const [scheduleTime, setScheduleTime] = useState();
  const [videoFile, setVideoFile] = useState();
  const [fakeUserSelect, setFakeUserSelect] = useState();
  const [showVideo, setShowVideo] = useState("");
  const [showVideoImg, setShowVideoImg] = useState();
  const [channelId, setChannelId] = useState();
  const [hashTagArray, setHashTagArray] = useState([]);
  const [countryDataGet, setCountryDataGet] = useState();
  const [videoImgApi, setVideoImgApi] = useState();
  const [videoFileApi, setVideoFileApi] = useState();
  const [settingDataGet, setSettingDataGet] = useState();
  const [audienceType, setAudienceType] = useState(1);
  const [fakeUserData, setFakeUserData] = useState([]);
  const [shortVideoDuration, setShortVideoDuration] = useState(true);
  const location = useLocation();
  const [video, setVideo] = useState({
    file: "",
    thumbnailBlob: "",
  });
  const [error, setError] = useState({
    title: "",
    countryDataSelect: "",
    video: "",
    fakeUserSelect: "",
    videoDescription: "",
    hashTag: "",
    scheduleTime: "",
    videoImg: "",
  });

  useEffect(() => {
    if (multiButtonSelect === "Import Shorts") {
      setCountryDataSelect([]);
    }
  }, []);

  useEffect(() => {
    if (dialogueData) {
      setFakeUserSelect(dialogueData?.userId);
      setTitle(dialogueData?.title);
      // setShowVideoImg(dialogueData?.videoImage);
      // setShowVideo(dialogueData?.videoUrl);
      setVideoTime(dialogueData?.videoTime);
      setVideoDescription(dialogueData?.description);
      setHashTag(dialogueData?.hashTag);
      setVisibilityType(dialogueData?.visibilityType);
      setScheduleType(dialogueData?.scheduleType);
      setCommentType(dialogueData?.commentType);
      setCountryDataSelect(dialogueData?.location);
      setChannelId(dialogueData?.channelId);
      setScheduleTime(dialogueData?.scheduleTime);
      setLongitude(dialogueData?.locationCoordinates?.longitude);
      setLatitude(dialogueData?.locationCoordinates?.latitude);
      setAudienceType(dialogueData?.audienceType);
      setVideoUploadLoader(true);
      setImageUploadLoader(true);
    }
  }, [dialogueData]);

  useEffect(() => {
    if (showVideo) {
      setVideoUploadLoader(true);
    }
  }, [showVideo]);

  useEffect(() => {
    if (showVideoImg) {
      setImageUploadLoader(true);
    }
  }, [showVideoImg]);

  useEffect(() => {
    setData(data);
    setSettingDataGet(settingData?.durationOfShorts);
  }, [userProfile, settingData]);

  useEffect(() => {
    const countryName = countryData?.map((item) => item?.name?.common);
    setCountry(countryName);
    const countryDataSelectData = countryData.filter((item) => {
      const countrySelect = item?.name?.common;
      return countrySelect?.toLowerCase() === countryDataSelect;
    });
    if (countryDataSelectData?.length > 0) {
      const getLatitude = countryDataSelectData?.map((item) => {
        setLatitude(item?.latlng[0]);
        setLongitude(item?.latlng[1]);
      });
    }

    const fakeUserChannelCheck = fakeUser?.filter(
      (item) => item?.isChannel === true && item?.isBlock === false
    );
    setFakeUserData(fakeUserChannelCheck);
  }, [countryDataSelect, countryData, fakeUser]);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getFakeUserName());
    dispatch(getSettingApi());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const fileNameWithExtensionThumbnail = dialogueData?.videoImage
        ?.split("/")
        .pop();
      const { imageURL: videoImage } = await covertURl(
        "shortsImage/" + fileNameWithExtensionThumbnail
      );
      const fileNameWithExtensionImage = dialogueData?.videoUrl
        ?.split("/")
        .pop();
      const { imageURL } = await covertURl(
        "Shorts/" + fileNameWithExtensionImage
      );
      setVideo({
        file: imageURL,
        thumbnailBlob: videoImage,
      });
    };
    if (dialogueData) {
      fetchData();
      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [dialogueData]);

  const handleClose = () => {
    dispatch({
      type: CLOSE_DIALOGUE,
      payload: {
        dialogue: false,
      },
    });

    let dialogueData_ = {
      dialogue: false,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  let folderStructure = "Shorts";
  let folderStructureImg = "shortsImage";
  const handleFileUpload = async (event) => {

    const selectedFile = event.target.files[0];
    setVideoFile(selectedFile);
    const thumbnailBlob = await generateThumbnailBlob(selectedFile);
    setVideo({
      file: selectedFile,
      thumbnailBlob: thumbnailBlob,
    });

    setVideoUploadLoader(true);
    const videoElement = document.createElement("video");
    videoElement.src = selectedFile ? URL.createObjectURL(selectedFile) : "";
    videoElement.addEventListener("loadedmetadata", async () => {
      const durationInSeconds = videoElement.duration;
      const durationInMilliseconds = durationInSeconds * 1000;
      setVideoTime(parseInt(durationInMilliseconds));
      const shortVideoDurationCheck =
        parseInt(durationInMilliseconds) < settingDataGet;
      setShortVideoDuration(shortVideoDurationCheck);

      if (durationInMilliseconds < settingDataGet) {
        if (thumbnailBlob) {
          const videoFileName = selectedFile ? selectedFile?.name : "video";
          const thumbnailFileName = `${videoFileName?.replace(
            /\.[^/.]+$/,
            ""
          )}.jpeg`;

          const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
            type: "image/jpeg",
          });
          const { resDataUrl, imageURL } = await uploadFile(
            thumbnailFile,
            folderStructureImg,
            dispatch,
            "imageLoader"
          );
          setVideoImgApi(resDataUrl);
          if (imageURL) {
            setShowVideoImg(imageURL);
          }
        }
        const { resDataUrl, imageURL } = await uploadFile(
          event.target.files[0],
          folderStructure,
          dispatch,
          "videoLoader"
        );
        setVideoFileApi(resDataUrl);
        if (imageURL) {
          setShowVideo(imageURL);
        }
      }
    });

    if (!event.target.files[0]) {
      return setError({
        ...error,
        video: `Short Is Required`,
      });
    } else {
      return setError({
        ...error,
        video: "",
      });
    }
  };

  const generateThumbnailBlob = async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set to capture the frame at 1 second
      };

      video.onseeked = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };

      const objectURL = URL.createObjectURL(file);
      video.src = objectURL;

      return () => {
        URL.revokeObjectURL(objectURL);
      };
    });
  };
  const handleFileUploadVideoImg = async (event) => {
    if (event.target.files[0]) {
      setImageUploadLoader(true);
    }
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureImg,
      dispatch,
      "imageLoader"
    );
    setVideoImgApi(resDataUrl);
    if (imageURL) {
      setShowVideoImg(imageURL);
    }
  };

  const handleDateChange = (date) => {
    setScheduleTime(date);
    if (!date) {
      return setError({
        ...error,
        scheduleTime: `Schedule Time Is Required !`,
      });
    } else {
      return setError({
        ...error,
        scheduleTime: "",
      });
    }
  };

  const updateHashTagArray = (newHashTag) => {
    const newHashTagArray = newHashTag
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setHashTagArray(newHashTagArray);
  };

  useState(() => {
    updateHashTagArray(hashTag);
  }, []);

  const handleHashTagChange = (event) => {
    const newHashTag = event.target.value;
    setHashTag(newHashTag);
    updateHashTagArray(newHashTag);
    if (!event.target.value && !dialogueData) {
      return setError({
        ...error,
        hashTag: `Hash Tag Is Required !`,
      });
    } else {
      return setError({
        ...error,
        hashTag: "",
      });
    }
  };



  const handleSubmit = () => {

    const channelIdFine = fakeUser?.filter(
      (item) => item?._id === fakeUserSelect
    );
    const getChannelIdFine = channelIdFine?.map((item) => {
      return item?.channelId;
    });
    const countryDataName = fakeUser?.filter(
      (item) => item?._id === fakeUserSelect
    );
    const getFullNameUser = countryDataName?.map((item) => {
      return item?.fullName;
    });
    if (
      !title ||
      (!dialogueData && !videoDescription) ||
      (!dialogueData && !fakeUserSelect) ||
      (!dialogueData && countryDataSelect?.length <= 0) ||
      (!dialogueData && scheduleType === 1 && !scheduleTime) ||
      (dialogueData ? "" : !video?.file) ||
      (
        !dialogueData && videoDescription === undefined
      ) ||
      (!dialogueData && hashTag === undefined)
    ) {
      const error = {};
      if (!title) error.title = "Title Is Required !";
      if (dialogueData ? "" : !video?.file) error.video = "Short Is Required !";
      if (!dialogueData && videoDescription === undefined)
        error.videoDescription = "Short Description Is Required !";
      if (!dialogueData && hashTag === undefined)
        error.hashTag = "Hash Tag Is Required !";
      if (!dialogueData && !fakeUserSelect)
        error.fakeUserSelect = "Fake User Is Required !";
      if (!dialogueData && countryDataSelect?.length <= 0)
        error.countryDataSelect = "Country Is Required !";
      if (!dialogueData && scheduleType === 1 && !scheduleTime)
        error.scheduleTime = "Schedule Time Is Required !";
      return setError({ ...error });
    } else {
      let newVideoAddData = {
        title: title,
        description: videoDescription,
        hashTag: Array.isArray(hashTag)
          ? hashTag
          : hashTag
          ? hashTag.split(",").map((tag) => tag.trim())
          : [],
        videoType: 2,
        videoTime: videoTime,
        visibilityType: visibilityType,
        commentType: commentType,
        scheduleType: scheduleType,
        scheduleTime:
          scheduleType === 1 ? dayjs(scheduleTime).format("YYYY-MM-DD") : "",
        location: countryDataSelect,
        audienceType,
        latitude: latitude,
        longitude: longitude,
        videoUrl: videoFileApi,
        videoImage: videoImgApi,
        userId: dialogueData ? dialogueData?.userId : fakeUserSelect,
        channelId: dialogueData
          ? dialogueData?.channelId
          : getChannelIdFine?.length === 0
          ? channelId
          : getChannelIdFine?.join(","),
      };

      if (dialogueData) {
        const videoId = dialogueData?._id;
        const userId = dialogueData?.userId;
        const channelIdFind = dialogueData?.channelId;
        const fullNameUser = getFullNameUser?.join(",");
        const type = 2;
        props.editShort(
          newVideoAddData,
          videoId,
          userId,
          channelIdFind,
          type,
          fullNameUser
        );
        handleClose();
      } else {
        props.createShort(newVideoAddData);
        setMultiButtonSelect("Manage Shorts");
      }
    }
  };

  return (
    <div>
      <div className="general-setting fake-user video-upload-page mt-3">
        <div className=" userSettingBox">
          <form>
            <div className="row d-flex  align-items-center">
              <div className="col-6">
                <h5 className="mb-0">
                  {dialogueType ? "Edit Short" : "Import Short"}
                </h5>
              </div>
              {dialogueType && (
                <div className="col-6 d-flex justify-content-end">
                  <Button
                    btnName={"Back"}
                    newClass={"back-btn"}
                    onClick={handleClose}
                  />
                </div>
              )}
              <form>
                <div
                  className="col-12 d-flex justify-content-end align-items-center"
                  style={{
                    paddingTop: "23px",
                    marginTop: "11px",
                    borderTop: "1px solid #c9c9c9",
                  }}
                >
                  <Button
                    newClass={"submit-btn"}
                    btnName={"Submit"}
                    type={"button"}
                    onClick={handleSubmit}
                  />
                </div>
                <div className="row">
                  {dialogueData ? (
                    ""
                  ) : (
                    <div className="col-12 col-lg-6 col-sm-6  mt-2 country-dropdown">
                      <Selector
                        label={"Fake User"}
                        selectValue={fakeUserSelect}
                        placeholder={"Enter Details..."}
                        selectData={fakeUserData}
                        selectId={true}
                        errorMessage={
                          error.fakeUserSelect && error.fakeUserSelect
                        }
                        onChange={(e) => {
                          setFakeUserSelect(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              fakeUserSelect: `Fake User Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              fakeUserSelect: "",
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                  <div className="col-12 col-lg-6 col-sm-6  mt-2">
                    <Input
                      label={"Title"}
                      name={"title"}
                      value={title}
                      placeholder={"Enter Details..."}
                      errorMessage={error.title && error.title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            title: `Title Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            title: "",
                          });
                        }
                      }}
                    />
                  </div>

                  <div className="col-12 col-lg-6 col-sm-6  mt-2 country-dropdown">
                    <Selector
                      label={"Country"}
                      selectValue={countryDataSelect}
                      placeholder={"Enter Details..."}
                      selectData={country}
                      errorMessage={
                        error.countryDataSelect && error.countryDataSelect
                      }
                      onChange={(e) => {
                        setCountryDataSelect(e.target.value);
                        if (!e.target.value && !dialogueData) {
                          return setError({
                            ...error,
                            countryDataSelect: `Country Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            countryDataSelect: "",
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="col-12 col-lg-6 col-sm-6  mt-2">
                    <Input
                      label={"Latitude"}
                      name={"latitude"}
                      disabled={true}
                      value={latitude}
                      placeholder={"Country Select"}
                    />
                  </div>
                  <div className="col-12 col-lg-6 col-sm-6  mt-2">
                    <Input
                      label={"Longitude"}
                      disabled={true}
                      name={"longitude"}
                      value={longitude}
                      placeholder={"Country Select"}
                    />
                  </div>
                  {!dialogueData && (
                    <div className="col-12  col-lg-6 col-sm-12 mt-2 mb-3"></div>
                  )}
                  <div className="col-12  col-lg-6 col-sm-12 mt-2 mb-3 video-upload">
                    <Input
                      type={"file"}
                      label={"Short Upload"}
                      accept={"video/mp4,video/x-m4v,video/*"}
                      onChange={handleFileUpload}
                      errorMessage={error.video && error.video}
                    />
                    <span
                      className="errorMessage"
                      style={{ fontWeight: "500" }}
                    >
                      {shortVideoDuration === false
                        ? "Long Video Not Upload"
                        : ""}
                    </span>
                    <div className="mt-3">
                      <Input
                        label={"Short Time"}
                        name={"videoTime"}
                        accept={"video/*"}
                        placeholder={"Short Video Upload"}
                        value={videoTime}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="col-12  col-lg-6 col-sm-12 mt-2 mb-3">
                    <div className="row">
                      <div className="col-12 col-sm-6  col-md-6  mt-2 mb-3 video-upload">
                        {video?.file && (
                          <div className="row video-show-upload">
                            {typeof video?.file === "string" ? (
                              <video controls width="400" src={video?.file} />
                            ) : (
                              <video
                                controls
                                width="400"
                                src={
                                  video?.file
                                    ? URL.createObjectURL(video?.file)
                                    : ""
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div className=" col-12 col-sm-6  col-md-6  mt-2 mb-3 video-show-upload">
                        {video?.thumbnailBlob && (
                          <>
                            {typeof video?.thumbnailBlob === "string" ? (
                              <>
                                <img
                                  src={
                                    video?.thumbnailBlob
                                      ? video?.thumbnailBlob
                                      : noImageFrom
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  src={
                                    video?.thumbnailBlob
                                      ? URL.createObjectURL(
                                          video?.thumbnailBlob
                                        )
                                      : noImageFrom
                                  }
                                />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="text-about">
                      <label
                        className="label-form"
                        style={{ fontWeight: "500", marginBottom: "5px" }}
                      >
                        Short Description
                      </label>
                      <textarea
                        cols={1}
                        rows={4}
                        value={videoDescription}
                        label={"Short Description"}
                        name={"videoDescription"}
                        placeholder={"Enter Details..."}
                        onChange={(e) => {
                          setVideoDescription(e.target.value);
                          if (!e.target.value && !dialogueData) {
                            return setError({
                              ...error,
                              videoDescription: `Short Description Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              videoDescription: "",
                            });
                          }
                        }}
                      ></textarea>
                      {error.videoDescription && (
                        <p className="errorMessage">
                          {error.videoDescription && error.videoDescription}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="text-about">
                      <label
                        className="label-form"
                        style={{ fontWeight: "500", marginBottom: "5px" }}
                      >
                        HashTag
                      </label>
                      <textarea
                        cols={1}
                        rows={4}
                        value={hashTag}
                        label={"HashTag"}
                        name={"hashTag"}
                        placeholder={"Enter Details..."}
                        onChange={handleHashTagChange}
                      ></textarea>
                      {error.hashTag && (
                        <p className="errorMessage">
                          {error.hashTag && error.hashTag}
                        </p>
                      )}
                      <span className="text-danger d-flex mt-1">
                        Note : You can add Hash Tag separate by comma (,)
                      </span>
                    </div>
                  </div>

                  <div className="col-12 col-lg-3 col-md-6  col-sm-6 mt-3  mb-3 d-flex align-items-baseline type-radio-box flex-column">
                    <div className=" d-flex align-items-start flex-column  ">
                      <label
                        className="text-gray"
                        style={{
                          margin: "1px 5px 0px 2px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#1F1F1F",
                        }}
                      >
                        Schedule Type :
                      </label>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="scheduleType"
                          type="radio"
                          value={1}
                          name="scheduleType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setScheduleType(e.target.value);
                          }}
                          checked={scheduleType == 1 ? true : false}
                        />
                        <label
                          class="form-check-label mb-1 "
                          for="scheduleType"
                        >
                          Schedule
                        </label>
                      </div>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="scheduleType"
                          type="radio"
                          value={2}
                          name="scheduleType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setScheduleType(e.target.value);
                          }}
                          checked={scheduleType == 2 ? true : false}
                        />
                        <label
                          class="form-check-label mb-1 "
                          for="scheduleType"
                        >
                          Not Schedule
                        </label>
                      </div>
                    </div>
                    <div className="">
                      {scheduleType == 1 && (
                        <div className="col-12 mt-2">
                          <div className="d-flex flex-column react-date-range-picker">
                            <label>Schedule Time</label>
                            <ReactDatePicker
                              dateFormat="yyyy/MM/dd"
                              selected={Date.parse(scheduleTime)}
                              placeholderText="Select a date"
                              showIcon
                              style={{width:"200px"}}
                              minDate={new Date()}
                              onChange={(date) => handleDateChange(date)}
                            />
                            {error.scheduleTime && (
                              <p className="errorMessage">
                                {error.scheduleTime && error.scheduleTime}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-3 col-md-6  col-sm-6 mt-2 d-flex align-items-baseline type-radio-box">
                    <div className="d-flex align-items-start flex-column">
                      <label
                        className="text-gray"
                        style={{
                          margin: "1px 5px 0px 2px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#1F1F1F",
                        }}
                      >
                        Visibility Type :
                      </label>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="normalVideo"
                          type="radio"
                          value={1}
                          name="visibilityType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setVisibilityType(e.target.value);
                          }}
                          checked={visibilityType == 1 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="normalVideo">
                          Public
                        </label>
                      </div>
                      <div
                        className="  justify-content-start d-flex align-items-center ml-3 pl-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          type="radio"
                          id="shortVideo"
                          value={2}
                          name="visibilityType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setVisibilityType(e.target.value);
                          }}
                          checked={visibilityType == 2 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="shortVideo">
                          Private
                        </label>
                      </div>
                      <div
                        className="  justify-content-start d-flex align-items-center ml-3 pl-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          type="radio"
                          id="shortVideo"
                          value={3}
                          name="visibilityType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setVisibilityType(e.target.value);
                          }}
                          checked={visibilityType == 3 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="shortVideo">
                          Unlisted
                        </label>
                      </div>
                    </div>
                  </div>
              
                
                  <div className="col-12 col-lg-3 col-md-6  col-sm-6 mt-2 d-flex align-items-baseline type-radio-box">
                    <div className="d-flex align-items-start flex-column">
                      <label
                        className="text-gray"
                        style={{
                          margin: "1px 5px 0px 2px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#1F1F1F",
                        }}
                      >
                        Comment Type :
                      </label>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="commentType"
                          type="radio"
                          value={1}
                          name="commentType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setCommentType(e.target.value);
                          }}
                          checked={commentType == 1 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="commentType">
                          Allow All
                        </label>
                      </div>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="commentType"
                          type="radio"
                          value={2}
                          name="commentType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setCommentType(e.target.value);
                          }}
                          checked={commentType == 2 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="commentType">
                          Disable
                        </label>
                      </div>
                      {/* <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <div style={{ width: "17px" }}>
                          <input
                            id="commentType"
                            type="radio"
                            value={3}
                            name="commentType"
                            className="ml-2 mb-0 cursor-pointer"
                            onClick={(e) => {
                              setCommentType(e.target.value);
                            }}
                            checked={commentType == 3 ? true : false}
                          />
                        </div>
                        <label class="form-check-label mb-1 " for="commentType">
                          Hold Potentially InApproPrivate For Review
                        </label>
                      </div> */}
                      {/* <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="commentType"
                          type="radio"
                          value={4}
                          name="commentType"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setCommentType(e.target.value);
                          }}
                          checked={commentType == 4 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="commentType">
                          Hold All For Review
                        </label>
                      </div> */}
                    </div>
                  </div>
                  <div className="col-12 col-lg-3 col-md-6  col-sm-6 mt-2 d-flex align-items-baseline type-radio-box">
                    <div className="d-flex align-items-start flex-column">
                      <label
                        className="text-gray"
                        style={{
                          margin: "1px 5px 0px 2px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#1F1F1F",
                        }}
                      >
                        Audience Type :
                      </label>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="audienceType1"
                          type="radio"
                          value={1}
                          name="audienceType1"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setAudienceType(e.target.value);
                          }}
                          checked={audienceType == 1 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="audienceType1">
                          Kids
                        </label>
                      </div>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <input
                          id="audienceType2"
                          type="radio"
                          value={2}
                          name="audienceType2"
                          className="ml-2 mb-0 cursor-pointer"
                          onClick={(e) => {
                            setAudienceType(e.target.value);
                          }}
                          checked={audienceType == 2 ? true : false}
                        />
                        <label class="form-check-label mb-1 " for="audienceType2">
                          Adults
                        </label>
                      </div>
                      <div
                        class=" justify-content-start d-flex align-items-center mr-3 pr-2"
                        style={{ marginTop: "3px" }}
                      >
                        <div style={{ width: "17px" }}>
                          <input
                            id="audienceType3"
                            type="radio"
                            value={3}
                            name="audienceType3"
                            className="ml-2 mb-0 cursor-pointer"
                            onClick={(e) => {
                              setAudienceType(e.target.value);
                            }}
                            checked={audienceType == 3 ? true : false}
                          />
                        </div>
                        <label class="form-check-label mb-1 " for="audienceType3">
                          Both
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              </form>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getCountry,
  createFakeUser,
  getFakeUserName,
  getIpAddress,
  createShort,
  editShort,
  getSettingApi,
})(NewShortAdd);
