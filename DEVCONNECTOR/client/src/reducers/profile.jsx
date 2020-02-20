import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_REPOS
} from "../actions/types.jsx";

/*
* In the reducer file, we basically update the application state based on the action type we received from the action
* file with the necessary data/payload that we also received from the action file. Recall that action file sends an
* action type and a payload/necessary data, which we use to update the entire application state.
*
* Usually we return the unpacked entire state (by doing ...state), and only update the necessary part in a return statement
*/

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  // console.log("payload is:"+action.payload);

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      }
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        profile: null,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false
      }
    default:
      return state;
  }
};
