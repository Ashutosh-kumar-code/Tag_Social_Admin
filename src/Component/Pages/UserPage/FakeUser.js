import React, { useEffect, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import { connect, useDispatch, useSelector } from "react-redux";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Searching from "../../extra/Searching";
import {  warning } from "../../../util/Alert";
import AddIcon from "@mui/icons-material/Add";
import UserImage from "../../../assets/images/8.jpg";
import {
  getFakeUser,
  isActiveUser,
  deleteUser,
} from "../../store/user/user.action";
import { covertURl } from "../../../util/AwsFunction";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import $, { get } from "jquery";
import ToggleSwitch from "../../extra/ToggleSwitch";
import CreateChannel from "../../dialogue/CreateChannel";
import { Skeleton } from "@mui/material";

function FakeUser(props) {
  const { startDate, endDate } = props;
  const dispatch = useDispatch();
  const [age, setAge] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("block");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const { fakeUser, totalUsersAddByAdmin } = useSelector((state) => state.user);

  const [data, setData] = useState();
  const [showURLs, setShowURLs] = useState([]);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  useEffect(() => {
    setData(fakeUser);
  }, [fakeUser]);

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", UserImage);
    });
  });

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
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
  const handleCreateChannel = (row, type) => {

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
  const paginationSubmitButton = () => {

    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    const isActiveData = fakeUser.filter((user) => {
      return (
        user.isBlock === false &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const deActiveData = fakeUser.filter((user) => {
      return (
        user.isBlock === true &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });

    const getId = isActiveData?.map((item) => item?._id);
    const getId_ = deActiveData?.map((item) => item?._id);

    if (actionPagination === "block") {
      const data = true;
      props.isActiveUser(getId, "fakeUser", data);
    } else if (actionPagination === "unblock") {
      const data = false;
      props.isActiveUser(getId_, "fakeUser", data);
    } else if (actionPagination === "delete") {
      const data = warning();
      data
        .then((res) => {
          if (res) {
            const yes = res.isConfirmed;
            if (yes) {
              props.deleteUser(selectCheckDataGetId, "fakeUser");
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const ManageUserData = [
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
      Header: "ID",
      body: "uniqueId",
      Cell: ({ row }) => (
        <span className="text-capitalize    cursorPointer">
          {row?.uniqueId}
        </span>
      ),
    },
    {
  Header: "USERNAME",
  body: "fullName", // This maps to the field from the backend
  Cell: ({ row }) => (
    <div
      className="d-flex align-items-center gap-2"
      style={{ cursor: "pointer" }}
      onClick={() => handleEdit(row, "manageUser")}
    >
      <img
        src={row?.image || UserImage}
        alt="user"
        width="40"
        height="40"
        style={{ borderRadius: "50%", objectFit: "cover" }}
        onError={(e) => (e.target.src = UserImage)}
      />
      <span className="text-capitalize cursorPointer text-nowrap">
        {row?.fullName}
      </span>
    </div>
  ),
},

    // {
    //   Header: "USERNAME",
    //   body: "userName",
    //   Cell: ({ row, index }) => (
    //     <div
    //       className="d-flex align-items-center"
    //       style={{ cursor: "pointer" }}
    //       onClick={() => handleEdit(row, "manageUser")}
    //     >
    //       <img src={showURLs[index]} width="40px" height="40px" />
    //       <span className="text-capitalize   cursorPointer text-nowrap">
    //         {row?.fullName}
    //       </span>
    //     </div>
    //   ),
    // },
    {
      Header: "EMAIL",
      body: "email",
      Cell: ({ row }) => (
        <span className="text-lowercase    cursorPointer">{row?.email}</span>
      ),
    },
    {
      Header: "IP ADDRESS",
      body: "callEndReason",
      class: " ",
      Cell: ({ row }) => <span>{row?.ipAddress}</span>,
    },
    {
      Header: "STATUS",
      body: "status",
      Cell: ({ row }) => <span>{row?.isBlock ? "Block" : "UnBlock"}</span>,
    },
    {
      Header: "IS BLOCK",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isBlock}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "CREATE CHANNEL",
      body: "status",
      Cell: ({ row }) => (
        <span className="text-uppercase">
          <div className="action-button create-channel-icon">
            {row?.isChannel === true ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                width={24}
                viewBox="0 0 512 512"
              >
                <path
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                  fill="#0FB515"
                />
              </svg>
            ) : (
              <Button
                btnIcon={
                  <AddCircleOutlineIcon
                    style={{ color: "rgb(133 133 133)", fontSize: "24px" }}
                  />
                }
                onClick={() => handleCreateChannel(row, "createChannel")}
              />
            )}
          </div>
        </span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<EditIcon width="25px" height="25px" />}
            onClick={() => handleEdit(row, "manageUser")}
          />
          <Button
            btnIcon={<TrashIcon width="25px" height="25px" />}
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
      return;
    }

    const urls = await Promise.all(
      data.map(async (item) => {
        const fileNameWithExtension = item.image.split("/").pop();
        const { imageURL } = await covertURl(
          "userImage/" + fileNameWithExtension
        );

        return imageURL;
      })
    );
    setShowURLs(urls);
  };
  useEffect(() => {
    dispatch(getFakeUser(page, size, startDate, endDate, "addByAdmin"));
  }, [dispatch, startDate, endDate, size, page]);

  const handleIsActive = (row) => {

    const id = row?._id;
    const type = "fakeUser";
    const data = row?.isBlock === false ? true : false;
    props.isActiveUser(id, type, data);
  };

  const handleDeleteUser = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed;
          if (yes) {
            const id = row?._id;
            props.deleteUser(id, "fakeUser");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
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
    <div>
      {dialogueType == "createChannel" && <CreateChannel />}
      <div className="user-table fake-user mb-3">
        <div className="user-table-top" style={{ paddingRight: "14px" }}>
          <div className="row">
            <div className="col-6">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                Fake User Table
              </h5>
            </div>
            <div className="col-6">
              <div className="new-fake-btn d-flex justify-content-end">
                <Button
                  btnIcon={<AddIcon />}
                  btnName={"New"}
                  newClass={"rounded"}
                  onClick={() => handleOpenNew("fakeUserAdd")}
                />
              </div>
            </div>
          </div>
          <Searching
            label={
              " Search for ID, Keyword, E-mail, Username, First Name, LastName"
            }
            placeholder={"Search..."}
            data={fakeUser}
            type={"client"}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
            actionPagination={actionPagination}
            setActionPagination={setActionPagination}
            paginationSubmitButton={paginationSubmitButton}
            actionShow={false}
          />
        </div>
        <Table
          data={data}
          mapData={ManageUserData}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <div>
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            userTotal={totalUsersAddByAdmin}
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
  getFakeUser,
  isActiveUser,
  deleteUser,
})(FakeUser);
