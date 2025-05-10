import { Box, Modal, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Selector from "../extra/Selector";
import Input from "../extra/Input";
import Button from "../extra/Button";
import {
  addPaymentGateway,
  editPaymentGateway,
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

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function WithdrawItemAdd(props) {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [addCategory, setAddCategory] = useState(false);
  const [name, setName] = useState();
  const [imgApi, setImgApi] = useState();
  const [image, setImage] = useState();
  const [detail, setDetail] = useState("");
  const [addChip, setAddChip] = useState([]);
  const [error, setError] = useState({
    name: "",
    image,
    detail: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    setAddCategory(dialogue);
    if (dialogueData) {
      setName(dialogueData?.name);

      setDetail(dialogueData?.details);
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

  let folderStructure = "WithdrawImage";
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
      const fileNameWithExtensionThumbnail = dialogueData?.image
        ?.split("/")
        .pop();
      const { imageURL: image } = await covertURl(
        "WithdrawImage/" + fileNameWithExtensionThumbnail
      );
      setImage(image);
    };

    if (dialogueData) {
      fetchData();
      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [dialogueData]);

  const handleSubmit = () => {
    if (!name || (dialogueData ? "" : !image) || !detail) {
      let error = {};
      if (!name) error.name = "Name Is Required !";
      if (!image) error.image = "Image Is Required !";
      if (!detail) error.detail = "Detail Is Required !";
      return setError({ ...error });
    } else {
      const addWithdrawItem = {
        name: name?.trim(),
        image: imgApi?.trim(),
        details: detail,
      };
      if (dialogueData) {
        props.editPaymentGateway(dialogueData?._id, addWithdrawItem);
      } else {
        props.addPaymentGateway(addWithdrawItem);
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
              ? "Update Payment Gateway Dialogue"
              : "Create Payment Gateway Dialogue"}
          </Typography>
          <form>
            <Input
              label={"Name"}
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
            <div className="mt-2 add-details">
              <Input
                label={"Detail"}
                name={"detail"}
                placeholder={"Enter Details..."}
                value={detail}
                onChange={(e) => {
                  setDetail(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      detail: `Details Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      detail: "",
                    });
                  }
                }}
              />
            </div>
            <div>
              {error?.detail && <p className="errorMessage">{error?.detail}</p>}
            </div>
            <div className="mt-2 ">
              <Input
                type={"file"}
                label={"Image"}
                accept={"image/png, image/jpeg"}
                errorMessage={error.image && error.image}
                onChange={handleFileUpload}
              />
            </div>
            <div className=" mt-2 fake-create-img mb-2">
              {image && (
                <img src={image} style={{ width: "96px", height: "auto" }} />
              )}
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
}
export default connect(null, {
  addPaymentGateway,
  editPaymentGateway,
})(WithdrawItemAdd);
