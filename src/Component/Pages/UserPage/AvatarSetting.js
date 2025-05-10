import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import AvtarImg from "../../../assets/images/UserSettingAvtar.jpg";
import $ from "jquery";
import CoverImg from "../../../assets/images/userSettingCover.png";
import Input from "../../extra/Input";
import { covertURl, uploadFile } from "../../../util/AwsFunction";
import { editUserProfile, getUserProfile } from "../../store/user/user.action";
import EditIcon from "@mui/icons-material/Edit";
import { connect, useDispatch, useSelector } from "react-redux";
import UserImage from "../../../assets/images/8.jpg";
import { Skeleton } from "@mui/material";


function AvatarSetting(props) {
  const { multiButtonSelectNavigateSet, multiButtonSelectNavigate } = props;
  $("input[type='image']").click(function () {
    $("input[id='my_file']").click();
  });

  const [image, setImage] = useState("");
  const [imageShow, setImageShow] = useState("");
  const [userId, setUserId] = useState("");
  const [isChannel, setIsChannel] = useState("");
  const { userProfile, countryData } = useSelector((state) => state.user);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const dispatch = useDispatch();
  useEffect(() => {
    multiButtonSelectNavigate === "Avatar"
      ? localStorage.setItem(
          "multiButton",
          JSON.stringify(multiButtonSelectNavigate)
        )
      : localStorage.removeItem("multiButton");
  }, [multiButtonSelectNavigate]);

  useEffect(() => {
    if (userProfile?.image) {
      const fileNameWithExtension = userProfile?.image.split("/").pop();
      const fetchData = async () => {
        try {
          const { imageURL } = await covertURl(
            "userImage/" + fileNameWithExtension
          );
          setImageShow(imageURL);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [userProfile]);

  let folderStructure = "userImage";
  const handleFileUpload = async (event) => {

    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructure
    );

    if (imageURL) {
      setImageShow(imageURL);
      let editImage = {
        image: resDataUrl,
        userId: userId,
      };
      props.editUserProfile(dialogueData?._id, editImage, isChannel);
    }
  };

  useEffect(() => {
    dispatch(getUserProfile(dialogueData?._id, dialogueData?.isChannel));
  }, [dispatch, dialogueData]);

  useEffect(() => {
    setUserId(userProfile?._id);
    setIsChannel(userProfile?.isChannel);
    setImage(userProfile?.image);
  }, [userProfile]);

  return (
    <div className="avatar-setting">
      <div className=" userSettingBox">
        <div className="row d-flex align-items-center mt-3">
          <div className="col-12">
            <h5>Avatar & Cover</h5>
          </div>
        </div>
        <div className="image-avatar-box">
          <div className="cover-img-user">
            <img src={CoverImg ? CoverImg : ""} />
          </div>
          <div className="avatar-img-user">
            <label for="image" onChange={handleFileUpload}>
              <div className="avatar-img-icon">
                <EditIcon />
              </div>
              <input
                type="file"
                name="image"
                id="image"
                style={{ display: "none" }}
              />
              {imageShow && <img src={imageShow} />}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(null, {
  editUserProfile,
  getUserProfile,
})(AvatarSetting);
