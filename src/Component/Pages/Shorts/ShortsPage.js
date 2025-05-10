import React, { useState } from "react";
import NewTitle from "../../extra/Title";
import MultiButton from "../../extra/MultiButton";
import ManageShorts from "./ManageShorts";
import dayjs from "dayjs";
import NewVideoAdd from "../../dialogue/NewVideoAdd";
import { useSelector } from "react-redux";
import ShortComment from "./ShortComment";
import NewShortAdd from "../../dialogue/NewShortAdd";

export default function ShortsPage() {
  const [multiButtonSelect, setMultiButtonSelect] = useState("Manage Shorts");
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const startDateFormat = (startDate) => {
    return startDate && dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : "All";
  };
  const endDateFormat = (endDate) => {
    return endDate && dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : "All";
  };

  const startDateData = startDateFormat(startDate);
  const endDateData = endDateFormat(endDate);

  return (
    <div className="userPage videoPage">
      <div
        style={{
          display: `${dialogueType === "editShort" ? "none" : "block"}`,
        }}
      >
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            name={`Shorts`}
            titleShow={true}
            setMultiButtonSelect={setMultiButtonSelect}
            multiButtonSelect={multiButtonSelect}
            labelData={[
              "Manage Shorts",
              "Manage Short Comments",
              "Import Shorts",
            ]}
          />
        </div>
   
        {multiButtonSelect == "Manage Shorts" && (
          <ManageShorts endDate={endDateData} startDate={startDateData} />
        )}
        {multiButtonSelect == "Manage Short Comments" && (
          <ShortComment endDate={endDateData} startDate={startDateData} />
        )}
        {multiButtonSelect == "Import Shorts" && (
          <NewShortAdd
            setMultiButtonSelect={setMultiButtonSelect}
            multiButtonSelect={multiButtonSelect}
          />
        )}
      </div>
      {dialogueType === "editShort" && <NewShortAdd />}
    </div>
  );
}
