import axios from "axios";
import { setAlert } from "./alert.jsx";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST } from "./types";

// GET posts

export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("/api/posts");
    console.log(`Post is ${res.data}`)
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Add like
export const addLike = (postId) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);
    // res.data will be an array of likes
    dispatch({
      type: UPDATE_LIKES,
      payload: {
        postId, likes: res.data
      }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Remove like
export const removeLike = (postId) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    // res.data will be an array of likes
    dispatch({
      type: UPDATE_LIKES,
      payload: {
        postId, likes: res.data
      }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

// Delete Post
export const deletePost = (postId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/${postId}`);
    // res.data will be an array of likes
    dispatch({
      type: DELETE_POST,
      payload: postId
    });

    dispatch(setAlert("Post Removed",'success'));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

