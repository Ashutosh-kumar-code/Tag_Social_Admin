import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getAdminEarnings, getCoinPlanEarnings } from "../../store/admin/admin.action";
import { covertURl } from "../../../util/AwsFunction";
import dayjs from "dayjs";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import { useNavigate } from "react-router-dom";

const CoinPlanEarnings = (props) => {
    const { earning, total, totalEarning } = useSelector((state) => state.admin);
    const { defaultCurrency } = useSelector((state) => state.currency);


    const { startDate, endDate } = props;


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [showURLs, setShowURLs] = useState([]);

    useEffect(() => {
        dispatch(getCoinPlanEarnings(startDate, endDate, page, size));
        dispatch(getDefaultCurrency());
    }, [dispatch, startDate, endDate, page, size]);

    useEffect(() => {
        setData(earning);
    }, [earning]);

    useEffect(() => {
        fetchData();
    }, [data]);

    const fetchData = async () => {
        if (!data || data.length === 0) {
            return;
        }

        const urls = await Promise.all(
            data.map(async (item) => {
                const fileNameWithExtension = item?.image?.split("/").pop();
                const { imageURL } = await covertURl(
                    "userImage/" + fileNameWithExtension
                );

                return imageURL;
            })
        );
        setShowURLs(urls);
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };

    const handleOpen = (row) => {
        navigate("/admin/coinplanhistory", { state: { data: row } })
    }

    const earningTable = [
        {
            Header: "NO",
            body: "no",
            Cell: ({ index }) => (
                <span className="  text-nowrap">
                    {(page - 1) * size + parseInt(index) + 1}
                </span>
            ),
        },
        {
            Header: "USER NAME",
            body: "fullName",
            Cell: ({ row, index }) => (
                <div
                    className="d-flex align-items-center "
                    style={{ cursor: "pointer" }}
                >
                    <img src={showURLs[index]} width="40px" height="40px" />
                    <span className="text-capitalize   cursorPointer text-nowrap">
                        {row?.fullName}
                    </span>
                </div>
            ),
        },

        {
            Header: "TOTAL PLAN PURCHASED",
            body: "totalPlansPurchased",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.totalPlansPurchased}</span>
            ),
        },

        {
            Header: "TOTAL AMOUNT",
            body: "totalAmountSpent",
            Cell: ({ row }) => (
                <span className="text-capitalize">{row?.totalAmountSpent}</span>
            ),
        },
        {
            Header: "CREATED AT",
            body: "createdAt",
            Cell: ({ row }) => (
                <span className="text-capitalize">
                    {dayjs(row.createdAt).format("MM/DD/YYYY")}
                </span>
            ),
        },

        {
            Header: "HISTORY",
            body: "history",
            Cell: ({ row }) => (
                <button
                    onClick={() => handleOpen(row)}
                    style={{ border : "none" , outline : "none" }}
                >
                <svg fill="#000000" width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.998 2.5A9.503 9.503 0 003.378 8H5.75a.75.75 0 010 1.5H2a1 1 0 01-1-1V4.75a.75.75 0 011.5 0v1.697A10.997 10.997 0 0111.998 1C18.074 1 23 5.925 23 12s-4.926 11-11.002 11C6.014 23 1.146 18.223 1 12.275a.75.75 0 011.5-.037 9.5 9.5 0 009.498 9.262c5.248 0 9.502-4.253 9.502-9.5s-4.254-9.5-9.502-9.5z" /><path d="M12.5 7.25a.75.75 0 00-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 00.744-1.302L12.5 12.315V7.25z"
                  

                /></svg>
                </button>
            ),
        },

    ];
    return (
        <div className="userPage withdrawal-page pt-0"
        style={{
            marginTop : 
            "50px"
        }}
        >
            <div className="payment-setting-box user-table mt-0">
                <div className="row align-items-center mb-2 p-3 ml-1">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                        <h5
                            style={{
                                fontWeight: "500",
                                fontSize: "20px",
                                marginBottom: "0px",
                                marginTop: "px",
                                padding: "3px",
                            }}
                        >
                            Coin Plan Earning Table
                        </h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn d-flex justify-content-end">
                        <h4
                            style={{
                                fontWeight: "500",
                                fontSize: "20px",
                                marginBottom: "0px",
                                marginTop: "5px",
                                padding: "3px",
                            }}
                        >
                            Total Admin Earning :{" "}
                            {totalEarning + " " + defaultCurrency?.symbol}
                        </h4>
                    </div>
                </div>
                <div className="mt-3">
                    <Table
                        data={data}
                        mapData={earningTable}
                        serverPerPage={size}
                        serverPage={page}
                        type={"server"}
                    />
                    <div className="mt-3">
                        <Pagination
                            type={"server"}
                            activePage={page}
                            actionShow={false}
                            rowsPerPage={size}
                            userTotal={total}
                            setPage={setPage}
                            handleRowsPerPage={handleRowsPerPage}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinPlanEarnings;
