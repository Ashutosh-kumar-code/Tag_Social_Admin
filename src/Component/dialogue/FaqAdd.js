import { Box, Modal, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Selector from "../extra/Selector";
import Input from "../extra/Input";
import Button from "../extra/Button";
import {
  addFaqApi,
  editFaqApi,
} from "../store/faq/faq.action";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_DIALOGUE } from "../store/dialogue/dialogue.type";
import { covertURl, uploadFile } from "../../util/AwsFunction";
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import TagFacesIcon from '@mui/icons-material/TagFaces';

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

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


function FaqAdd(props) {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const [addFaq, setAddFaq] = useState(false);
  const [question,setQuestion]=useState()
  const [answer,setAnswer]=useState()
  const [error, setError] = useState({
    question:"",
    answer:""
  });

  const dispatch = useDispatch();
  useEffect(() => {
    setAddFaq(dialogue);
    if (dialogueData) {
       setQuestion(dialogueData?.question)
       setAnswer(dialogueData?.answer)
    }
  }, [dialogue,dialogueData]);

  const handleClose = () => {
    setAddFaq(false);
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
    if (!question || !answer) {
      let error = {};
      if (!question) error.channelName = "Question Is Required !";
      if (!answer) error.answer = "Answer Is Required !";
      return setError({ ...error });
    } else {
      const faqDataAdd = {
        "question":question,
        "answer":answer
      };

      if (dialogueData) {
        props.editFaqApi(dialogueData?._id, faqDataAdd);
      } else {
        props.addFaqApi(faqDataAdd);
      }
      handleClose();
    }
  }
  return (
    <div>
      <Modal
        open={addFaq}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Update FAQ" : "Create FAQ"}
          </Typography>
          <form>
            <Input
              label={"Question"}
              name={"question"}
              placeholder={"Enter Details..."}
              value={question}
              errorMessage={error.question && error.question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    question: `Question Is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    question: "",
                  });
                }
              }}
            />
                 <div className="text-about">
                      <label
                        className="label-form"
                        style={{ fontWeight: "500", marginBottom: "5px" }}
                      >
                        Answer
                      </label>
                      <textarea
                        cols={1}
                        rows={4}
                        value={answer}
                        label={"Answer"}
                        name={"answer"}
                        placeholder={"Enter Details..."}
                        onChange={(e) => {
                          setAnswer(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              answer: `Answer Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              answer: "",
                            });
                          }
                        }}
                      ></textarea>
                      {error.answer && (
                        <p className="errorMessage">
                          {error.answer && error.answer}
                        </p>
                      )}
                    </div>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                onClick={handleClose}
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
  addFaqApi,
  editFaqApi,
})(FaqAdd);
