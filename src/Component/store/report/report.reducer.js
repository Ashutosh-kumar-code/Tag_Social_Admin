import * as ActionType from "./report.type";

const initialState = {
    videoReport:[],
    totalVideoReport:null
  };

  export const reportReducer = (state = initialState, action) => {
    switch (action.type) {
      case ActionType.GET_VIDEO_REPORT:
        return {
          ...state,
          videoReport: action.payload.data,
          totalVideoReport: action.payload.totalData,
        };
        case ActionType.DELETE_VIDEO_REPORT:
          return {
            ...state,
            videoReport: state.videoReport.filter((data) =>  !action.payload.id.includes(data._id)),
          };
      default:
        return state;
    }
  };