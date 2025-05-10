import React, { useState } from "react";
import NewTitle from "../../extra/Title";
import MultiButton from "../../extra/MultiButton";
import SoundCategory from "./SoundCategory";
import SoundList from "./SoundList";

export default function SoundPage() {
  const [dayAnalytics, setDayAnalytics] = useState("today");
  const [multiButtonSelect, setMultiButtonSelect] = useState("Sound List");
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");

  return (
    <div className="userPage channelPage">
      <div>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            name={`Sound`}
            titleShow={true}
            multiButtonSelect={multiButtonSelect}
            setMultiButtonSelect={setMultiButtonSelect}
            labelData={["Sound List", "Sound Category"]}
          />
        </div>
       
      </div>
      {multiButtonSelect == "Sound List" && (
        <SoundList startDate={startDate} endDate={endDate} />
      )}
      {multiButtonSelect == "Sound Category" && (
        <SoundCategory startDate={startDate} endDate={endDate} />
      )}
    </div>
  );
}
