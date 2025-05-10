import React, { useState } from "react";
import NewTitle from "../../extra/Title";
import AppSetting from "./AppSetting";
import PaymentSetting from "./PaymentSetting";
import PaymentGatewaySetting from "./PaymentGatewaySetting";
import MonetizationSetting from "./MonetizationSetting";

const ManageSetting = () => {
  const [multiButtonSelect, setMultiButtonSelect] = useState("Setting");

  return (
    <div className="userPage">
      <div>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={false}
            titleShow={true}
            setMultiButtonSelect={setMultiButtonSelect}
            multiButtonSelect={multiButtonSelect}
            name={`Setting`}
            labelData={[
              "Setting",
              "Payment Setting",
              "Monetize & Ads Setting",
              "Withdraw Setting",
            ]}
          />
        </div>

        {multiButtonSelect == "Setting" && (
          <AppSetting multiButtonSelectNavigate={setMultiButtonSelect} />
        )}
        {multiButtonSelect == "Payment Setting" && <PaymentSetting />}
        <div>
          {multiButtonSelect == "Withdraw Setting" && <PaymentGatewaySetting />}
        </div>
        {multiButtonSelect == "Monetize & Ads Setting" && (
          <MonetizationSetting />
        )}
      </div>
    </div>
  );
};

export default ManageSetting;
