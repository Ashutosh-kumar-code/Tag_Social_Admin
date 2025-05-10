import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReward,
  editSetting,
  getAdsReward,
  getSettingApi,
} from "../../store/setting/setting.action";
import Button from "../../extra/Button";
import Table from "../../extra/Table";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import AddIcon from "@mui/icons-material/Add";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import AddReward from "../../dialogue/AddReward";
import { warning } from "../../../util/Alert";
import Input from "../../extra/Input";


const AdsCoinRewardSetting = () => {
  const { rewardData, settingData } = useSelector((state) => state.setting);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const [maxAdPerDay, setMaxAdPerDay] = useState();

  const [error, setError] = useState({
    maxAdPerDay: "",
  });

  useEffect(() => {
    dispatch(getAdsReward());
    dispatch(getSettingApi());
  }, []);

  useEffect(() => {
    setMaxAdPerDay(settingData?.maxAdPerDay);
  }, [settingData]);

  useEffect(() => {
    setData(rewardData);
  }, [rewardData]);

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

  const handleDeleteVideo = (row) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          const yes = res.isConfirmed;
          if (yes) {
            const id = row?._id;
            dispatch(deleteReward(id));
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const withdrawTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },
    {
      Header: "LABEL",
      body: "adLabel",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.adLabel}</span>
      ),
    },
    {
      Header: "COIN EARNED FROM AD",
      body: "coinEarnedFromAd",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.coinEarnedFromAd}</span>
      ),
    },

    {
      Header: "AD INTERVAL (SECOND)",
      body: "adDisplayInterval",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.adDisplayInterval}</span>
      ),
    },

    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<EditIcon />}
            onClick={() => handleEdit(row, "reward")}
          />

          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteVideo(row)}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = () => {

    const maxAdPerDayValue = parseInt(maxAdPerDay);

    if (maxAdPerDay === "" || maxAdPerDayValue <= 0) {
      let error = {};

      if (maxAdPerDay === "") error.maxAdPerDay = "Amount Is Required !";

      if (maxAdPerDayValue <= 0) error.maxAdPerDay = "Amount Invalid !";

      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        maxAdPerDay: parseInt(maxAdPerDay),
      };
      dispatch(editSetting(settingData?._id, settingDataSubmit));
    }
  };

  return (
    <div className="  userPage withdrawal-page p-0">
      {dialogueType == "reward" && <AddReward />}
      <div className="row">
        <div className="col-6">
          <div className="withdrawal-box payment-setting ">
            <div className="row align-items-center p-2">
              <div className="col-12 col-sm-7">
              <h5 className="mb-0">Ads Coin Reward</h5>
              </div>
              <div className="col-12 col-sm-5 sm-m-0 d-flex justify-content-end p-0">
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
                  label={"Maximum Ads Per Day"}
                  name={"maxAdPerDay"}
                  type={"number"}
                  value={maxAdPerDay}
                  errorMessage={error.maxAdPerDay && error.maxAdPerDay}
                  placeholder={"Enter Amount"}
                  onChange={(e) => {
                    setMaxAdPerDay(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        maxAdPerDay: `Maximum Ads Per Day Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        maxAdPerDay: "",
                      });
                    }
                  }}
                />
                {/* <h6>
                  User can not post withdraw request less than this amount
                </h6> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="payment-setting-box user-table mt-3">
        <div className="row align-items-center mb-2 p-3 ml-1">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
            
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 new-fake-btn d-flex justify-content-end mt-3 m-sm-0">
            <Button
              btnIcon={<AddIcon />}
              newClass={"rounded"}
              btnName={"New"}
              onClick={() => handleOpenNew("reward")}
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
          />
        </div>
      </div>
    </div>
  );
};

export default AdsCoinRewardSetting;
