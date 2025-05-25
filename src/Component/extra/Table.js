import React, { useState, useEffect } from "react";

function Table(props) {
  const {
    data,
    checkBoxShow,
    mapData,
    PerPage,
    Page,
    type,
    style,
    onChildValue,
    selectAllChecked,
    handleSelectAll,
  } = props;

  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [checkBox, setCheckBox] = useState();


  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const sortedData =
    data?.length > 0 &&
    data?.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Slice the data if it's defined
  const startIndex = (Page - 1) * PerPage;
  const endIndex = startIndex + PerPage;
  const currentPageData = data && data?.slice(startIndex, endIndex);
  console.log("currentPageData==========",mapData)

  return (
    <>
      <div className="primeMain table-custom">
        <table
          width="100%"
          border
          className="primeTable text-center"
          style={{ maxHeight: "600px" }}
        >
          <thead
            className=""
            style={{ zIndex: "1", position: "sticky", top: "0" }}
          >
            <tr>
              {mapData?.map((res) => {
                return (
                  <th className="fw-bold text-nowrap">
                    <div className="table-head">
                      {res?.Header === "checkBox" ? (
                        <input
                          type="checkbox"
                          checked={selectAllChecked}
                          onChange={handleSelectAll}
                        />
                      ) : (
                        `${" "}${res?.Header}`
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {type == "server" && (
            <>
              <tbody>
                {sortedData.length > 0 ? (
                  <>
{(PerPage > 0
  ? sortedData.slice(startIndex, endIndex)
  : sortedData
).map((i, k) => (
  <tr key={k}>
    {mapData.map((res, idx) => (
      <td key={idx}>
        {res.Cell ? (
          <res.Cell row={i} index={k} />
          
        ) : (
          <span className={res.class}>
            {i[res.body] || "-"}
          </span>
        )}
      </td>
    ))}
  </tr>
))}


                    {/* {(PerPage > 0
                      ? [sortedData].slice(
                          Page * PerPage,
                          Page * PerPage + PerPage
                        )
                      : sortedData
                    ).map((i, k) => {
                      return (
                        <>
                          <tr>
                            {mapData.map((res) => {
                              return (
                                <td>
                                  {res.Cell ? (
                                    <res.Cell row={i} index={k} />
                                  ) : (
                                    <span className={res.class}>
                                      {i[res.body] || "-"}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </>
                      );
                    })} */}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="25"
                      className="text-center"
                      style={{ height: "358px", borderBottom: "none" }}
                    >
                      No Data Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}

          {type == "client" && (
            <>
              <tbody>
                {currentPageData?.length > 0 ? (
                  <>
                    {currentPageData?.map((i, k) => {
                      return (
                        <>
                          <tr>
                            {mapData.map((res) => {
                              return (
                                <td>
                                  {res.Cell ? (
                                    <res.Cell row={i} index={k} />
                                  ) : (
                                    <span className={res.class}>
                                      {i[res.body]}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="16"
                      className="text-center"
                      style={{ height: "358px", borderBottom: "none" }}
                    >
                      No Data Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}
        </table>
      </div>
    </>
  );
}

export default Table;
