import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import { acceptOrDeclineRequest } from "../../store/monetization/monetization.action";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Input from "../../extra/Input";
import { declineRequest } from "../../store/withdraw/withdraw.action";
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

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));
const InfoDialog = () => {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [contactUsDialogue, setContectUsDialogue] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setContectUsDialogue(dialogue);
  }, [dialogue]);

  const handleCloseAddCategory = () => {
    setContectUsDialogue(false);
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

  return (
    <div>
      <Modal
        open={contactUsDialogue}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Info Dialogue
          </Typography>
          <form>
            <Input
              label={"Payment Gateway"}
              name={"Payment Gateway"}
              value={dialogueData?.paymentGateway}
            />

            {dialogueData?.paymentDetails?.map((item) => {
              return (
                <div className="col-12 mt-1 text-about">
                  <Input
                    type={"text"}
                    label={item?.split(":")[0]}
                    name={"Payment Details"}
                    value={item?.split(":")[1]}
                    newClass={`mt-3`}
                    readOnly
                  />
                </div>
              );
            })}
            <div className="mt-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseAddCategory}
                  btnName={"Close"}
                  newClass={"close-model-btn"}
                />
              </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default InfoDialog;
