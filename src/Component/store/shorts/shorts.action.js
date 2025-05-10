import axios from "axios";
import * as ActionType from "./shorts.type";
import { setToast } from "../../../util/toast";
import { apiInstanceFetch } from "../../../util/api";

export const getShortsApi = (type,start,limit,startDate,endDate) => (dispatch) => {
  apiInstanceFetch
    .get(`admin/video/videosOrShorts?videoType=${type}&start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`)
    .then((res) => {
      dispatch({ type: ActionType.GET_SHORTS, payload: {
        shortsData :res.videosOrShorts,
        totalShorts:res.totalVideosOrShorts
      }});
    })
    .catch((error) => console.error(error));
};

export const createShort = (formData) => (dispatch) => {
  axios
    .post("admin/video/uploadVideo", formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.IMPORT_SHORT, payload: {data:res.data.video,totalNumber:res.data.totalVideos} });
        setToast("success", "Short created Successfully !");
      }
    })
    .catch((error) => console.error(error));
};

export const editShort = (data,videoId,userId,channelIdFind,type,fullNameUser) => (dispatch) => {
  axios
    .patch(`admin/video/updateVideo?videoId=${videoId}&userId=${userId}&channelId=${channelIdFind}&videoType=${type}`,data)
    .then((res) => {
      if (res.data.status) {
        
        dispatch({
          type: ActionType.EDIT_SHORT,
          payload: {data:res.data.video,videoId:videoId,fullName:fullNameUser} ,
        });
        setToast("success",`${type === 1 ? "Short Edit SuccessFully" :"Short Edit SuccessFully" }`,);
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const deleteShort = (id) => (dispatch) => {
  axios
    .delete(`admin/video/deleteVideo?videoId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_SHORT, payload: {id:id} });
        setToast("success","Short Delete SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
