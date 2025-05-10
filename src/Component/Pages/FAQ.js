import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import { getFaqApi, deleteFaq } from "../store/faq/faq.action";
import { connect, useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import { ReactComponent as TrashIcon } from "../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/EditBtn.svg";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "../extra/Button";
import {  warning } from "../../util/Alert";
import AddIcon from "@mui/icons-material/Add";
import { OPEN_DIALOGUE } from "../store/dialogue/dialogue.type";
import FaqAdd from "../dialogue/FaqAdd";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));
const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: "17px",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function FAQ(props) {
  const { faqData } = useSelector((state) => state.faq);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [expanded, setExpanded] = useState();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setData(faqData);
    if (faqData?.length > 0 && expanded === undefined) {
      setExpanded(faqData[0]?._id);
    }
  }, [faqData]);

  useEffect(() => {
    dispatch(getFaqApi());
  }, [dispatch]);

  const handleOpenNew = (type) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: type,
      },
    });

    let dialogueData_ = {
      dialogue: true,
      type: type,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  const handleEdit = (row, type) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: type,
        data: row,
      },
    });

    let dialogueData_ = {
      dialogue: true,
      type: type,
      dialogueData: row,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  const handleDelete = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed
          if (yes) {
          const id = row?._id;
          props.deleteFaq(id);
        }

      }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="userPage faq-page">
      {dialogueType === "openFaq" && <FaqAdd />}
      <div>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle dayAnalyticsShow={false} titleShow={true} name={`FAQ`} />
        </div>
        <div className="payment-setting-box">
          <div
            className=" new-fake-btn d-flex justify-content-end mb-1 pb-2"
            style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.10)" }}
          >
            <Button
              btnIcon={<AddIcon />}
              newClass={"rounded"}
              btnName={"New"}
              onClick={() => handleOpenNew("openFaq")}
            />
          </div>
          <div style={{ overflowX: "scroll", display: "block", width: "100%" }}>
            {data ? (
              data?.map((item) => {
                return (
                  <>
                    <Accordion
                      expanded={expanded === item?._id}
                      onChange={handleChange(item?._id)}
                    >
                      <AccordionSummary
                        aria-controls="panel1d-content"
                        id="panel1d-header"
                      >
                        <Typography sx={{ textTransform: "capitalize" }}>
                          {item?.question}
                        </Typography>
                        <div className="action-button">
                          <Button
                            btnIcon={<EditIcon />}
                            onClick={() => handleEdit(item, "openFaq")}
                          />
                          <Button
                            btnIcon={<TrashIcon />}
                            onClick={() => handleDelete(item)}
                          />
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          sx={{
                            textTransform: "capitalize",
                            fontSize: "14px",
                            marginLeft: "20px",
                            backgroundColor: "#F8F8F8"
                          }}
                        >
                          {item?.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </>
                );
              })
            ) : (
              <div className="not-data-found">No Data Found !</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getFaqApi,
  deleteFaq,
})(FAQ);
