import { Box, Modal, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Input from "../extra/Input";
import Button from "../extra/Button";
import {
  createContactUs,
  updateContactUs,
} from "../store/contactUs/contactUs.action";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_DIALOGUE } from "../store/dialogue/dialogue.type";
import { covertURl, uploadFile } from "../../util/AwsFunction";
import { styled } from '@mui/material/styles';


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


function CreateContactUs(props) {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [contactUsDialogue, setContactUsDialogue] = useState(false);
  const [name, setName] = useState();
  const [imgApi, setImgApi] = useState();
  const [image, setImage] = useState();
  const [link, setLink] = useState()
  const [error, setError] = useState({
    name: "",
    image,
    link: ""
  });

  const dispatch = useDispatch();
  useEffect(() => {
    setContactUsDialogue(dialogue);
    setName(dialogueData?.name)
    setLink(dialogueData?.link)
  }, [dialogue, dialogueData]);

  const handleCloseAddCategory = () => {
    setContactUsDialogue(false);
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
        "userImage/" + fileNameWithExtensionThumbnail
      );
      setImage(image);
    };

    if (dialogueData) {
      fetchData();
      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [dialogueData]);

  const isValidURL = (url) => {
    const urlRegex = /^(ftp|http|https):\/[^ "]+$/;
    return urlRegex.test(url);
  };


  const handleSubmit = () => {
    let linkContactValid = true;
    if (link) {
      linkContactValid = isValidURL(link);
    }
    if (!name || !link || (dialogueData ? "" : !image) || !linkContactValid) {
      let error = {};
      if (!name) error.name = "Name Is Required !";

      if (!image) error.image = "Image Is Required !";
      if (!link) {
        error.link = "Link Is Required !";
      } else if (!linkContactValid) {
        error.link = "Link Invalid!"
      }
      return setError({ ...error });
    } else {
      const addContactUs = {
        name: name?.trim(),
        image: imgApi?.trim(),
        link: link
      };
      if (dialogueData) {
        props.updateContactUs(addContactUs, dialogueData?._id);
      } else {
        props.createContactUs(addContactUs);
      }
      handleCloseAddCategory();
    }
  }
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
            {dialogueData ? "Update ContactUs Dialogue" : "Create ContactUs Dialogue"}
          </Typography>
          <form>
            <Input
              label={"Name"}
              name={"name"}
              placeholder={"Enter Name"}
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
            <div className="mt-2 add-links">
              <Input
                label={"Link"}
                name={"link"}
                placeholder={"Enter Link"}
                errorMessage={error.link && error.link}
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      link: `Link Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      link: "",
                    });
                  }
                }}
              />
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
              {image && <img src={image} style={{ width: "96px", height: "auto" }} />}
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
  createContactUs,
  updateContactUs,
})(CreateContactUs);
