import * as ActionType from "./monetization.type";

const initialState = {
  monetization: [],
  total: 0,
};

export const monetizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_MONETIZATION_REQUEST:
      return {
        ...state,
        monetization: action.payload.request,
        total: action.payload.total,
      };
   
      case ActionType.ACCEPT_MONETIZATION_REQUEST:
        return {
          ...state,
          monetization: state.monetization.filter(
            (data) => !action.payload.requestId.includes(data._id)
          ),
        };
    default:
      return state;
  }
};
