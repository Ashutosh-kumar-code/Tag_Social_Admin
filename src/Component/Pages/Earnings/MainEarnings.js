import React, { useState } from "react";
import NewTitle from "../../extra/Title";
import AdminEarnings from "./AdminEarnings";
import CoinPlanEarnings from "./CoinPlanEarnings";
import dayjs from "dayjs";

const MainEarnings = () => {
    const [multiButtonSelect, setMultiButtonSelect] = useState("Setting");
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
        <div className="userPage">
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
                        name={`Admin Earning`}
                        labelData={[
                            "Coin Plan",
                            "Premium Plan",
                        ]}
                    />
                </div>

                {multiButtonSelect == "Premium Plan" && (
                    <AdminEarnings
                        endDate={endDateData}
                        startDate={startDateData}
                        multiButtonSelectNavigate={setMultiButtonSelect} />
                )}
                {multiButtonSelect == "Coin Plan" && (
                    <CoinPlanEarnings
                        endDate={endDateData}
                        startDate={startDateData}
                        multiButtonSelectNavigate={setMultiButtonSelect} />
                )}
            </div>
        </div>
    );
};

export default MainEarnings;