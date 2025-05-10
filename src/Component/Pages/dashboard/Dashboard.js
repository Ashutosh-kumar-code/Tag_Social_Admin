import { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import ReactApexChart from "react-apexcharts";
import { ReactComponent as VideoIcon } from "../../../assets/icons/VideoIcon.svg";
import { ReactComponent as UserTotalIcon } from "../../../assets/icons/UserSideBarIcon.svg";
import { ReactComponent as TotalChannelIcon } from "../../../assets/icons/ChannelIcon.svg";
import { ReactComponent as TotalShortsIcon } from "../../../assets/icons/ShortIcon.svg";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { connect, useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../store/admin/admin.action";
import {
  getDashboardCount,
  getDashboardUserChart,
  getChartAnalyticOfActiveUser,
} from "../../store/dashboard/dashboard.action";
import DateRangePicker from "react-bootstrap-daterangepicker";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const {
    dashboardCount,
    chartAnalyticOfVideos,
    chartAnalyticOfShorts,
    chartAnalyticOfUsers,
    chartAnalyticOfActiveUser,
  } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let label = [];
  let data = [];
  let dataVideo = [];
  let dataUser = [];
  let dataShort = [];
  let dataCount = [];

  const startDateFormat = (startDate) => {
    if (startDate === "All") return "All";
    return dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : dayjs().subtract(7, "day").format("YYYY-MM-DD");
  };

  const endDateFormat = (endDate) => {
    if (endDate === "All") return "All";
    return dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
  };
  const startDateData = startDateFormat(startDate);
  const endDateData = endDateFormat(endDate);

  useEffect(() => {
    dispatch(getDashboardCount(startDateData, endDateData));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDashboardUserChart(startDateData, endDateData, "Short"));
  }, [dispatch, startDate, endDate]);
  useEffect(() => {
    dispatch(getDashboardUserChart(startDateData, endDateData, "Video"));
  }, [dispatch, startDate, endDate]);
  useEffect(() => {
    dispatch(getDashboardUserChart(startDateData, endDateData, "User"));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    dispatch(getChartAnalyticOfActiveUser(startDateData, endDateData));
  }, [dispatch, startDate, endDate]);

  // Process users' data
  chartAnalyticOfUsers?.forEach((data_) => {
    const newDate = data_?._id;
    const date = newDate;
    label.push(date);
    dataUser.push(data_?.count || 0); // Use 0 if count is undefined
  });


  chartAnalyticOfVideos?.forEach((data_) => {
    const newDate = data_?._id;
    const date = newDate;
    label.push(date);
    dataVideo.push(data_?.count || 0); // Use 0 if count is undefined
  });

  // Process shorts' data
  chartAnalyticOfShorts?.forEach((data_) => {
    const newDate = data_?._id;
    const date = newDate;
    label.push(date);
    dataShort.push(data_?.count || 0); // Use 0 if count is undefined
  });

  let labelSet = new Set(label);
  // Convert labelSet back to array and sort
  label = [...labelSet].sort((a, b) => new Date(a) - new Date(b));

  // Ensure all arrays have the same length and are aligned properly with labels
  const maxLength = label?.length;
  
  for (let i = 0; i < maxLength; i++) {
    if (dataUser[i] === undefined) {
      dataUser[i] = 0;
    }
    if (dataVideo[i] === undefined) {
      dataVideo[i] = 0;
    }
    if (dataShort[i] === undefined) {
      dataShort[i] = 0;
    }
  }

  const totalSeries = {
    labels: label,
    dataSet: [
      {
        name: "Total User",
        data: dataUser,
      },
      {
        name: "Total Video",
        data: dataVideo,
      },
      {
        name: "Total Short",
        data: dataShort,
      },
    ],
  };

  const optionsTotal = {
    chart: {
      type: "area",
      stacked: false,
      height: "200px",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: label,
      rotate: 0,
      rotateAlways: true,
      minHeight: 50,
      maxHeight: 100,
      labels: {
        offsetX: -4, // Adjust the offset vertically
        fontSize: 10,
      },
    },

    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
    colors: ["#A74AC4", "#786D81", "#441752"],
  };

  const activeUserData = chartAnalyticOfActiveUser?.reduce(function (acc, obj) {
    return acc + obj?.count;
  }, 0);
  const userData = chartAnalyticOfUsers?.reduce(function (acc, obj) {
    return acc + obj?.count;
  }, 0);
  const percentage = (activeUserData / userData) * 100;
  const seriesGradient = [percentage ? percentage?.toFixed(0) : "0"];

  const optionsGradient = {
    chart: {
      height: 350,
      width: 200,
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 365,
        hollow: {
          margin: 0,
          size: "55%",
          background: "#fff",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#EDEDED", // Change the background color here
          strokeWidth: "90%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: 25,
            show: true,
            color: "#A74AC4",
            fontSize: "17px",
            text: "Active User", // Set the label text
          },
          value: {
            offsetY: -25,
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: "#A74AC4",
            fontWeight: 600,
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#A74AC4"],
    },
    labels: ["Block User"],
    stroke: {
      lineCap: "round",
    },
  };

  return (
    <>
      <div className="dashboard " style={{ padding: "15px" }}>
       
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            titleShow={true}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            startDate={startDate}
            endDate={endDate}
            name={`Dashboard`}
          />
        </div>
        <div className="dashBoardMain px-4 pt-2">
          <div className="row dashboard-count-box">
            <div
              className="  adminProfileBox px-2   col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => navigate("/admin/userTable")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <UserTotalIcon />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total User</h5>
                  <h6 className="text-center pt-3  fw-bold">
                    {dashboardCount?.totalUsers
                      ? dashboardCount?.totalUsers
                      : "0"}
                  </h6>
                </div>
              </div>
            </div>
            {/* <div
              className="  adminProfileBox px-2   col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => navigate("/admin/channel")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <TotalChannelIcon />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Channel</h5>
                  <h6 className="text-center pt-3  fw-bold">
                    {dashboardCount?.totalChannels
                      ? dashboardCount?.totalChannels
                      : "0"}
                  </h6>
                </div>
              </div>
            </div> */}
            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12  cursor"
              onClick={() => navigate("/admin/videos")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <VideoIcon />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Video</h5>
                  <h6 className="text-center pt-3  fw-bold">
                    {dashboardCount?.totalVideos
                      ? dashboardCount?.totalVideos
                      : "0"}
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="  adminProfileBox px-2  col-lg-3 col-md-6 col-sm-12 cursor"
              onClick={() => navigate("/admin/shorts")}
            >
              <div className="dashBoxData bg-white">
                <div className="icon icon-sm icon-shape-small  text-center border-radius-xl my-auto icon-data1">
                  <TotalShortsIcon />
                </div>
                <div className="dashBox-text">
                  <h5 className="text-center">Total Shorts</h5>
                  <h6 className="text-center pt-3  fw-bold">
                    {dashboardCount?.totalShorts
                      ? dashboardCount?.totalShorts
                      : "0"}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-analytics">
            <h6 className="heading-dashboard">Data Analytics</h6>
            <div className="row dashboard-chart justify-content-between">
              <div
                className="col-lg-9 col-md-12 col-sm-12 mt-lg-0 mt-4 dashboard-chart-box"
                style={{ position: "relative" }}
              >
                <div
                  id="chart"
                  className="dashboard-user-count"
                  style={{ height: "100%" }}
                >
                  <div className="">
                    <ReactApexChart
                      options={optionsTotal}
                      series={
                        totalSeries.dataSet.length >= 1
                          ? totalSeries.dataSet
                          : ""
                      }
                      type="area"
                      height={"380px"}
                    />
                  </div>

                
                </div>
              </div>
              <div className="col-lg-3 col-md-12  col-sm-12 mt-3 mt-lg-0 dashboard-total-user">
                <div className="user-activity">
                  <h6
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "22px",
                    }}
                  >
                    Total User Activity
                  </h6>
                  <div
                    id="chart"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <ReactApexChart
                      options={optionsGradient}
                      series={seriesGradient}
                      type="radialBar"
                      width={380}
                      height={"300px"}
                    />
                  </div>
                  <div className="total-user-chart">
                    <span></span>
                    <h5>Total User</h5>
                  </div>
                  <div className="total-active-chart">
                    <span></span>
                    <h5>Total Block User</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getProfile,
  getDashboardCount,
  getDashboardUserChart,
  getChartAnalyticOfActiveUser,
})(Dashboard);
