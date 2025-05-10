import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSetting, getSettingApi } from "../../store/setting/setting.action";
import Button from "../../extra/Button";
import Input from "../../extra/Input";


const EngagementSetting = () => {
  const dispatch = useDispatch();

  const { settingData } = useSelector((state) => state.setting);



  const [watchingVideoRewardCoins, setWatchingVideoRewardCoins] = useState();
  const [commentingRewardCoins, setCommentingRewardCoins] = useState();
  const [likeVideoRewardCoins, setLikeVideoRewardCoins] = useState();
  const [error, setError] = useState({
    watchingVideoRewardCoins: "",
    commentingRewardCoins: "",
    likeVideoRewardCoins: "",
  });

  useEffect(() => {
    setWatchingVideoRewardCoins(settingData?.watchingVideoRewardCoins);
    setCommentingRewardCoins(settingData?.commentingRewardCoins);
    setLikeVideoRewardCoins(settingData?.likeVideoRewardCoins);
  }, [settingData]);

  useEffect(() => {
    dispatch(getSettingApi());
  }, []);

  const handleSubmit = () => {

    const watchingVideoRewardCoinsValue = parseInt(watchingVideoRewardCoins);
    const commentingRewardCoinsValue = parseInt(commentingRewardCoins);
    const likeVideoRewardCoinsValue = parseInt(likeVideoRewardCoins);

    if (
      watchingVideoRewardCoins === "" ||
      watchingVideoRewardCoinsValue <= 0 ||
      commentingRewardCoins === "" ||
      commentingRewardCoinsValue <= 0 ||
      likeVideoRewardCoins === "" ||
      likeVideoRewardCoinsValue <= 0
    ) {
      let error = {};

      if (watchingVideoRewardCoins === "")
        error.watchingVideoRewardCoins = "Amount Is Required !";

      if (watchingVideoRewardCoinsValue <= 0)
        error.watchingVideoRewardCoins = "Amount Invalid !";

      if (commentingRewardCoins === "")
        error.commentingRewardCoins = "Amount Is Required !";

      if (commentingRewardCoinsValue <= 0)
        error.commentingRewardCoins = "Amount Invalid !";

      if (likeVideoRewardCoins === "")
        error.likeVideoRewardCoins = "Amount Is Required !";

      if (likeVideoRewardCoinsValue <= 0)
        error.likeVideoRewardCoins = "Amount Invalid !";

      return setError({ ...error });
    } else {
      let settingDataSubmit = {
        watchingVideoRewardCoins: parseInt(watchingVideoRewardCoins),
        commentingRewardCoins: parseInt(commentingRewardCoins),
        likeVideoRewardCoins: parseInt(likeVideoRewardCoins),
      };
      dispatch(editSetting(settingData?._id, settingDataSubmit));
    }
  };

  return (
    <>
      <div className="  userPage withdrawal-page p-0">
        <div className="row">
          <div className="col-6">
            <div className="withdrawal-box payment-setting ">
              <div className="row align-items-center p-2">
                <div className="col-12 col-sm-6 ">
                  <h5>Engagement Reward</h5>
                </div>
                <div className="col-12 col-sm-6 sm-m-0 d-flex justify-content-end p-0">
                  <Button
                    btnName={"Submit"}
                    type={"button"}
                    onClick={handleSubmit}
                    newClass={"submit-btn"}
                    style={{
                      borderRadius: "0.5rem",
                      width: "88px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 withdrawal-input mt-1">
                  <Input
                    label={
                      "Watching Video & Shorts (how many coins for Earning)"
                    }
                    name={"watchingVideoRewardCoins"}
                    value={watchingVideoRewardCoins}
                    type={"number"}
                    placeholder={""}
                    errorMessage={error.watchingVideoRewardCoins}
                    onChange={(e) => {
                      setWatchingVideoRewardCoins(e.target.value);
                    }}
                  />
                  <div className="mt-2">
                    <Input
                      label={
                        "Commenting Video & Shorts (how many coins for Earning)"
                      }
                      name={"commentingRewardCoins"}
                      value={commentingRewardCoins}
                      type={"number"}
                      errorMessage={error.commentingRewardCoins}
                      placeholder={""}
                      onChange={(e) => {
                        setCommentingRewardCoins(e.target.value);
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <Input
                      label={
                        "Liking Video & Shorts (how many coins for Earning)"
                      }
                      name={"likeVideoRewardCoins"}
                      value={likeVideoRewardCoins}
                      type={"number"}
                      placeholder={""}
                      errorMessage={error.likeVideoRewardCoins}
                      onChange={(e) => {
                        setLikeVideoRewardCoins(e.target.value);
                      }}
                    />
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

export default EngagementSetting;
