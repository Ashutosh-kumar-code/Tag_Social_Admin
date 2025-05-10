import axios from 'axios';
import * as ActionType from './admin.type';
import { setToast } from '../../../util/toast';
import { apiInstanceFetch } from '../../../util/api';

const token = localStorage.getItem("token");


export const signupAdmin = (signup, navigate) => (dispatch) => {
  axios
    .post('admin/admin/create', signup)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.SIGNUP_ADMIN });
        setToast('success', 'Signup Successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setToast('error', res.data.message);
      }
    })
    .catch((error) => {
      setToast('error', error);
    });
};

export const updateCode = (signup) => (dispatch) => {
  axios
    .patch('admin/admin/updateCode', signup)
    .then((res) => {
      if (res.data.status) {
        setToast('success', 'Purchase Code Update Successfully!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      } else {
        setToast('error', res.data.message);
      }
    })
    .catch((error) => {
      setToast('error', error);
    });
};

export const loginAdmin = (login, navigate) => async (dispatch) => {
  axios
    .post('admin/admin/login', login)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.LOGIN_ADMIN, payload: res.data.token });
        setToast('success', 'Login Successfully!');
        setTimeout(() => {
          navigate('/admin/mainDashboard');
        }, 1000);
      } else {
        setToast('error', res.data.message);
      }
    })
    .catch((error) => {
      setToast('error', error.response.data.message);
    });
};

export const getProfile = () => (dispatch) => {
  axios
    .get('admin/admin/profile' , {
      Headers : {
        authorization : token
      }
    })
    .then((res) => {
      if (res.status) {
        dispatch({ type: ActionType.UPDATE_PROFILE, payload: res.user });
      } else {
        setToast('error', res.message);
      }
    })
    .catch((error) => {
      console.log('error', error.message);
    });
};

export const changePassword = (data) => (dispatch) => {
  axios
    .patch(`admin/admin/updatePassword`, data)
    .then((res) => {
      if (res.data.status) {
        setToast('success', 'Password Changed Successfully.');
        setTimeout(() => {
          dispatch({ type: ActionType.UNSET_ADMIN });
          window.location.href = '/login';
        }, [3000]);
      } else {
        setToast('error', res.data.message);
      }
    })
    .catch((error) => setToast('error', error.message));
};

export const profileUpdate = (formData) => (dispatch) => {
  axios
    .patch('admin/admin/updateProfile', formData)
    .then((res) => {
      if (res.data.status) {
        dispatch({
          type: ActionType.UPDATE_PROFILE,
          payload: res.data.admin,
        });
        setToast('success', 'Admin update Successfully');
      }
    })
    .catch((error) => {
      setToast('error', error);
    });
};

export const sendEmail = (login) => (dispatch) => {
  axios
    .post('admin/admin/forgotPassword', login)
    .then((res) => {
      if (res.data.status) {
        setToast('success', 'Email Send For Forget The Password! ');
        setTimeout(() => {
          window.location.href = '/';
        }, [2000]);
      } else {
        setToast('error', res.data.message);
      }
    })
    .catch((error) => {
      setToast('error', error.response.data.message);
    });
};

export const setPasswordApi = (login) => (dispatch) => {
  axios
    .post(`admin/admin/setPassword`, login)
    .then((res) => {
      if (res.data.status) {
        setToast('success', 'Password Changed Successfully.');
        setTimeout(() => {
          window.location.href = '/';
        }, [2000]);
      } else {
        setToast('error', res.data.message);
      }
    })
    .catch((error) => {
      setToast('error', error.response.data.message);
    });
};

export const getAdminEarnings =
  (startDate, endDate, start, limit) => (dispatch) => {
    apiInstanceFetch
      .get(
        `admin/premiumPlan/getpremiumPlanHistory?startDate=${startDate}&endDate=${endDate}&start=${start}&limit=${limit}`
      )
      .then((res) => {
        if (res.status) {
          dispatch({
            type: ActionType.ADMIN_EARNING,
            payload: {
              earning: res.history,
              total: res.totalHistory,
              totalEarning: res.totalAdminEarnings,
            },
          });
        }
      });
  };

export const getCoinPlanEarnings =
  (startDate, endDate, start, limit) => (dispatch) => {
    apiInstanceFetch
      .get(
        `admin/coinPlan/retrieveUserCoinplanRecords?startDate=${startDate}&endDate=${endDate}&start=${start}&limit=${limit}`
      )
      .then((res) => {
        if (res.status) {
          dispatch({
            type: ActionType.COIN_PLAN_EARNING,
            payload: {
              earning: res.data,
              total: res.total,
              totalEarning: res.totalAdminEarnings,
            },
          });
        }
      });
  };
