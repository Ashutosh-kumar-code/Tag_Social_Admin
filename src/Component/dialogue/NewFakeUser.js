import React, { useEffect, useState } from "react";
import Button from "../extra/Button";
import Input from "../extra/Input";
import Selector from "../extra/Selector";

import {
  getCountry,
  createFakeUser,
  getIpAddress,
} from "../store/user/user.action";
import { connect, useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../util/AwsFunction";
import { CLOSE_DIALOGUE } from "../store/dialogue/dialogue.type";


function NewFakeUser(props) {
  const AgeNumber = Array.from(
    { length: 100 - 18 + 1 },
    (_, index) => index + 18
  );
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const { ipAddressData } = useSelector((state) => state.user);
  const { userProfile, countryData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [gender, setGender] = useState();
  const [activeRadio, setActiveRadio] = useState("");
  const [fullName, setFullName] = useState();
  const [nickName, setNickName] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [password, setPassword] = useState();
  const [instagramLink, setInstagramLink] = useState();
  const [facebookLink, setFacebookLink] = useState();
  const [twitterLink, setTwitterLink] = useState();
  const [websiteLink, setWebsiteLink] = useState();
  const [ipAddress, setIpAddress] = useState();
  const [email, setEmail] = useState();
  const [data, setData] = useState();
  const [country, setCountry] = useState();
  const [countryDataSelect, setCountryDataSelect] = useState();
  const [image, setImage] = useState();
  const [age, setAge] = useState();
  const [imgApi, setImgApi] = useState();
  const [error, setError] = useState({
    fullName: "",
    nickName,
    mobileNumber: "",
    email: "",
    ipAddress: "",
    gender: "",
    country: "",
    age: "",
    newsLetter: "",
    image: "",
    password: "",
    websiteLink: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
  });

  useEffect(() => {
    const countryDataName = countryData?.map((item) => item?.name?.common);
    setCountry(countryDataName);
  }, [countryData]);

  useEffect(() => {
    setData(data);
  }, [userProfile]);

  useEffect(() => {
    setAge("");
    setGender("");
    setCountryDataSelect([]);
    setCountry([]);
  }, [dialogue]);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getIpAddress());
  }, [dispatch]);

  let folderStructure = "userImage";
  const handleFileUpload = async (event) => {

    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructure
    );
    setImgApi(resDataUrl);
    if (imageURL) {
      setImage(imageURL);
    }

    if (!event.target.files[0]) {
      return setError({
        ...error,
        image: `Image Is Required`,
      });
    } else {
      return setError({
        ...error,
        image: "",
      });
    }
  };

  const isValidURL = (url) => {
    const urlRegex = /^(ftp|http|https):\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const isValidIPv4 = (value) => {
    const urlRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return urlRegex.test(value);
  };

  const isEmail = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
    return validNumber;
  };

  const handleSubmit = () => {
    const emailValid = isEmail(email);
    let websiteLinkValid = true;
    if (websiteLink) {
      websiteLinkValid = isValidURL(websiteLink);
    }
    let facebookLinkValid = true;
    if (facebookLink) {
      facebookLinkValid = isValidURL(facebookLink);
    }
    let twitterLinkValid = true;
    if (twitterLink) {
      twitterLinkValid = isValidURL(twitterLink);
    }
    let instagramLinkValid = true;
    if (instagramLink) {
      instagramLinkValid = isValidURL(instagramLink);
    }
    let ipAddressValid = true;
    if (ipAddress) {
      ipAddressValid = isValidIPv4(ipAddress);
    }
    if (
      !fullName ||
      !nickName ||
      !mobileNumber ||
      !email ||
      !age ||
      !emailValid ||
      !password ||
      !gender ||
      !countryDataSelect ||
      // !image ||
      !ipAddress ||
      // !websiteLinkValid ||
      // !instagramLinkValid ||
      // !facebookLinkValid ||
      // !twitterLinkValid ||
      !ipAddressValid ||
      !websiteLink ||
      !instagramLink ||
      !facebookLink ||
      !twitterLink
    ) {
      let error = {};
      if (!fullName) error.fullName = "Full Name Is Required !";
      if (!nickName) error.nickName = "Nick Name Is Required !";
      if (!mobileNumber) error.mobileNumber = "Mobile Number Is Required !";
      if (!password) error.password = "Password Is Required !";
      if (!activeRadio) error.newsLetter = "Newsletter Is Required !";
      if (!email) {
        error.email = "Email Is Required !";
      }
      if (!gender) error.gender = "Gender Is Required !";
      if (!image) error.image = "Image Is Required !";
      if (!age) error.age = "Age is required !";
      if (!ipAddress);
      if (!countryDataSelect) error.country = "Country is required !";
      if (!age) error.age = "Age is required !";
      if (!emailValid) {
        error.email = "Email Invalid !";
      }

      if (!ipAddress) {
        error.ipAddress = "Ip Address is required !";
      } else if (!ipAddressValid) {
        error.ipAddress = "Ip Address Invalid!";
      }

      if (!websiteLink) {
        error.websiteLink = "WebsiteLink is required !";
      }
      // else if (!websiteLinkValid) {
      //   error.websiteLink = "WebsiteLink Invalid !";
      // }
      if (!instagramLink) {
        error.instagramLink = "InstagramLink is required !";
      }
      // else if (!instagramLinkValid) {
      //   error.instagramLink = "InstagramLink Invalid !";
      // }
      if (!facebookLink) {
        error.facebookLink = "FacebookLink is required !";
      }
      // else if (!facebookLinkValid) {
      //   error.facebookLink = "FacebookLink Invalid !";
      // }
      if (!twitterLink) {
        error.twitterLink = "TwitterLink is required !";
      }
      // else if (!twitterLinkValid) {
      //   error.twitterLink = "TwitterLink Invalid !";
      // }
      return setError({ ...error });
    } else {
      let createFakeUserAdd = {
        fullName: fullName.charAt(0).toUpperCase() + fullName.slice(1),
        nickName: nickName.charAt(0).toUpperCase() + nickName.slice(1),
        gender: gender,
        mobileNumber: mobileNumber,
        instagramLink: instagramLink,
        facebookLink: facebookLink,
        twitterLink: twitterLink,
        websiteLink: websiteLink,
        age: parseInt(age),
        image: imgApi,
        ipAddress: ipAddress,
        country: countryDataSelect,
        email: email,
        password: password,
      };
      const id = dialogueData?._id;
      props.createFakeUser(createFakeUserAdd, id);
      dispatch({
        type: CLOSE_DIALOGUE,
        payload: {
          dialogue: false,
        },
      });

      let dialogueData_ = {
        dialogue: false,
      };
      localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
    }
  };

  const handleClose = () => {
    dispatch({
      type: CLOSE_DIALOGUE,
      payload: {
        dialogue: false,
      },
    });

    let dialogueData_ = {
      dialogue: false,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  return (
    <div>
      <div className="general-setting fake-user ">
        <div className=" userSettingBox">
          <form>
            <div className="row d-flex  align-items-center">
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-1 mb-sm-0">
                <h5 className="mb-0">Create Fake User</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-end">
                <Button
                  btnName={"Back"}
                  newClass={"back-btn"}
                  onClick={handleClose}
                />
              </div>
              <div
                className="col-12 d-flex justify-content-end align-items-center"
                style={{
                  paddingTop: "8px",
                  marginTop: "11px",
                  borderTop: "1px solid #c9c9c9",
                }}
              >
                <Button
                  newClass={"submit-btn"}
                  btnName={"Submit"}
                  type={"button"}
                  onClick={handleSubmit}
                />
              </div>
              <div className="row mt-3">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Full Name"}
                    name={"fullName"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.fullName && error.fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          fullName: `Full Name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          fullName: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Nick Name"}
                    name={"nickName"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.nickName && error.nickName}
                    onChange={(e) => {
                      setNickName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          nickName: `Nick Name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          nickName: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"E-mail Address"}
                    name={"email"}
                    errorMessage={error.email && error.email}
                    placeholder={"Enter Details..."}
                    defaultValue={userProfile?.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          email: `Email Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          email: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 position-relative">
                  <Input
                    label={"Password"}
                    name={"password"}
                    type={"password"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.password && error.password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          password: `Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          password: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Mobile Number"}
                    name={"mobileNumber"}
                    type={"number"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.mobileNumber && error.mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          mobileNumber: `Mobile Number Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          mobileNumber: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Instagram Link"}
                    name={"instagramLink"}
                    type={"text"}
                    errorMessage={error.instagramLink && error.instagramLink}
                    placeholder={"Enter Details..."}
                    onChange={(e) => {
                      setInstagramLink(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          instagramLink: `InstagramLink Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          instagramLink: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Facebook Link"}
                    name={"facebookLink"}
                    type={"text"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.facebookLink && error.facebookLink}
                    onChange={(e) => {
                      setFacebookLink(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          facebookLink: `FacebookLink Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          facebookLink: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Twitter Link"}
                    name={"twitterLink"}
                    type={"text"}
                    placeholder={"Enter Details..."}
                    errorMessage={error.twitterLink && error.twitterLink}
                    onChange={(e) => {
                      setTwitterLink(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          twitterLink: `TwitterLink Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          twitterLink: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Website Link"}
                    name={"websiteLink"}
                    type={"text"}
                    errorMessage={error.websiteLink && error.websiteLink}
                    placeholder={"Enter Details..."}
                    onChange={(e) => {
                      setWebsiteLink(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          websiteLink: `WebsiteLink Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          websiteLink: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Ip Address"}
                    name={"ipAddress"}
                    type={"text"}
                    value={ipAddress}
                    placeholder={"Enter Details..."}
                    errorMessage={error.ipAddress && error.ipAddress}
                    onChange={(e) => {
                      setIpAddress(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          ipAddress: `Ip Address Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          ipAddress: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Gender"}
                    selectValue={gender}
                    placeholder={"Select Gender"}
                    selectData={["Male", "Female"]}
                    errorMessage={error.gender && error.gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          gender: `Gender Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          gender: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Age"}
                    selectValue={age}
                    placeholder={"Select Age"}
                    errorMessage={error.age && error.age}
                    selectData={AgeNumber}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          age: `Age Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          age: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 country-dropdown">
                  <Selector
                    label={"Country"}
                    selectValue={countryDataSelect}
                    placeholder={"Select Country"}
                    selectData={country}
                    errorMessage={error.country && error.country}
                    onChange={(e) => {
                      setCountryDataSelect(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          country: `Country Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          country: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 ">
                  <Input
                    type={"file"}
                    label={"Image"}
                    accept={"image/png, image/jpeg"}
                    errorMessage={error.image && error.image}
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6"></div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 fake-create-img mb-2">
                  {image && <img src={image} />}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default connect(null, {
  getCountry,
  createFakeUser,
  getIpAddress,
})(NewFakeUser);
