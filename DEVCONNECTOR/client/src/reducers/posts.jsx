import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  DELETE_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

/*
 * In the reducer file, we basically update the application state based on the action type we received from the action
 * file with the necessary data/payload that we also received from the action file. Recall that action file sends an
 * action type and a payload/necessary data, which we use to update the entire application state.
 *
 * Usually we return the unpacked entire state (by doing ...state), and only update the necessary part in a return statement
 */

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };

    /*
     * This only gets a single post, that is why we are onlu updating the post section of the state
     */
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };

    case ADD_POST:
      /*
       * So basically we are adding new post to the existing posts, so we unpack the state.posts by doing ..., which
       * will add all the existings posts toe the posts array, and then add the new post that is coming from the payload
       */
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };

    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      /*
       * so we first check if the post id matches, since posts coming from the state
       * will be an array of posts, so we need to figure out which post we are referring to (an user may have several
       * posts to his account that is why we have the array)
       * Then we just manipulate the likes, so if the id doesn't match, keep the post as it is, but if they do, manipulate/update
       * the likes on the store
       */
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };

    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(comment => comment._id !== payload)
        }
      }
    default:
      return {
        ...state
      };
  }
};
