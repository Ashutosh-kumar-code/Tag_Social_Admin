import axios from "axios";
import * as ActionType from "./user.type";
import { Navigate, useNavigate } from "react-router-dom";
import { setToast } from "../../../util/toast";
import { apiInstanceFetch } from "../../../util/api";

export const getUser =
  (type, start, limit, startDate, endDate) => (dispatch) => {
    apiInstanceFetch
      .get(
        `admin/user/getUsers?type=${type}&start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        
        dispatch({
          type: ActionType.GET_USER,
          payload: {
            user: res.users,
            totalUser: res.totalUsers,
          },
        });
      })
      .catch((error) => console.error(error));
  };
export const isActiveUser = (id, type, data) => (dispatch) => {
  axios
    .patch(`admin/user/isBlock?userId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.ACTIVE_SWITCH_USER,
          payload: { data: res.data.users, id: id, type: type },
        });
        setToast(
          "success",
          data === true
            ? `User Block SuccessFully`
            : "User Unblock SuccessFully"
        );
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const deleteUser = (id, type) => (dispatch) => {
  axios
    .delete(`admin/user/deleteUsers?userId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.DELETE_USER,
          payload: { id: id, type: type },
        });
        setToast("success", "User Delete SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const getUserProfile = (id) => (dispatch) => {
  apiInstanceFetch
    .get(`admin/user/getProfile?userId=${id}`)
    .then((res) => {
      dispatch({ type: ActionType.GET_USER_PROFILE, payload: res.user });
    })
    .catch((error) => console.error(error));
};

export const getCountry = () => (dispatch) => {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      dispatch({ type: ActionType.GET_COUNTRY, payload: data });
    })
    .catch((error) => {
      console.error(error);
    });
};

export const editUserProfile = (id, data, isChannel) => (dispatch) => {
  axios
    .patch(`admin/user/updateUser?userId=${id}&isChannel=${isChannel}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.USER_EDIT_PROFILE,
          payload: { data: res.data.user, id: id },
        });
        setToast(
          "success",
          `${res.data.user.fullName + " " + "Update SuccessFully"} `
        );
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const createFakeUser = (formData) => (dispatch) => {
  axios
    .post("admin/user/fakeUser", formData)
    .then((res) => {
      if (res.data.status === true) {
        dispatch({ type: ActionType.CREATE_FAKE_USER, payload: res.data.user });
        setToast("success", "Fake User created Successfully !");
      }
    })
    .catch((error) => console.error(error));
};

export const getIpAddress = () => (dispatch) => {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      dispatch({ type: ActionType.GET_IP_ADDRESS, payload: data });
    })
    .catch((error) => {
      console.error("Error fetching IP address:", error);
    });
};

export const getFakeUser =
  (start, limit, startDate, endDate, type) => (dispatch) => {
    apiInstanceFetch
      .get(
        `admin/user/getUsers?start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&type=${type}`
      )
      .then((res) => {
        dispatch({
          type: ActionType.GET_FAKE_USER,
          payload: { data: res.users, total: res.totalUsersAddByAdmin },
        });
      })
      .catch((error) => console.error(error));
  };

export const passwordChange = (id, data) => (dispatch) => {
  axios
    .patch(`admin/user/updatePassword`, data)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: ActionType.PAASWORD_CHANGE_API,
          payload: { data: res.data.user, id: id },
        });

        setToast("success", "Password Change SuccessFully");
      } else {
        setToast("error", res.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const getUserChannels =
  (start, limit, startDate, endDate, type) => (dispatch) => {
    apiInstanceFetch
      .get(
        `admin/user/channelsOfUser?start=${start}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&type=${type}`
      )
      .then((res) => {
        dispatch({
          type:
            type == "realUser"
              ? ActionType.GET_USER_CHANNEL_DATA
              : ActionType.GET_FAKE_USER_CHANNEL_DATA,
          payload: {
            channel: res.channels,
            total: res.totalChannels,
          },
        });
      })
      .catch((error) => console.error(error));
  };

export const createChannelFakeUser = (id, createChannel) => (dispatch) => {
  axios
    .patch(`admin/user/updateUser?userId=${id}&isChannel=false`, createChannel)
    .then((res) => {
      if (res.data.status) {
        const channelData = res.data.user;
        const type = ActionType.CREATE_FAKE_USER_CHANNEL;
        dispatch({
          type,
          payload: { channelData, id, type },
        });
        setToast("success", "Channel Create SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const getFakeUserName = () => (dispatch) => {
  apiInstanceFetch
    .get(`admin/user/getUsersAddByAdminForChannel`)
    .then((res) => {
      dispatch({ type: ActionType.GET_FAKE_USER_NAME, payload: res.users });
    })
    .catch((error) => console.error(error));
};


export const deleteChanel = (id) => (dispatch) => {
  axios
    .patch(
      `admin/user/deleteChannelByAdmin?channelId=${id}`
    )
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_CHANEL, payload: { id: id } });
        setToast("success", "Chanel Delete SuccessFully");
      } else {
        setToast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};
