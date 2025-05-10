import axios from "axios";
import * as ActionType from "./video.type";
import { setToast } from "../../../util/toast";
import { apiInstanceFetch } from "../../../util/api";

export const getVideoApi =
  (type, start, limit, startDate, endDate) => (dispatch) => {
    apiInstanceFetch
      .get(
        `admin/video/videosOrShorts?videoType=${type}&start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        dispatch({
          type: ActionType.GET_VIDEO,
          payload: {
            video: res.videosOrShorts,
            totalVideo: res.totalVideosOrShorts,
          },
        });
      })
      .catch((error) => console.error(error));
  };

export const getFakeUserName = () => (dispatch) => {
  apiInstanceFetch
    .get(`admin/user/getUsersAddByAdminForChannel`)
    .then((res) => {
      dispatch({
        type: ActionType.GET_FAKE_USER_NAME,
        payload: res.users,
      });
    })
    .catch((error) => console.error(error));
};

export const createVideo = (formData) => (dispatch) => {
  axios
    .post("admin/video/uploadVideo", formData)
    .then((res) => {
      
      if (res.data.status) {
        dispatch({
          type: ActionType.IMPORT_VIDEO,
          payload: {
            data: res.data.videosOrShorts,
            totalNumber: res.data.totalVideosOrShorts,
          },
        });
        setToast("success", "Video created Successfully !");
      }else{
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.error(error));
};

export const editVideo =
  (data, videoId, userId, channelIdFind, type, fullNameUser) => (dispatch) => {
    axios
      .patch(
        `admin/video/updateVideo?videoId=${videoId}&userId=${userId}&channelId=${channelIdFind}&videoType=${type}`,
        data
      )
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: ActionType.EDIT_VIDEO,
            payload: {
              data: res.data.video,
              videoId: videoId,
              fullName: fullNameUser,
            },
          });
          setToast(
            "success",
            `${
              type === 1 ? "Video Edit SuccessFully" : "Short Edit SuccessFully"
            }`
          );
        } else {
          setToast("error", res.data.message);
        }
      })
      .catch((error) => console.log("error", error.message));
  };

export const deleteVideo = (id) => (dispatch) => {
  axios
    .delete(`admin/video/deleteVideo?videoId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_VIDEO, payload: { id: id } });
        setToast("success", "Video Delete SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const getCommentsApi =
  (start, limit, startDate, endDate, type) => (dispatch) => {
    apiInstanceFetch
      .get(
        `admin/VideoComment/commentsOfVideos?start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&videoType=${type}`
      )
      .then((res) => {
        dispatch({
          type: ActionType.COMMENT_GET,
          payload: {
            videoComments: res.commentsOfVideos,
            totalVideoComment: res.totalComments,
          },
        });
      })
      .catch((error) => console.error(error));
  };

export const deleteVideoComments = (id) => (dispatch) => {
  axios
    .delete(`admin/videoComment/deleteVideoComment?videoCommentId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_VIDEO_COMMENTS,
          payload: { id: id },
        });
        setToast("success", "Comment Delete SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
