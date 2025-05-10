import { useState } from "react";

const Input = (props) => {
  const {
    label,
    name,
    id,
    type,
    onChange,
    newClass,
    value,
    defaultValue,
    errorMessage,
    placeholder,
    disabled,
    onFocus,
    readOnly,
    onKeyPress,
    checked,
    onClick,
    ref,
    required,
    autoComplete,
    style,
    accept,
    fieldClass,
    labelShow
  } = props;

  const [types, setTypes] = useState(type);

  const hideShow = () => {
    types === "password" ? setTypes("text") : setTypes("password");
  };

  return (
    <>
      <div
        className={`custom-input ${type} ${newClass} ${
          type === "gender" && "me-2 mb-0"
        }`}
      >
        {
          labelShow == false ? " " : 
        <label htmlFor={id}>{label}</label>
        }
        <input
          type={types}
          className={`form-input ${fieldClass}`}
          // id={id}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          name={name}
          onWheel={(e) => type === "number" && e.target.blur()}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          errorMessage={errorMessage}
          onKeyPress={onKeyPress}
          checked={checked}
          onClick={onClick}
          required={required}
          onFocus={onFocus}
          style={style}
          ref={ref}
          accept={accept}
          autoComplete={false}
        />

        {type !== "search" && (
          errorMessage &&(
            <p className="errorMessage">{errorMessage && errorMessage}</p>
          )
        )}

        {type === "password" && (
          <div className="passHideShow" onClick={hideShow}>
            {types === "password" ? (
              <i className="fa-solid fa-eye"></i>
            ) : (
              <i className="fa-solid fa-eye-slash"></i>
            )}
          </div>
        )}
        {type === "search" && !value && (
          <div className="searching">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        )}
      </div>
    </>
  );
};

export default Input;
