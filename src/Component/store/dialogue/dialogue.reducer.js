import * as ActionType from "./dialogue.type";

let dialogueData = localStorage.getItem("dialogueData");
let parsedIntData = JSON.parse(dialogueData);

const initialState = {
  dialogue: parsedIntData ? parsedIntData.dialogue : false,
  dialogueType: parsedIntData ? parsedIntData.type : "",
  dialogueData: parsedIntData ? parsedIntData.dialogueData : null,
  dialogueNotification: false,
  dialogueNotificationType: "",
  dialogueNotificationData: null,
  isLoading: false,
  loadingUrl:null,
  uploadFilePercent:null,
  loaderType:""
};

export const dialogueReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.OPEN_DIALOGUE:
      return {
        ...state,
        dialogue: true,
        dialogueType: action.payload.type || "",
        dialogueData: action.payload.data || null,
        extraData: action.payload.extraData || null,
      };
    case ActionType.CLOSE_DIALOGUE:
      return {
        ...state,
        dialogue: false,
        dialogueType: "",
        dialogueData: null,
        extraData: null,
      };

    case ActionType.OPEN_NOTIFICATION_DIALOGUE:
      return {
        ...state,
        dialogueNotification: true,
        dialogueNotificationType: action.payload.type || "",
        dialogueNotificationData: action.payload.data || null,
      };
    case ActionType.CLOSE_NOTIFICATION_DIALOGUE:
      return {
        ...state,
        dialogueNotification: false,
        dialogueNotificationType: "",
        dialogueNotificationData: null,
      };
      case ActionType.UPLOAD_FILE_AWS:
        return{
          ...state,
          uploadFilePercent:action.payload.uploadFilePercent || null,
          loaderType:action.payload.loaderType || "",

        }
    case ActionType.LOADER_OPEN:
      return {
        ...state,
        isLoading: true,
        loadingUrl:action.payload || null
      };
    case ActionType.CLOSE_LOADER:
      return {
        ...state,
        isLoading: false,
        loadingUrl:null
      };

    default:
      return state;
  }
};
