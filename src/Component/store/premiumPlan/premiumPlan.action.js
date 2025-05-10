import axios from "axios";
import * as ActionType from "./premiumPlan.type";
import { setToast } from "../../../util/toast";
import { apiInstanceFetch } from "../../../util/api";

export const getPremiumPlan = () => (dispatch) => {
  apiInstanceFetch
      .get(`admin/premiumPlan`)
      .then((res) => {
        dispatch({ type: ActionType.GET_PREMIUM_PLAN, payload:res.premiumPlan});
      })
      .catch((error) => console.error(error));
  };
  
  export const addPremiumPlan = (formData) => (dispatch) => {
    axios
      .post("admin/premiumPlan/create", formData)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: ActionType.ADD_PREMIUM_PLAN, payload:res.data.premiumPlan });
          setToast("success", "Plan Added Successfully !");
        }Ḍ
      })
      .catch((error) => console.error(error));
  };
  
  export const updatePremiumPlan = (formData, id) => (dispatch) => {
    axios
      .patch(`admin/premiumPlan/update?premiumPlanId=${id}`, formData)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: ActionType.UPDATE_PREMIUM_PLAN,
            payload: { editPlan: res.data.premiumPlan, id:id },
          });
          setToast("success", "Plan Update Successfully");
        } else {
          setToast("error", res.data.message);
        }
      })
      .catch((error) => setToast("error", error.message));
  };

  export const isActivePremiumPlan = (id,data) => (dispatch) => {
    axios
      .patch(`admin/premiumPlan/handleisActive?premiumPlanId=${id}`)
      .then((res) => {
        if (res.data.status) {
          dispatch({
            type: ActionType.ACTIVE_PREMIUM_PLAN,
            payload: {planActiveData:res.data.premiumPlan,planId:id} ,
          });
          setToast(
            "success",
            data === true ? "Plan Active SuccessFully" :"Plan Disable SuccessFully"
            )
        } else {
          setToast("error", res.data.message);
        }
      })
      .catch((error) => console.log("error", error.message));
  };
  
  export const deletePlan = (id) => (dispatch) => {
    axios
      .delete(`admin/premiumPlan/delete?premiumPlanId=${id}`)
      .then((res) => {
        if (res.data.status) {
          dispatch({ type: ActionType.DELETE_PREMIUM_PLAN, payload:id});
          setToast("success","Plan Delete SuccessFully");
        } else {
          setToast("error", res.data.message);
        }
      })
      .catch((error) => console.log(error));
  };