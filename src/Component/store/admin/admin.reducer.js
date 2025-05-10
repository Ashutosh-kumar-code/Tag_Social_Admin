import { secretKey } from "../../../util/config";
import { SetDevKey, setToken } from "../../../util/setAuth";
import * as ActionType from "./admin.type";
import jwt_decode from "jwt-decode";

const initialState = {
  admin: {},
  isAuth: false,
};

export const adminReducer = (state = initialState, action) => {
  let decode;
  switch (action.type) {
    case ActionType.LOGIN_ADMIN:
      if (action.payload) {
        decode = jwt_decode(action.payload);
      }
      // Set Token And Key In Axios
      setToken(action?.payload);
      SetDevKey(secretKey);
      // Set Token And Key In Session
      localStorage.setItem("token", action?.payload);
      localStorage.setItem("key", secretKey);
      localStorage.setItem("isAuth", true);
      localStorage.setItem("admin", JSON.stringify(decode));
      return {
        ...state,
        admin: decode,
        isAuth: true,
      };
    case ActionType.LOGOUT_ADMIN:
      window.localStorage.clear();

      setToken(null);
      SetDevKey(null);
      return {
        ...state,
        admin: {},
        isAuth: false,
      };

    case ActionType.UPDATE_PROFILE:
      return {
        ...state,
        admin: {
          ...state.admin,
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          image: action.payload.image,
          password: action.payload.password,
        },
      };
    case ActionType.ADMIN_EARNING:
      return {
        ...state,
        earning: action.payload.earning,
        total: action.payload.total,
        totalEarning: action.payload.totalEarning,
      };
    case ActionType.COIN_PLAN_EARNING:
      return {
        ...state,
        earning: action.payload.earning,
        total: action.payload.total,
        totalEarning: action.payload.totalEarning,
      };
    case ActionType.LOGOUT_ADMIN:
      localStorage.removeItem("key", secretKey);
      localStorage.removeItem("token", setToken);
      localStorage.removeItem("isAuth", false);
      setToken(null);
      SetDevKey(null);
      return {
        ...state,
        admin: {},
        isAuth: false,
      };
    default:
      return state;
  }
};
