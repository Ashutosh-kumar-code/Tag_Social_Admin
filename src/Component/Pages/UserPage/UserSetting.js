import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import MultiButton from "../../extra/MultiButton";
import UserProfileSetting from "./UserProfileSetting";
import PasswordSetting from "./PasswordSetting";
import AvatarSetting from "./AvatarSetting";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import { getUserProfile } from "../../store/user/user.action";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import { useLocation, useNavigate } from "react-router-dom";

function UserSetting() {
  const [multiButtonSelect, setMultiButtonSelect] = useState("Profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const location = useLocation();
  const { userProfile, countryData } = useSelector((state) => state.user);

  const handleClose = () => {
    if (dialogueData) {
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
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (dialogueData) {
      dispatch(getUserProfile(dialogueData?._id));
    } else {
      dispatch(getUserProfile(location?.state?.id));
    }
  }, [dispatch, location?.state?.id]);
  return (
    <div className="userSetting">
      <div className="dashboardHeader primeHeader mb-3 p-0"></div>
      <div className="row">
        <div className="col-7">
          <div className="multi-user-btn mb-3 pb-2">
            <NewTitle
              dayAnalyticsShow={false}
              titleShow={true}
              setMultiButtonSelect={setMultiButtonSelect}
              multiButtonSelect={multiButtonSelect}
              name={`User Profile`}
              labelData={["Profile", "Password", "Avatar"]}
            />
          </div>
        </div>
        <div className="col-5 d-flex align-items-center">
          <Button
            btnName={"Back"}
            newClass={"back-btn"}
            onClick={handleClose}
          />
        </div>
      </div>

      {multiButtonSelect == "Profile" && (
        <UserProfileSetting multiButtonSelectNavigate={multiButtonSelect} />
      )}
      {multiButtonSelect == "Password" && (
        <PasswordSetting multiButtonSelectNavigate={multiButtonSelect} />
      )}
      {multiButtonSelect == "Avatar" && (
        <AvatarSetting multiButtonSelectNavigate={multiButtonSelect} />
      )}
    </div>
  );
}
export default connect(null, {
  getUserProfile,
})(UserSetting);
