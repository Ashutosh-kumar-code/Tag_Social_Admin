import React, { useEffect, useState } from "react";



export default function Selector(props) {
  const {
    label,
    placeholder,
    selectValue,
    setSelectValue,
    paginationOption,
    id,
    labelShow,
    selectData,
    onChange,
    defaultValue,
    errorMessage,
    selectId,
    disabled
  } = props;

  return (
    <div className="selector-custom">
      {labelShow === false ? (
        " "
      ) : (
        <label htmlFor={id} className="label-selector-custom">
          {label}
        </label>
      )}

      <div sx={{ minWidth: 120 }} class="form-group mt-3">
        <div className="form-outline" fullWidth>
         
          <select
            id="formControlLg"
            className=" form-select py-2 text-capitalize"
            value={selectValue ? selectValue : ""}
            label={label}
            placeholder={placeholder}
            defaultValue={defaultValue ? defaultValue :""}
            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            onChange={onChange}
            style={{borderRadius : "30px"}}
            disabled={disabled}
          >
              {
                paginationOption === false ?""
            : 
            <option value="" disabled>
            {placeholder}
          </option>
              }
            {selectData?.map((item, index) => {
              const displayValue = selectId ? item.fullName || item?.name: typeof item === "string" ? item.toLowerCase() : item;
              return (
                <option
                  value={selectId ? item._id : (typeof item === "string" ? item.toLowerCase() : item)}
                  key={index}
                  className="py-2"
                >
                  {displayValue}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {errorMessage && (
        <p className="errorMessage">{errorMessage && errorMessage}</p>
      )}
    </div>
  );
}
