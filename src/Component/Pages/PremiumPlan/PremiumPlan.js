import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import {
  getPremiumPlan,
  isActivePremiumPlan,
  deletePlan,
} from "../../store/premiumPlan/premiumPlan.action";
import Button from "../../extra/Button";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import AddIcon from "@mui/icons-material/Add";
import { connect, useDispatch, useSelector } from "react-redux";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import dayjs from "dayjs";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import ToggleSwitch from "../../extra/ToggleSwitch";
import {  warning } from "../../../util/Alert";
import CreatePremiumPlan from "../../dialogue/CreatePremiumPlan";
import Searching from "../../extra/Searching";
import { getDefaultCurrency } from "../../store/currency/currency.action";

function PremiumPlan(props) {
  const { premiumPlanData } = useSelector((state) => state.premiumPlan);
  const { defaultCurrency } = useSelector((state) => state.currency);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState();
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    dispatch(getPremiumPlan());
    dispatch(getDefaultCurrency());
  }, [dispatch]);

  useEffect(() => {
    setData(premiumPlanData);
  }, [premiumPlanData]);

  const planTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },
   
    {
      Header: "PLAN BENEFIT",
      body: "planBenefit",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          <ul>
            {row?.planBenefit?.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </span>
      ),
    },
    {
      Header: "AMOUNT",
      body: "amount",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.amount + " " + defaultCurrency?.symbol}
        </span>
      ),
    },
    {
      Header: "VALIDITY",
      body: "validity",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.validity}</span>
      ),
    },
    {
      Header: "PRODUCT KEY",
      body: "productKey",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.productKey}</span>
      ),
    },
    {
      Header: "VALIDITY TYPE",
      body: "validityType",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.validityType}</span>
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
      Header: "IS ENABLED",
      body: "isEnabled",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<EditIcon />}
            onClick={() => handleEdit(row, "premiumPlanAdd")}
          />
          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeletePlan(row)}
          />
        </div>
      ),
    },
  ];

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

  const handleDeletePlan = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed
          if (yes) {
          const id = row?._id;
          props.deletePlan(id);
        }}
      })
      .catch((err) => console.log(err));
  };

  const handleIsActive = (row) => {

    const id = row?._id;
    const data = row?.isActive === false ? true : false;
    props.isActivePremiumPlan(id, data);
  };

  

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  return (
    <div className="premium-plan  userPage withdrawal-page mb-3">
      {dialogueType == "premiumPlanAdd" && <CreatePremiumPlan />}
      <div className="dashboardHeader primeHeader mb-3 p-0">
        <NewTitle
          dayAnalyticsShow={false}
          titleShow={true}
          name={`Premium Plan`}
        />
      </div>
      <div className="payment-setting-box user-table">
        <div className="p-3">
          <div className="row">
            <div className="col-8">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "0px",
                  marginTop: "5px",
                  padding: "3px",
                }}
              >
                Premium Plan Table
              </h5>
            </div>
            <div className="col-4 new-fake-btn d-flex justify-content-end">
              <Button
                btnIcon={<AddIcon />}
                btnName={"New"}
                newClass={"rounded"}
                onClick={() => handleOpenNew("premiumPlanAdd")}
              />
            </div>
          </div>
          <Searching
            label={
              "Search for Keyword, Plan Benefit, Amount Validity, Validity Type"
            }
            placeholder={"Search..."}
            data={premiumPlanData}
            type={"client"}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
            actionShow={false}
          />
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={planTable}
            PerPage={size}
            Page={page}
            type={"client"}
         
          />
          <Pagination
            type={"client"}
            activePage={page}
            rowsPerPage={size}
            userTotal={premiumPlanData?.length}
            setPage={setPage}
            setData={setData}
            data={data}
            actionShow={false}
           
          />
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getPremiumPlan,
  isActivePremiumPlan,
  deletePlan,
})(PremiumPlan);
