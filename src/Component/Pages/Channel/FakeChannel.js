import React, { useEffect, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import { connect, useDispatch, useSelector } from "react-redux";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Selector from "../../extra/Selector";
import { ReactComponent as VideoIcon } from "../../../assets/icons/VideoTableIcon.svg";
import Input from "../../extra/Input";
import Searching from "../../extra/Searching";
import UserImage from "../../../assets/images/8.jpg";
import {
  getUserChannels,
  createChannelFakeUser,
  getFakeUserName,
  deleteChanel,
} from "../../store/user/user.action";
import $ from "jquery";
import { covertURl } from "../../../util/AwsFunction";
import { warning } from "../../../util/Alert";

function FakeChannel(props) {
  const dispatch = useDispatch();
  const { startDate, endDate } = props;
  const [search, setSearch] = useState();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { getFakeUserData, totalFakeUserData } = useSelector(
    (state) => state.user
  );
  const [showURLs, setShowURLs] = useState([]);

  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    if (!data || data.length === 0) {
      return;
    }

    const urls = await Promise.all(
      data.map(async (item) => {
        const fileNameWithExtension = item.image?.split("/")?.pop();
        const { imageURL } = await covertURl(
          "userImage/" + fileNameWithExtension
        );

        return imageURL;
      })
    );
    setShowURLs(urls);
  };

  useEffect(() => {
    dispatch(getUserChannels(page, size, startDate, endDate, "addByadmin"));
  }, [dispatch, startDate, endDate, page, size]);

  useEffect(() => {
    setData(getFakeUserData);
  }, [getFakeUserData]);

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", UserImage);
    });
  });

  const handleDeleteChanel = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed;
          if (yes) {
            const id = row?.channelId;
            dispatch(deleteChanel(id));
          }
        }
      })
      .catch((err) => console.log(err));
  };


  const channelFakeUser = [
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
      Cell: ({ row, index }) => (
        <div className="d-flex align-items-center">
          <img src={showURLs[index]} width="40px" height="40px" />
          <span className="text-capitalize   cursorPointer text-nowrap">
            {row?.fullName}
          </span>
        </div>
      ),
    },
    {
      Header: "EMAIL",
      body: "email",
      Cell: ({ row }) => (
        <span className="    cursorPointer">{row?.email}</span>
      ),
    },
    {
      Header: "CHANNEL ID",
      body: "channelId",
      Cell: ({ row }) => (
        <span className="text-capitalize  text-nowrap">{row?.channelId}</span>
      ),
    },

    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
      
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteChanel(row)}
          />
        </div>
      ),
    },
  ];

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
              Fake Channel Table
            </h5>
            <Searching
              actionShow={false}
              placeholder={"Enter Details..."}
              data={getFakeUserData}
              label={"Search for ID, Keyword, Channel Name, Email"}
              type={"client"}
              setData={setData}
              onFilterData={handleFilterData}
              searchValue={search}
            />
          </div>
        </div>
        <Table
          data={data}
          mapData={channelFakeUser}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          actionShow={false}
          userTotal={totalFakeUserData}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
export default connect(null, {
  getUserChannels,
  createChannelFakeUser,
  getFakeUserName,
})(FakeChannel);
