import * as ActionType from "./video.type";

const initialState = {
  videoData: [],
  totalVideo: null,
  fakeUser: [],
  commentData: [],
  totalVideoComment: null,
};

export const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_VIDEO:
      return {
        ...state,
        videoData: action.payload.video,
        totalVideo: action.payload.totalVideo,
      };
    case ActionType.GET_FAKE_USER_NAME:
      return {
        ...state,
        fakeUser: action.payload,
      };


    case ActionType.IMPORT_VIDEO:
      
      const importedVideo = action.payload.data;

     

      const newVideoData = {
        
        ...importedVideo,
        uniqueId: importedVideo.userId.fullName,
        fullName: importedVideo.userId.fullName,
      };
      

      const updatedVideoDataAdd = state.videoData.unshift(newVideoData);

      return {
        
        ...state,
        videoData: updatedVideoDataAdd,
        totalVideo: action?.payload?.totalNumber
      };
    case ActionType.EDIT_VIDEO:
      const updatedVideoData = state.videoData.map((item) => {
        if (item._id === action.payload.videoId) {
          
          return {
            ...action.payload.data,
            title: action.payload.data.title,
            fullName: action.payload.fullName,
            userId:action.payload.data?.userId?._id,
            image: action.payload.data.userId.image,
            uniqueId: action.payload.data?.uniqueVideoId,
          };
        }
        return item;
      });
      return {
        ...state,
        videoData: updatedVideoData,
      };
    case ActionType.DELETE_VIDEO:
      return {
        ...state,
        videoData: state.videoData.filter(
          (data) => !action.payload.id.includes(data._id)
        ),
      };
    case ActionType.COMMENT_GET:
      return {
        ...state,
        commentData: action.payload.videoComments,
        totalVideoComment: action.payload.totalVideoComment,
      };
    case ActionType.DELETE_VIDEO_COMMENTS:
      return {
        ...state,
        commentData: state.commentData.filter(
          (data) => !action.payload.id.includes(data._id)
        ),
      };
    default:
      return state;
  }
};
