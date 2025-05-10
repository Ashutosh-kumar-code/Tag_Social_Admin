import React, { useEffect, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import Searching from "../../extra/Searching";
import { connect, useDispatch, useSelector } from "react-redux";
import { getVideoApi, deleteVideo } from "../../store/video/video.action";
import {  warning } from "../../../util/Alert";
import { covertURl } from "../../../util/AwsFunction";
import UserImage from "../../../assets/images/8.jpg";
import $ from "jquery";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import { useNavigate } from "react-router-dom";

function ManageVideo(props) {
  const { startDate, endDate, multiButtonSelectData } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkBox, setCheckBox] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [verificationRequests, setVerificationRequests] = useState();
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const [data, setData] = useState([]);
  const [showURLs, setShowURLs] = useState([]);
  const [showVideoURLs, setShowVideoURLs] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState({});


  const toggleReview = (index) => {
    setExpandedTitle((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const { videoData, totalVideo } = useSelector((state) => state.video);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", UserImage);
    });
  });

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };
  const handleSelectCheckData = (e, row) => {

    const checked = e.target.checked;

    if (checked) {
      setSelectCheckData((prevSelectedRows) => [...prevSelectedRows, row]);
    } else {
      setSelectCheckData((prevSelectedRows) =>
        prevSelectedRows.filter((selectedRow) => selectedRow._id !== row._id)
      );
    }
  };
  const handleSelectAll = (event) => {

    const checked = event.target.checked;
    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };

  const paginationSubmitButton = () => {

    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    if (actionPagination === "delete") {
      const data = warning();
      data
        .then((res) => {
          if (res) {
            if (res) {
              props.deleteVideo(selectCheckDataGetId);
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDeleteVideo = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed
          if(yes){

            const id = row?._id;
            props.deleteVideo(id);
          }
        }
      })
      .catch((err) => console.log(err));
  };



  useEffect(() => {
    if (data) {
      fetchData();
      fetchVideoData();
    }
  }, [data]);

  const fetchData = async () => {
    if (!data || data.length === 0) {
      // Handle case when data is undefined or empty
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
    setShowURLs(urls);
  };

  const fetchVideoData = async () => {
    if (!data || data?.length === 0) {
      // Handle case when data is undefined or empty
      return;
    }

    const urls = await Promise.all(
      data &&
        data?.map(async (item) => {
          const fileNameWithExtension = item?.videoUrl?.split("/").pop();
          const { imageURL } = await covertURl(
            "Videos/" + fileNameWithExtension
          );

          return imageURL;
        })
    );
    setShowVideoURLs(urls);
  };

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
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

  const videoMapData = [
    {
      Header: "checkBox",
      width: "20px",
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectCheckData.some(
            (selectedRow) => selectedRow?._id === row?._id
          )}
          onChange={(e) => handleSelectCheckData(e, row)}
        />
      ),
    },
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }) => (
        <span className="  text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "USER ID",
      body: "uniqueId",
      Cell: ({ row }) => <span className="cursorPointer">{row?.uniqueId}</span>,
    },
    {
      Header: "VIDEO ID",
      body: "uniqueVideoId",
      Cell: ({ row }) => (
        <span className="cursorPointer">{row?.uniqueVideoId}</span>
      ),
    },
    {
      Header: "TITLE",
      Cell: ({ row, index }) => {
        const isExpanded = expandedTitle[index];
        const titleText = row?.title;
        const previewText = titleText?.substring(0, 30);

        return (
          <span className="text-capitalize fw-bold">
            {isExpanded ? titleText : previewText}
            {titleText.length > 30 && (
              <span
                onClick={() => toggleReview(index)}
                className="read-more text-danger bg-none ps-2"
              >
                {isExpanded ? "Read less" : "Read more..."}
              </span>
            )}
          </span>
        );
      },
    },
    {
      Header: "VIDEO",
      body: "video",
      Cell: ({ row, index }) => (
        <div>
          <video
            controls
            width="150px"
            height="100px"
            style={{ borderRadius: "10px" }}
            src={showVideoURLs[index]}
          />
        </div>
      ),
    },

    {
      Header: "USER",
      body: "addedBy",
      Cell: ({ row, index }) => (
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate("/admin/userProfile", { state: { id: row?.userId } })
          }
        >
          <img src={showURLs[index]} width="40px" height="40px" />
          <span className="text-capitalize   cursorPointer text-nowrap">
            {row?.fullName}
          </span>
        </div>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<EditIcon />}
            onClick={() => handleEdit(row, "editVideo")}
          />
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteVideo(row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    console.log("videoData",videoData)
    setData(videoData);
  }, [videoData]);

  useEffect(() => {
    dispatch(getVideoApi(1, page, size, startDate, endDate));
  }, [dispatch, startDate, endDate, page, size]);

  return (
    <div>
      <div className="user-table mb-3">
        <div className="user-table-top">
          <div className="row align-items-start">
            <h5
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "4px",
                marginTop: "5px",
              }}
            >
              Manage & Edit Videos
            </h5>
            <Searching
              label={" Search for ID, Keyword, Title, Username"}
              placeholder={"Search..."}
              data={videoData}
              type={"client"}
              setData={setData}
              onFilterData={handleFilterData}
              searchValue={search}
              customSelectDataShow={true}
              customSelectData={["Delete"]}
              actionPagination={actionPagination}
              setActionPagination={setActionPagination}
              paginationSubmitButton={paginationSubmitButton}
            />
          </div>
        </div>
        <Table
          data={data}
          mapData={videoMapData}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <div className="mt-3">
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            userTotal={totalVideo}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getVideoApi,
  deleteVideo,
})(ManageVideo);
