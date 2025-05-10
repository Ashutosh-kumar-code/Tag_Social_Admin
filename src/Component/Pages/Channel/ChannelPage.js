import React, { useState } from "react";
import NewTitle from "../../extra/Title";
import MultiButton from "../../extra/MultiButton";
import UserChannel from "./UserChannel";
import FakeChannel from "./FakeChannel";
import dayjs from "dayjs";

export default function ChannelPage() {
  const [dayAnalytics, setDayAnalytics] = useState("today");
  const [multiButtonSelect, setMultiButtonSelect] = useState("User Channel");
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");


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
    <div className="userPage channelPage">
      <div>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            titleShow={true}
            setMultiButtonSelect={setMultiButtonSelect}
            multiButtonSelect={multiButtonSelect}
            name={`Channel`}
            labelData={["User Channel", "Fake User Channel"]}
          />
        </div>
       
      </div>
      {multiButtonSelect == "User Channel" && (
        <UserChannel startDate={startDateData} endDate={endDateData} />
      )}
      {multiButtonSelect == "Fake User Channel" && (
        <FakeChannel startDate={startDateData} endDate={endDateData}/>
      )}
    </div>
  );
}
