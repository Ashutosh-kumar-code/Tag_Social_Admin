import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Selector from "../extra/Selector";
import Input from "../extra/Input";
import Button from "../extra/Button";
import {
  addSound,
  editSound,
  getSoundCategory,
} from "../store/sound/sound.action";
import noImageFrom from "../../assets/images/noimage.png";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_DIALOGUE } from "../store/dialogue/dialogue.type";
import { covertURl, uploadFile } from "../../util/AwsFunction";
import ReactAudioPlayer from "react-audio-player";
import SmallLoader from "../extra/SmallLoader";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: 24,
  p: "19px",
};

function SoundAdd(props) {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const { soundCategoryData } = useSelector((state) => state.sound);
  const { uploadFilePercent, loaderType } = useSelector(
    (state) => state.dialogue
  );


  const [videoUploadLoader, setVideoUploadLoader] = useState(false);
  const [imageUploadLoader, setImageUploadLoader] = useState(false);
  const [addSoundOpen, setAddSoundOpen] = useState(false);
  const [name, setName] = useState();
  const [userSelect, setUserSelect] = useState();
  const [imgApi, setImgApi] = useState();
  const [image, setImage] = useState();
  const [soundTitle, setSoundTitle] = useState();
  const [soundTime, setSoundTime] = useState();
  const [soundLink, setSoundLink] = useState();
  const [soundCategoryId, setSoundCategoryId] = useState();
  const [soundCategoryDataGet, setSoundCategoryDataGet] = useState();
  const [showSound, setShowSound] = useState();
  const [error, setError] = useState({
    name: "",
    image,
    soundTitle: "",
    soundLink: "",
    soundImage: "",
    soundCategoryId: "",
  });

  useEffect(() => {
    setSoundCategoryDataGet(soundCategoryData);
  }, [soundCategoryData]);

  const dispatch = useDispatch();
  useEffect(() => {
    setAddSoundOpen(dialogue);
    if (dialogueData) {
      setName(dialogueData?.singerName);
      // setImage(dialogueData?.soundImage);
      // setSoundLink(dialogueData?.soundLink);
      setSoundCategoryId(dialogueData?.soundCategoryId?._id);
      setSoundTime(dialogueData?.soundTime);
      setSoundTitle(dialogueData?.soundTitle);
      setVideoUploadLoader(true);
      setImageUploadLoader(true);
    }
  }, [dialogue]);

  useEffect(() => {
    setUserSelect(dialogueData?.fullName);
  }, [dialogueData]);

  useEffect(() => {
    if (showSound) {
      setVideoUploadLoader(true);
    }
  }, [showSound]);

  useEffect(() => {
    if (image) {
      setImageUploadLoader(true);
    }
  }, [image]);

  useEffect(() => {
    dispatch(getSoundCategory());
  }, [dispatch]);

  const handleCloseAddCategory = () => {
    setAddSoundOpen(false);
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

  let folderStructure = "userImage";
  const handleFileUpload = async (event) => {

    if (event.target.files[0]) {
      setImageUploadLoader(true);
    }
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructure,
      dispatch,
      "imageLoader"
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

  let folderStructureSound = "SoundList";
  const handleSoundUpload = async (event) => {
    if (event.target.files[0]) {
      setVideoUploadLoader(true);
    }
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureSound,
      dispatch,
      "soundLoader"
    );
    setSoundLink(resDataUrl);
    if (imageURL) {
      setShowSound(imageURL);
    }
    const selectedFile = event.target.files[0];
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(selectedFile);
    videoElement.addEventListener("loadedmetadata", () => {
      const durationInSeconds = videoElement.duration;
      const durationInMilliseconds = durationInSeconds * 1000;
      setSoundTime(parseInt(durationInMilliseconds));
    });

    if (!event.target.files[0]) {
      return setError({
        ...error,
        soundLink: `Sound Is Required`,
      });
    } else {
      return setError({
        ...error,
        soundLink: "",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fileNameWithExtensionThumbnail = dialogueData?.soundImage
        ?.split("/")
        .pop();
      const { imageURL: image } = await covertURl(
        "userImage/" + fileNameWithExtensionThumbnail
      );
        setImage(image);
      const fileNameWithExtensionImage = dialogueData?.soundLink
        ?.split("/")
        .pop();
      const { imageURL } = await covertURl(
        "SoundList/" + fileNameWithExtensionImage
      );
      setShowSound(imageURL);
    };
    if (dialogueData) {
      fetchData();
      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [dialogueData]);

  const handleSubmit = () => {
    if (
      !name ||
      (dialogueData ? "" : !image) ||
      !soundCategoryId ||
      !soundTitle ||
      (dialogueData ? "" : !soundLink)
    ) {
      let error = {};
      if (!name) error.channelName = "Name Is Required !";
      if (!image) error.image = "Image Is Required !";
      if (!soundCategoryId)
        error.soundCategoryId = "Sound Category Is Required !";
      if (!soundTitle) error.soundTitle = "Sound Title Is Required !";
      if (!soundLink) error.soundLink = "Sound Upload Is Required !";
      return setError({ ...error });
    } else {
      const addSoundData = {
        singerName: name?.trim(),
        soundImage: imgApi?.trim(),
        soundLink: soundLink,
        soundTime: soundTime,
        soundTitle: soundTitle,
        soundCategoryId: soundCategoryId,
      };
      if (dialogueData) {
        props.editSound(dialogueData?._id, addSoundData);
      } else {
        props.addSound(addSoundData);
      }
      handleCloseAddCategory();
    }
  };
  return (
    <div>
      <Modal
        open={addSoundOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit Sound" : "Add Sound"}
          </Typography>
          <form>
            <div className="row sound-add-box">
              <div className="col-lg-6 col-sm-12">
                <Input
                  label={"Singer Name"}
                  name={"name"}
                  placeholder={"Enter Details..."}
                  value={name}
                  errorMessage={error.name && error.name}
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
              <div className="col-lg-6 col-sm-12">
                <Input
                  label={"Sound Title"}
                  name={"soundTitle"}
                  placeholder={"Enter Details..."}
                  value={soundTitle}
                  errorMessage={error.soundTitle && error.soundTitle}
                  onChange={(e) => {
                    setSoundTitle(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        soundTitle: `Sound Title Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        soundTitle: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-12 col-lg-6 col-sm-12 mt-2">
                <Selector
                  label={"Sound Category"}
                  selectValue={soundCategoryId}
                  placeholder={"Select Category"}
                  selectData={soundCategoryDataGet}
                  selectId={true}
                  errorMessage={error.soundCategoryId && error.soundCategoryId}
                  onChange={(e) => {
                    setSoundCategoryId(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        soundCategoryId: `Sound Category Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        soundCategoryId: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-lg-6 col-sm-12 mt-2">
                <Input
                  label={"Sound Time"}
                  name={"soundTime"}
                  disabled={true}
                  placeholder={"Sound Upload"}
                  value={soundTime}
                />
              </div>
              <div className="col-lg-6 col-sm-12 mt-2">
                <Input
                  type={"file"}
                  label={"Sound Upload"}
                  accept={".mp3,audio/*"}
                  errorMessage={error.soundLink && error.soundLink}
                  onChange={handleSoundUpload}
                />
              </div>
              <div className="col-lg-6 col-sm-12 mt-2">
                <Input
                  type={"file"}
                  label={"Sound Image"}
                  accept={"image/png, image/jpeg"}
                  errorMessage={error.image && error.image}
                  onChange={handleFileUpload}
                />
              </div>
              <div className="col-lg-12 col-sm-12 mt-3 audio-upload">
                <div className="video-upload-loader" style={{width:"100%",height:"unset"}}>
                  {videoUploadLoader ? (
                    (
                      loaderType === "soundLoader"
                        ? uploadFilePercent === null
                          ? true
                          : uploadFilePercent === 100
                        : true
                    ) ? (
                      <ReactAudioPlayer
                        src={showSound}
                        controls
                        autoPlay
                        muted
                        onPlay={() => console.log("Audio is playing")}
                        onError={(error) =>
                          console.error("Audio error:", error)
                        }
                      />
                    ) : (
                      <>
                        <SmallLoader
                          loaderType={"percentLoader"}
                          percentShow={true}
                        />
                      </>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
                <div className="col-lg-12 col-sm-12 mt-3 fake-create-img" >
                <div className="video-upload-loader" style={{width:"100%",height:"unset"}}>
                  {imageUploadLoader ? (
                    (
                      loaderType === "imageLoader"
                        ? image === null
                          ? true
                          : image
                        : true
                    ) ? (
                      image && (
                        <img
                          src={image}
                          onError={(e) => {
                            e.target.src = noImageFrom;
                          }}
                        />
                      )
                    ) : (
                      <>
                        <SmallLoader loaderType={"imageLoader"} />
                      </>
                    )
                  ) : (
                    ""
                  )}
                </div>
                </div>
           
            </div>
            <div className="mt-3 pt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAddCategory}
                btnName={"Close"}
                newClass={"close-model-btn"}
              />
              <Button
                onClick={handleSubmit}
                btnName={"Submit"}
                type={"button"}
                newClass={"submit-btn"}
                style={{
                  borderRadius: "0.5rem",
                  width: "88px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
export default connect(null, {
  addSound,
  editSound,
  getSoundCategory,
})(SoundAdd);
