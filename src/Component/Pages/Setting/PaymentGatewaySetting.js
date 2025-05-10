import React, { useEffect, useState } from "react";
import Input from "../../extra/Input";
import NewTitle from "../../extra/Title";
import {
  getSettingApi,
  getWithdrawalApi,
  isActivePaymentGetWay,
  editSetting,
  deleteWithdrawalApi,
} from "../../store/setting/setting.action";
import Button from "../../extra/Button";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import AddIcon from "@mui/icons-material/Add";
import { connect, useDispatch, useSelector } from "react-redux";
import Pagination from "../../extra/Pagination";
import noImageFound from "../../../assets/images/noimage.png";
import $ from "jquery";
import Table from "../../extra/Table";
import { covertURl } from "../../../util/AwsFunction";
import dayjs from "dayjs";
import WithdrawItemAdd from "../../dialogue/WithdrawItemAdd";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import ToggleSwitch from "../../extra/ToggleSwitch";
import {  warning } from "../../../util/Alert";

function PaymentGatewaySetting(props) {
  const { withdrawData, settingData } = useSelector((state) => state.setting);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [showImg, setShowImg] = useState();
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [minWithdrawalRequestedAmount, setMinWithdrawalRequestedAmount] =
    useState();

  const [error, setError] = useState({
    minWithdrawalRequestedAmount: "",
  });

  useEffect(() => {
    dispatch(getWithdrawalApi());
    dispatch(getSettingApi());
  }, [dispatch]);

  useEffect(() => {
    setMinWithdrawalRequestedAmount(settingData?.minWithdrawalRequestedAmount);
  }, [settingData]);

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImageFound);
    });
  });

  useEffect(() => {
    setData(withdrawData);
  }, [withdrawData]);

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

  const withdrawTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },
    {
      Header: "NAME",
      body: "name",
      Cell: ({ row }) => <span className="text-capitalize">{row?.name}</span>,
    },
    {
      Header: "IMAGE",
      body: "image",
      Cell: ({ row, index }) =>
        showImg ? (
          <img
            src={showImg[index]}
            width="96px"
            height="auto"
            style={{ objectFit: "cover" }}
          />
        ) : (
          ""
        ),
    },
    {
      Header: "DETAILS",
      body: "details",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          <ul>
            {row?.details?.map((detail, index) => (
              <li>{detail}</li>
            ))}
          </ul>
        </span>
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
          value={row?.isEnabled}
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
            onClick={() => handleEdit(row, "withdrawItem")}
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
    fetchData();
  }, [data]);

  const fetchData = async () => {
    if (!data || data.length === 0) {
      // Handle case when data is undefined or empty
      return;
    }

    const urls = await Promise.all(
      data.map(async (item) => {
        const fileNameWithExtension = item?.image?.split("/").pop();
        const { imageURL } = await covertURl(
          "WithdrawImage/" + fileNameWithExtension
        );

        return imageURL;
      })
    );
    setShowImg(urls);
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

  const handleDeleteVideo = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed
          if (yes) {
          const id = row?._id;
          dispatch(deleteWithdrawalApi(id));
        }}
      })
      .catch((err) => console.log(err));
  };

  const paginationSubmitButton = () => {
    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    
  };

  const handleIsActive = (row) => {

    const id = row?._id;
    const data = row?.isEnabled === false ? true : false;
    props.isActivePaymentGetWay(id, data);
  };

  const handleSubmit = () => {

    const minWithdrawalRequestedAmountValue = parseInt(
      minWithdrawalRequestedAmount
    );

    if (
      minWithdrawalRequestedAmount === "" ||
      minWithdrawalRequestedAmountValue <= 0
    ) {
      let error = {};

      if (minWithdrawalRequestedAmount === "")
        error.minWithdrawalRequestedAmount = "Amount Is Required !";

      if (minWithdrawalRequestedAmountValue <= 0)
        error.minWithdrawalRequestedAmount = "Amount Invalid !";

      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        minWithdrawalRequestedAmount: parseInt(minWithdrawalRequestedAmount),
      };
      props.editSetting(settingData?._id, settingDataSubmit);
    }
  };

  return (
    <div className="  userPage withdrawal-page p-0">
      {dialogueType == "withdrawItem" && <WithdrawItemAdd />}
      <div className="dashboardHeader primeHeader mb-3 p-0">
      
      </div>
      <div className="row">
        <div className="col-6">
          <div className="withdrawal-box payment-setting ">
            <div className="row align-items-center p-2">
            <div className="col-12 col-sm-6"
              style={{
                fontSize : "20px",
                paddingLeft : "2px",
                fontWeight : 500
              }}
            >
                Minimum Withdrawal Limit
              </div>
              <div className="col-12 col-sm-6 sm-m-0 d-flex justify-content-end p-0">
                <Button
                  btnName={"Submit"}
                  type={"button"}
                  onClick={handleSubmit}
                  newClass={"submit-btn"}
                  style={{
                    borderRadius: "0.5rem",
                    width: "88px",
                    marginLeft: "10px",
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 withdrawal-input mt-1">
                <Input
                  label={"Minimum Withdrawal Request Amount"}
                  name={"minWithdrawalRequestedAmount"}
                  type={"number"}
                  value={minWithdrawalRequestedAmount}
                  errorMessage={
                    error.minWithdrawalRequestedAmount &&
                    error.minWithdrawalRequestedAmount
                  }
                  placeholder={"Enter Amount"}
                  onChange={(e) => {
                    setMinWithdrawalRequestedAmount(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        minWithdrawalRequestedAmount: `Amount Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        minWithdrawalRequestedAmount: "",
                      });
                    }
                  }}
                />
                <h6>User can not post withdraw request less than this amount</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="payment-setting-box user-table mt-3">
        <div className="row align-items-center mb-2 p-3 ml-1">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
            <h5 className="mb-0">Withdraw Payment Method</h5>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 new-fake-btn d-flex justify-content-end mt-3 m-sm-0">
            <Button
              btnIcon={<AddIcon />}
              newClass={"rounded"}
              btnName={"New"}
              onClick={() => handleOpenNew("withdrawItem")}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={withdrawTable}
            PerPage={size}
            Page={page}
            type={"client"}
            handleSelectAll={handleSelectAll}
            selectAllChecked={selectAllChecked}
          />
          <div className="mt-3">
            <Pagination
              type={"client"}
              activePage={page}
              rowsPerPage={size}
              userTotal={withdrawData?.length}
              setPage={setPage}
              setData={setData}
              data={data}
              actionShow={false}
              actionPagination={actionPagination}
              setActionPagination={setActionPagination}
              paginationSubmitButton={paginationSubmitButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getWithdrawalApi,
  isActivePaymentGetWay,
  editSetting,
})(PaymentGatewaySetting);
