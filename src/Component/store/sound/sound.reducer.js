import * as ActionType from "./sound.type";

const initialState = {
  soundCategoryData: [],
  soundListData: [],
};

export const soundReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_SOUND_LIST:
      return {
        ...state,
        soundListData: action.payload,
      };
    case ActionType.SOUND_LIST_ADD:
      let listAdd = [...state.soundListData];
      listAdd.unshift(action.payload);
      return {
        ...state,
        soundListData: listAdd,
      };
    case ActionType.SOUND_LIST_DELETE:
      return {
        ...state,
        soundListData: state.soundListData.filter(
          (data) => !action.payload.id.includes(data._id)
        ),
      };
      case ActionType.SOUND_LIST_EDIT:
        const { soundId, soundEditData } = action.payload;
        const updatedSoundData = state.soundListData?.map((item) => {
          if (item?._id === soundId) {
            return {
              ...item,
              ...soundEditData
            };
          }
          return item;
        });
        return {
          ...state,
          soundListData: updatedSoundData,
        };
    case ActionType.GET_SOUND_CATEGORY:
      return {
        ...state,
        soundCategoryData: action.payload.soundCategory,
      };
    case ActionType.SOUND_CATEGORY_ADD:
      let data = [...state.soundCategoryData];
      data.unshift(action.payload);
      return {
        ...state,
        soundCategoryData: data,
      };
    case ActionType.SOUND_CATEGORY_EDIT:
      const { id, editData } = action.payload;
      const updatedSoundCategoryData = state.soundCategoryData?.map((item) => {
        if (item?._id === id) {
          return {
            ...item,
            name: editData.name,
            image: editData.image,
          };
        }
        return item;
      });
      return {
        ...state,
        soundCategoryData: updatedSoundCategoryData,
      };
    case ActionType.SOUND_CATEGORY_DELETE:
      return {
        ...state,
        soundCategoryData: state.soundCategoryData.filter(
          (data) => !action.payload.id.includes(data._id)
        ),
      };
    default:
      return state;
  }
};
