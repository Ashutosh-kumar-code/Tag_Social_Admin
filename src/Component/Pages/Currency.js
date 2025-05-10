import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Table from "../extra/Table";
import Pagination from "../extra/Pagination";
import { ReactComponent as TrashIcon } from "../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/EditBtn.svg";
import $ from "jquery";
import { OPEN_DIALOGUE } from "../store/dialogue/dialogue.type";
import {  warning } from "../../util/Alert";
import NewTitle from "../extra/Title";
import Button from "../extra/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  getCurrency,
  deleteCurrency,
  isDefaultCurrency,
} from "../store/currency/currency.action";
import dayjs from "dayjs";
import CreateCurrency from "../dialogue/CreateCurrency";
import ToggleSwitch from "../extra/ToggleSwitch";

const Currency = (props) => {
  const { currency } = useSelector((state) => state.currency);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getCurrency());
  }, [dispatch]);

  useEffect(() => {
    setData(currency);
  }, [currency]);

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
            props.deleteCurrency(id);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const contactUsTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },

    {
      Header: "NAME",
      body: "name",
      Cell: ({ row }) => <span className="text-capitalize">{row?.name}</span>,
    },

    {
      Header: "SYMBOL",
      body: "symbol",
      Cell: ({ row }) => <span className="text-capitalize">{row?.symbol}</span>,
    },
    {
      Header: "CURRENCY CODE",
      body: "currencyCode",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.currencyCode}</span>
      ),
    },
    {
      Header: "COUNTRY CODE",
      body: "countryCode",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.countryCode}</span>
      ),
    },
    {
      Header: "IS DEFAULT",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isDefault}
          disabled={row?.isDefault === true ? true : false}
          onChange={() => handleIsActive(row)}
        />
      ),
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
            onClick={() => handleEdit(row, "currency")}
          />
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteContactUs(row)}
          />
        </div>
      ),
    },
  ];

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

  const handleIsActive = (row) => {


    props.isDefaultCurrency(row?._id);
  };

  return (
    <div className="userPage withdrawal-page">
      {dialogueType === "currency" && <CreateCurrency />}
      <div className="dashboardHeader primeHeader mb-3 p-0">
        <NewTitle dayAnalyticsShow={false} titleShow={true} name={`Currency`} />
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
              Currency Table
            </h5>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn d-flex justify-content-end">
            <Button
              btnIcon={<AddIcon />}
              newClass={"rounded"}
              btnName={"New"}
              onClick={() => handleOpenNew("currency")}
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
              userTotal={currency?.length}
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
};

export default connect(null, { deleteCurrency, isDefaultCurrency })(Currency);
