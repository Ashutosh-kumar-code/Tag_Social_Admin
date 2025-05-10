import React, { useEffect, useState } from "react";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import NewTitle from "../../extra/Title";
import {
  getVideoReport,
  deleteVideoReport,
} from "../../store/report/report.action";
import { FormControlLabel, Switch } from "@mui/material";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import styled from "@emotion/styled";
import noImageFound from "../../../assets/images/noimage.png";
import Button from "../../extra/Button";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import AddIcon from "@mui/icons-material/Add";
import { connect, useDispatch, useSelector } from "react-redux";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import { covertURl } from "../../../util/AwsFunction";
import dayjs from "dayjs";
import $ from "jquery";
import UserImage from "../../../assets/images/noimage.png";
import WithdrawItemAdd from "../../dialogue/WithdrawItemAdd";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import ToggleSwitch from "../../extra/ToggleSwitch";
import {  warning } from "../../../util/Alert";
import Searching from "../../extra/Searching";

function VideoReport(props) {
  const { videoReport, totalVideoReport } = useSelector(
    (state) => state.report
  );
  const { startDate, endDate, multiButtonSelectData } = props;


  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [showImg, setShowImg] = useState();
  const [search, setSearch] = useState();
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const startDateFormat = (startDate) => {
    return startDate && dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : "All";
  };
  const endDateFormat = (endDate) => {
    return endDate && dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : "All";
  };

  const startDateData = startDateFormat(startDate);
  const endDateData = endDateFormat(endDate);

  useEffect(() => {
    dispatch(getVideoReport(page, size, startDateData, endDateData, 1));
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(videoReport);
  }, [videoReport]);

  const videoReportTable = [
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
      Header: "CHANNEL NAME",
      body: "fullName",
      Cell: ({ row }) => (
        <span className="text-capitalize text-nowrap">{row?.fullName}</span>
      ),
    },
    {
      Header: "VIDEO ID",
      body: "uniqueVideoId",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.uniqueVideoId}</span>
      ),
    },
    {
      Header: "VIDEO IMAGE",
      body: "image",
      Cell: ({ row, index }) =>
        showImg ? (
          <img
            src={showImg[index]}
            width="48px"
            height="48px"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              e.target.src = UserImage;
            }}
          />
        ) : (
          ""
        ),
    },
   
    {
      Header: "VIDEO TITLE",
      body: "videoTitle",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.videoTitle}</span>
      ),
    },
    {
      Header: "VIDEO REPORT TYPE",
      body: "reportType",
      Cell: ({ row }) => (
        <>
          {row?.reportType === 1 && (
            <span className="text-capitalize">Sexual</span>
          )}
          {row?.reportType === 2 && (
            <span className="text-capitalize">Violent or Replusive</span>
          )}
          {row?.reportType === 3 && (
            <span className="text-capitalize">Hateful or Abusive</span>
          )}
          {row?.reportType === 4 && (
            <span className="text-capitalize">Harmful or Dangerous</span>
          )}
          {row?.reportType === 5 && (
            <span className="text-capitalize">Spam or Misleading</span>
          )}
          {row?.reportType === 6 && (
            <span className="text-capitalize">Child abuse</span>
          )}
          {row?.reportType === 7 && (
            <span className="text-capitalize">Others</span>
          )}
        </>
      ),
    },
    {
      Header: "VIDEO REPORTED",
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
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteUser(row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    if (!data || data.length === 0) {
      // Handle case when data is undefined or empty
      return;
    }

    const urls = await Promise.all(
      data?.map(async (item) => {
        const fileNameWithExtension = item?.videoImage?.split("/").pop();
        const { imageURL } = await covertURl(
          "videoImage/" + fileNameWithExtension
        );

        return imageURL;
      })
    );
    setShowImg(urls);
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
          const yes = res.isConfirmed
          if (yes) {
          if (res) {
            props.deleteVideoReport(selectCheckDataGetId);
          }}
        })
        .catch((err) => console.log(err));
    }
  };
  const handleDeleteUser = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed
          if (yes) {
          const id = row?._id;
          props.deleteVideoReport(id, "user");
        }}
      })
      .catch((err) => console.log(err));
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  return (
    <div className="userPage mb-3">
      <div className="payment-setting-box user-table ">
       
        <div style={{ padding: "12px" }}>
          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "5px",
              marginTop: "5px",
              padding: "3px",
            }}
          >
            Video Report Table
          </h5>
          <Searching
            placeholder={"Search..."}
            data={videoReport}
            label={"Search for ID, Keyword, Username,Name,Title,Reported "}
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
        <div className="mt-3">
          <Table
            data={data}
            mapData={videoReportTable}
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
              userTotal={totalVideoReport}
              setPage={setPage}
              handleRowsPerPage={handleRowsPerPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getVideoReport,
  deleteVideoReport,
})(VideoReport);
