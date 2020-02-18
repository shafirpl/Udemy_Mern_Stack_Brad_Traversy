import axios from "axios";
import { setAlert } from "./alert.jsx";

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS
} from "./types.jsx";

// get current user's profile

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");
    /*
     * We are gathering the profile data from backend, packing it in the
     * payload, and then dispatching the action with the payload, which will
     * automatically update the state in central store with necessary/updated
     * data. We have to handle that in the reducer. Like when we dispatch the action
     * we have to define in reducer what are we going to do/handle with that data
     */
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Get all profiles
export const getProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("/api/profile");
    /*
     * We are gathering the profile data from backend, packing it in the
     * payload, and then dispatching the action with the payload, which will
     * automatically update the state in central store with necessary/updated
     * data. We have to define that in the reducer, like what are we going to
     * handle the action to update the store in the reducer
     */
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Get Profile by ID
export const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    /*
     * We are gathering the profile data from backend, packing it in the
     * payload, and then dispatching the action with the payload, which will
     * automatically update the state in central store with necessary/updated
     * data. We have to define that in the reducer, like what are we going to
     * handle the action to update the store in the reducer
     */
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Get Github repos
export const getGithubRepos = username => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);
    /*
     * We are gathering the profile data from backend, packing it in the
     * payload, and then dispatching the action with the payload, which will
     * automatically update the state in central store with necessary/updated
     * data. We have to define that in the reducer, like what are we going to
     * handle the action to update the store in the reducer
     */
    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// create or update profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post("/api/profile", formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      /*
       * we cannot use redirect in an action, so we are using push method from history
       */
      history.push("/dashboard");
    }
  } catch (error) {
    const errors = error.response.data.errors;
    errors.forEach(error => dispatch(setAlert(error.msg, "danger", 5000)));
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Add Experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.put("/api/profile/experience", formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    // remember, we cannot redirect in action, we have to use history.push to redirect
    dispatch(setAlert("Experience Added", "success"));
    history.push("/dashboard");
  } catch (error) {
    const errors = error.response.data.errors;
    errors.forEach(error => dispatch(setAlert(error.msg, "danger", 5000)));
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Add Education

export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.put("/api/profile/education", formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    // remember, we cannot redirect in action, we have to use history.push to redirect
    dispatch(setAlert("Education Added", "success"));
    history.push("/dashboard");
  } catch (error) {
    /*
     * most probably https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
     * so axios errors has a response object, which holds the data object, and we defined the errors to be errors
     * so data has errors array
     * this errors are coming from backend, look at routes/api/profile.js
     * there the middleware performs some check, and if the check fails, we send/return an error array
     * as well as status 400 (line 92)
     * we get the errors array using validationResult(req) in that file
     * Uncomment and See the console logs to see what error.response looks like
     * just plain error looks weird
     */

    const errors = error.response.data.errors;
    errors.forEach(error => dispatch(setAlert(error.msg, "danger", 5000)));
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Delete Experience

export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Delete Education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Education Removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Delete account and profile
export const deleteAccount = id => async dispatch => {
  // making sure the user actually wants to delete the account
  // window.confirm will pop up an window and if the user pressed yes, it will be true
  if (window.confirm("Are you sure? This can not be undone!")) {
    try {
      await axios.delete(`/api/profile`);
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert("Your account has been deleted"));
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status
        }
      });
    }
  }
};
