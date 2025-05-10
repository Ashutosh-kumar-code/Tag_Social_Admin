import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import { ReactComponent as TrashIcon } from "../../assets/icons/trashIcon.svg";
import Button from "../extra/Button";
import { ReactComponent as EditIcon } from "../../assets/icons/EditBtn.svg";
import AddIcon from "@mui/icons-material/Add";
import { connect, useDispatch, useSelector } from "react-redux";
import Pagination from "../extra/Pagination";
import {
  getContactUsData,
  deleteContactUs,
} from "../store/contactUs/contactUs.action";
import noImageFound from "../../assets/images/noimage.png";
import $ from "jquery";
import Table from "../extra/Table";
import { covertURl } from "../../util/AwsFunction";
import dayjs from "dayjs";
import CreateContactUs from "../dialogue/CreateContactUs";
import { OPEN_DIALOGUE } from "../store/dialogue/dialogue.type";
import {  warning } from "../../util/Alert";

function ContactUsPage(props) {
  const { contactUsData } = useSelector((state) => state.contactUs);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [showImg, setShowImg] = useState();

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImageFound);
    });
  });

  useEffect(() => {
    setData(contactUsData);
  }, [contactUsData]);

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

  const handleDeleteContactUs = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed;
          if (yes) {
            const id = row?._id;
            props.deleteContactUs(id);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const contactUsTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },
    {
      Header: "IMAGE",
      body: "image",
      Cell: ({ row, index }) =>
        showImg ? (
          <img
            src={showImg[index]}
            width="96px"
            height="50px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          ""
        ),
    },
    {
      Header: "NAME",
      body: "name",
      Cell: ({ row }) => <span className="text-capitalize">{row?.name}</span>,
    },
    {
      Header: "LINK",
      body: "link",
      Cell: ({ row }) => <span>{row?.link}</span>,
    },
    {
      Header: "CREATE DATE",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<EditIcon />}
            onClick={() => handleEdit(row, "contactUs")}
          />
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteContactUs(row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getContactUsData());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    if (!data || data.length === 0) {
      return;
    }

    const urls = await Promise.all(
      data?.map(async (item) => {
        const fileNameWithExtension = item?.image?.split("/").pop();
        const { imageURL } = await covertURl(
          "userImage/" + fileNameWithExtension
        );

        return imageURL;
      })
    );
    setShowImg(urls);
  };
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

  return (
    <div className="  userPage withdrawal-page">
      {dialogueType == "contactUs" && <CreateContactUs />}
      <div className="dashboardHeader primeHeader mb-3 p-0">
        <NewTitle
          dayAnalyticsShow={false}
          titleShow={true}
          name={`Contact Us`}
        />
      </div>
      <div className="payment-setting-box user-table">
        <div className="row align-items-center mb-2 p-3 ml-1">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
            <h5
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "0px",
                marginTop: "5px",
                padding: "3px",
              }}
            >
              Contact Us Table
            </h5>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn d-flex justify-content-end">
            <Button
              btnIcon={<AddIcon />}
              newClass={"rounded"}
              btnName={"New"}
              onClick={() => handleOpenNew("contactUs")}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={contactUsTable}
            PerPage={size}
            Page={page}
            type={"client"}
          />
          <div className="mt-3">
            <Pagination
              type={"client"}
              activePage={page}
              rowsPerPage={size}
              userTotal={contactUsData?.length}
              setPage={setPage}
              setData={setData}
              data={data}
              actionShow={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getContactUsData,
  deleteContactUs,
})(ContactUsPage);
