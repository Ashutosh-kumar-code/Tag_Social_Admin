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
import UserImage from "../../../assets/images/8.jpg";
import {
  getUser,
  isActiveUser,
  deleteUser,
} from "../../store/user/user.action";
import $, { get } from "jquery";
import ToggleSwitch from "../../extra/ToggleSwitch";
import { covertURl } from "../../../util/AwsFunction";

function ManageUser(props) {
  const { startDate, endDate, multiButtonSelectData } = props;
  const dispatch = useDispatch();
  const [age, setAge] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("block");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const { user, totalUser } = useSelector((state) => state.user);

  const [data, setData] = useState();
  const [showURLs, setShowURLs] = useState([]);

  useEffect(() => {
    setData(user);
  }, [user]);
console.log("useruseruser",user)
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", UserImage);
    });
  });
  useEffect(() => {
    fetchData();
  }, [data]);

  const fetchData = async () => {
    if (!data || data?.length === 0) {
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

  const paginationSubmitButton = () => {

    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    const isActiveData = user.filter((user) => {
      return (
        user.isBlock === false &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const deActiveData = user.filter((user) => {
      return (
        user.isBlock === true &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });

    const getId = isActiveData?.map((item) => item?._id);
    const getId_ = deActiveData?.map((item) => item?._id);
    if (actionPagination === "block") {
      const data = true;
      props.isActiveUser(getId, "user", data);
    } else if (actionPagination === "unblock") {
      const data = false;
      props.isActiveUser(getId_, "user", data);
    } else if (actionPagination === "delete") {
      const data = warning();
      data
        .then((res) => {
          if (res) {
            const yes = res.isConfirmed
            if (yes) {
            props.deleteUser(selectCheckDataGetId, "user");
          }}
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
      body: "id",
      Cell: ({ row }) => (
        <span className="text-capitalize    cursorPointer">
          {row?.uniqueId}
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
          onClick={() => handleEdit(row, "manageUser")}
        >
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
        <span className="text-lowercase    cursorPointer">{row?.email}</span>
      ),
    },
    // {
    //   Header: "IP ADDRESS",
    //   body: "callEndReason",
    //   class: " ",
    //   Cell: ({ row }) => <span>{row?.ipAddress}</span>,
    // },
    {
      Header: "STATUS",
      body: "status",
      Cell: ({ row }) => <span>{row?.isBlock ? "Block" : "Unblock"}</span>,
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
    }
  
  ];

  useEffect(() => {
    dispatch(getUser("realUser", page, size, startDate, endDate));
  }, [dispatch, startDate, endDate, page, size]);

  const handleIsActive = (row) => {

    const id = row?._id;
    const data = row?.isBlock === false ? true : false;
    props.isActiveUser(id, "user", data);
  };

  const handleDeleteUser = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed
          if (yes) {
          const id = row?._id;
          props.deleteUser(id, "user");
        }}
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

  return (
    <div>
      <div className="user-table real-user mb-3">
        <div className="user-table-top">
          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "5px",
              marginTop: "5px",
            }}
          >
            User Table
          </h5>
          <Searching
            label={
              "Search for ID, Keyword, E-mail, Username, First Name, LastName"
            }
            placeholder={"Search..."}
            data={user}
            type={"client"}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
            actionPaginationDataCustom={["Block", "Unblock"]}
            actionPagination={actionPagination}
            setActionPagination={setActionPagination}
            paginationSubmitButton={paginationSubmitButton}
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
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={totalUser}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
export default connect(null, {
  getUser,
  isActiveUser,
  deleteUser,
})(ManageUser);
