import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import AddIcon from "@mui/icons-material/Add";
import NewTitle from "../../extra/Title"
import { connect, useDispatch, useSelector } from "react-redux";
import { getCoinPlan, isActiveCoinPlan, isPopularCoinPlan } from "../../store/coinPlan/coinPlan.action";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import { useEffect, useState } from "react";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";

import CreatePlan from "../../dialogue/CreatePlan";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg"
import ToggleSwitch from "../../extra/ToggleSwitch"
import dayjs from "dayjs";
const CoinPlanTable = (props) => {
  const [data, setData] = useState();
  const coinPlanData = useSelector((state) => state.coinPlan);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const { defaultCurrency } = useSelector((state) => state.currency);


  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => { 
    dispatch(getCoinPlan());
    dispatch(getDefaultCurrency());
  }, [dispatch, page, size]);

  useEffect(() => {
    setData(coinPlanData?.coinPlanData);
  }, [coinPlanData?.coinPlanData]);

  const planTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },

    // {
    //   Header: "Image",
    //   body: "Image",
    //   Cell: ({ row }) => (
    //     <span className="text-capitalize">
    //       <img src={row?.icon} alt={row?.planBenefit} height={50} width={50} />
    //     </span>
    //   ),
    // },
    {
      Header: `AMOUNT (${defaultCurrency?.symbol})`,
      body: "amount",
      Cell: ({ row }) => {
        return <span className="text-capitalize">{row?.amount || "-"}</span>;
      },
    },
    {
      Header: "COIN",
      body: "coin",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.coin || "-"}</span>
      ),
    },
    {
      Header: "EXTRA COIN",
      body: "extracoin",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.extraCoin || "-"}</span>
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
      Header: "IS ACTIVE",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "IS POPULAR",
      body: "isPopular",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isPopular}
          onChange={() => handleIsPopular(row)}
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
            onClick={() => handleEdit(row, "coinPlanAdd")}
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


  const handleIsActive = (row) => {

    const id = row?._id;
    const data = row?.isActive === false ? true : false;
    props.isActiveCoinPlan(id, data);
  };
  const handleIsPopular = (row) => {

    const id = row?._id;
    const data = row?.isPopular === false ? true : false;
    props.isPopularCoinPlan(id, data);
  };

  useEffect(() => {
    dispatch(getCoinPlan());
    dispatch(getDefaultCurrency());
  }, [dispatch]);

  return (
    <div className="coin-plan  userPage withdrawal-page mb-3">
      {dialogueType == "coinPlanAdd" && <CreatePlan />}
      <div className="dashboardHeader primeHeader mb-3 p-0">
        <NewTitle
          dayAnalyticsShow={false}
          titleShow={true}
          name={`Coin Plan`}
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
                Coin Plan Table
              </h5>
            </div>
            <div className="col-4 new-fake-btn d-flex justify-content-end">
              <Button
                btnIcon={<AddIcon />}
                btnName={"New"}
                newClass={"rounded"}
                onClick={() => handleOpenNew("coinPlanAdd")}
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={coinPlanData?.coinPlanData}
            mapData={planTable}
            PerPage={size}
            Page={page}
            type={"client"}

          />
          <Pagination
            type={"client"}
            activePage={page}
            rowsPerPage={size}
            userTotal={coinPlanData?.coinPlanData?.length}
            setPage={setPage}
            setData={setData}
            data={data}
            actionShow={false}

          />
        </div>
      </div>
    </div>
  )
}
// export default CoinPlanTable;
export default connect(null, {
  isActiveCoinPlan,
  isPopularCoinPlan
})(CoinPlanTable);