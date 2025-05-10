import React, { useEffect, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import Searching from "../../extra/Searching";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getCommentsApi,
  deleteVideoComments,
} from "../../store/video/video.action";
import {  warning } from "../../../util/Alert";
import { covertURl } from "../../../util/AwsFunction";
import UserImage from "../../../assets/images/8.jpg";
import $ from "jquery";
import dayjs from "dayjs";

function VideoComments(props) {
  const { startDate, endDate, multiButtonSelectData } = props;
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const [data, setData] = useState([]);

  const [showURLs, setShowURLs] = useState([]);
  const { commentData, totalVideoComment } = useSelector(
    (state) => state.video
  );
  const [expandedTitle, setExpandedTitle] = useState({});

  const toggleReview = (index) => {
    setExpandedTitle((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };


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
            const yes = res.isConfirmed
            if (yes) {
              props.deleteVideoComments(selectCheckDataGetId);
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
          if (yes) {
          const id = row?._id;
          props.deleteVideoComments(id);
        }}
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    if (!data || data.length === 0) {
      // Handle case when data is undefined or empty
      return;
    }

    const urls = await Promise.all(
      data.map(async (item) => {
        const fileNameWithExtension = item?.userImage?.split("/").pop();
        const { imageURL } = await covertURl(
          "userImage/" + fileNameWithExtension
        );

        return imageURL;
      })
    );
    setShowURLs(urls);
  };

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const commentMapData = [
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
      Header: "VIDEO ID",
      body: "uniqueId",
      Cell: ({ row }) => (
        <span className="cursorPointer">{row?.uniqueVideoId}</span>
      ),
    },
    {
      Header: "TITLE",
      body: "title",
      Cell: ({ row , index }) => {
        const isExpanded = expandedTitle[index];
        const titleText = row?.videoTitle;
        const previewText = titleText?.substring(0, 30);
        
        return (
          <span className="text-capitalize fw-bold">
            {isExpanded ? titleText : previewText}
            {titleText.length > 20 && (
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
      Header: "TEXT",
      body: "commentText",
      Cell: ({ row , index }) => {
        const isExpanded = expandedTitle[index];
        const titleText = row?.commentText;
        const previewText = titleText?.substring(0, 30);
        return (
          <span className="text-capitalize fw-bold">
            {isExpanded ? titleText : previewText}
            {titleText.length > 20 && (
              <span
                onClick={() => toggleReview(index)}
                className="read-more text-danger bg-none ps-2"
              >
                {isExpanded ? "Read less" : "Read more..."}
              </span>
            )}
          </span>
        );
      }
    },
    {
      Header: "CREATED AT",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="cursorPointer text-nowrap text-capitalize">
          {dayjs(row?.createdAt).format("MMMM-DD-YYYY")}
        </span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteVideo(row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    setData(commentData);
  }, [commentData]);

  useEffect(() => {
    dispatch(getCommentsApi(page, size, startDate, endDate, 1));
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
              placeholder={"Search..."}
              data={commentData}
              type={"client"}
              label={"Search for ID, Keyword, Text, Title"}
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
          mapData={commentMapData}
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
            userTotal={totalVideoComment}
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
  getCommentsApi,
  deleteVideoComments,
})(VideoComments);
