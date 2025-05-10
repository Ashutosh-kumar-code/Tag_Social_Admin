import { Box, Modal, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Selector from "../extra/Selector";
import Input from "../extra/Input";
import Button from "../extra/Button";
import {
  addAdsReward,
  addDailyReward,
  addPaymentGateway,
  editPaymentGateway,
  updateDailyReward,
  updateReward,
} from "../store/setting/setting.action";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_DIALOGUE } from "../store/dialogue/dialogue.type";
import { covertURl, uploadFile } from "../../util/AwsFunction";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import TagFacesIcon from "@mui/icons-material/TagFaces";


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
const AddDailyReward = () => {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [addCategory, setAddCategory] = useState(false);
  const [dailyRewardCoin, setDailyRewardCoin] = useState();
  const [day, setDay] = useState();

  const [error, setError] = useState({
    dailyRewardCoin: "",
    day: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    setAddCategory(dialogue);
    if (dialogueData) {
      setDailyRewardCoin(dialogueData?.dailyRewardCoin);
      setDay(dialogueData?.day);
    }
  }, [dialogue, dialogueData]);

  const handleCloseAddCategory = () => {
    setAddCategory(false);
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

  const handleSubmit = () => {

    if (!dailyRewardCoin || !day) {
      let error = {};
      if (!dailyRewardCoin)
        error.dailyRewardCoin = "Daily Reward Coin Is Required !";

      if (!day) error.day = "Day is required !";

      return setError({ ...error });
    } else {
      const addWithdrawItem = {
        dailyRewardCoin: dailyRewardCoin,
        day: day,
      };
      if (dialogueData) {
        let payload = {
          dailyRewardCoinId: dialogueData?._id,
          dailyRewardCoin: dailyRewardCoin,
          day: day,
        };
        dispatch(updateDailyReward(payload, dialogueData?._id));
      } else {
        dispatch(addDailyReward(addWithdrawItem));
      }
      handleCloseAddCategory();
    }
  };
  return (
    <div>
      <Modal
        open={addCategory}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData
              ? "Update Daily Reward Dialogue"
              : "Create Daily Reward Dialogue"}
          </Typography>
          <form className="mt-2">

            <Selector
              label={"Day"}
              name={"day"}
              placeholder={"Select Day..."}
              selectValue={day}
              type={"number"}
              selectData={["1", "2", "3", "4", "5", "6", "7"]}
              errorMessage={error.day && error.day}
              disabled={dialogueData ? true : false}
              onChange={(e) => {
                setDay(parseInt(e.target.value));
                if (!e.target.value) {
                  return setError({
                    ...error,
                    day: `Day Is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    day: "",
                  });
                }
              }}
            />


            <div className="mt-3">
              <Input
                label={"Daily Reward Coin"}
                name={"dailyRewardCoin"}
                placeholder={"Enter Daily Reward Coin..."}
                value={dailyRewardCoin}
                type={"number"}
                errorMessage={error.dailyRewardCoin && error.dailyRewardCoin}
                onChange={(e) => {
                  setDailyRewardCoin(parseInt(e.target.value));
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      dailyRewardCoin: `Daily Reward Coin Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      dailyRewardCoin: "",
                    });
                  }
                }}
              />
            </div>

            <div className="mt-3 d-flex justify-content-end">
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
                  width: "80px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddDailyReward;
