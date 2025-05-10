import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import { ReactComponent as TrueIcon } from "../../../assets/icons/TrueArrow.svg";
import { ReactComponent as Decline } from "../../../assets/icons/Decline.svg";
import {
  acceptOrDeclineRequest,
  getMonetizationRequest,
} from "../../store/monetization/monetization.action";

import { covertURl } from "../../../util/AwsFunction";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Reason from "./Reason";
import AcceptedRequestDialog from "./AcceptRequestDialog";

const PendingRequest = (props) => {
  const { monetization, total } = useSelector((state) => state.monetization);

  const { dialogueType } = useSelector((state) => state.dialogue);

  const dispatch = useDispatch();

  const { startDate, endDate } = props;

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [showURLs, setShowURLs] = useState([]);

  useEffect(() => {
    dispatch(getMonetizationRequest(1, page, size, startDate, endDate));
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(monetization);
  }, [monetization]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const ManageUserData = [
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
      Header: "USERNAME",
      body: "userName",
      Cell: ({ row, index }) => (
        <div
          className="d-flex align-items-center "
          style={{ cursor: "pointer" }}
        >
          <img src={showURLs[index]} width="40px" height="40px" />
          <span className="text-capitalize   cursorPointer text-nowrap">
            {row?.userId?.fullName}
          </span>
        </div>
      ),
    },
    {
      Header: "CHANNEL NAME",
      body: "channelName",
      Cell: ({ row }) => <span>{row?.channelName}</span>,
    },
    
    {
      Header: "TOTAL WATCH TIME (MINUTES)",
      body: "totalWatchTime",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">
          {row?.totalWatchTime}
        </span>
      ),
    },
    {
      Header: "TOTAL WATCH TIME (HOURS)",
      body: "totalWatchTimeInHours",
      Cell: ({ row }) => (
        <span className="text-lowercase cursorPointer">
          {row?.totalWatchTimeInHours}
        </span>
      ),
    },


    {
      Header: "CREATEDAT",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.requestDate}</span>,
    },

    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<TrueIcon width="25px" height="25px" />}
            onClick={() => handleAccept(row)}
          />
          <Button
            btnIcon={<Decline width="25px" height="25px" />}
            onClick={() => handleDecline(row, "manageUser")}
          />
        </div>
      ),
    },
  ];

  const handleAccept = (row) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: "accept",
        data: row,
      },
    });
  };

  const handleDecline = (row) => {

    dispatch({
      type: OPEN_DIALOGUE,
      payload: {
        type: "monetization",
        data: row,
      },
    });
    let dialogueData_ = {
      dialogue: true,
      type: "monetization",
      dialogueData: row,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    if (!data || data.length === 0) {
      return;
    }

    const urls = await Promise.all(
      data.map(async (item) => {
        const fileNameWithExtension = item?.userId?.image.split("/").pop();
        const { imageURL } = await covertURl(
          "userImage/" + fileNameWithExtension
        );

        return imageURL;
      })
    );
    setShowURLs(urls);
  };

  return (
    <div>
      <div className="user-table real-user mb-3">
        {dialogueType == "monetization" && <Reason />}
        {dialogueType == "accept" && <AcceptedRequestDialog />}

        <div className="user-table-top">
          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "5px",
              marginTop: "5px",
            }}
          >
            Monetization Request Table
          </h5>
        </div>
        <Table
          data={data}
          mapData={ManageUserData}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={total}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default PendingRequest;
