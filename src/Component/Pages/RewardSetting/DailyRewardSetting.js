import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDailyReward,
  getDailyReward,
} from "../../store/setting/setting.action";
import Button from "../../extra/Button";
import Table from "../../extra/Table";
import { ReactComponent as EditIcon } from "../../../assets/icons/EditBtn.svg";
import { ReactComponent as TrashIcon } from "../../../assets/icons/trashIcon.svg";
import AddIcon from "@mui/icons-material/Add";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import AddReward from "../../dialogue/AddReward";
import AddDailyReward from "../../dialogue/AddDailyReward";
import { warning } from "../../../util/Alert";


const DailyRewardSetting = () => {
  const { dailyReward } = useSelector((state) => state.setting);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getDailyReward());
  }, []);

  useEffect(() => {
    setData(dailyReward);
  }, [dailyReward]);

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
            dispatch(deleteDailyReward(id));
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
      Header: "DAILY REWARD COIN",
      body: "dailyRewardCoin",
      Cell: ({ row }) => (
        <span className="text-capitalize">{row?.dailyRewardCoin}</span>
      ),
    },

    {
      Header: "DAY",
      body: "day",
      Cell: ({ row }) => <span className="text-capitalize">{row?.day}</span>,
    },

    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={<EditIcon />}
            onClick={() => handleEdit(row, "dailyReward")}
          />

          <Button
            btnIcon={<TrashIcon />}
            onClick={() => handleDeleteVideo(row)}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="  userPage withdrawal-page p-0">
      {dialogueType == "dailyReward" && <AddDailyReward />}
      <div className="payment-setting-box user-table mt-3">
        <div className="row align-items-center mb-2 p-3 ml-1">
          <div className="col-12 col-sm-6 col-md-6 col-lg-6">
            <h5 className="mb-0">Daily CheckIn Reward</h5>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 new-fake-btn d-flex justify-content-end mt-3 m-sm-0">
            <Button
              btnIcon={<AddIcon />}
              newClass={"rounded"}
              btnName={"New"}
              onClick={() => handleOpenNew("dailyReward")}
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

export default DailyRewardSetting;
