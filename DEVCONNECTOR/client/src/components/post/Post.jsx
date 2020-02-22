import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "../post/CommentForm";
import CommentItem from "../post/CommentItem";
import { getPost } from "../../actions/post";

/*
 * Recall that we use useEffect to load necessary data. Go through Colt Steel's
 * React google doc's sections on useEffect and ComponentDidMount. useEffect is basically
 * componentDidMount
 */

/*
 * https://scotch.io/courses/using-react-router-4/route-params
 * Basically, react router passes a match object as prop/argument to every route
 * it renders (recall in the app.js file we are rendering it under a Route component)
 * inside that match object we have a params object, that will contain info like id and stuff. For
 * example, in our app.js, one of the routes will render this component and it has an :id in its path. So in order to access
 * that id we need match.params.id
 * that param object will allow us to access id and other route parameters
 */
const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

/*
 * https://reactjs.org/docs/typechecking-with-proptypes.html
 * we are using it as a type checking thing. It is not essential but it helps to reduce bugs
 */

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.posts
});

/* we are connecting this component to the redux
 * this is for redux
 * Connect takes two arguments in the first (), the state and
 * Second argument is any action we want to use that we imported from action files
 * This will allow us to acces auth and profile.
 * this state gets updated everytime we dispatch an action
 * When we do connect or the wrap the component
 * in connect function, the entire state is received in the mapStateToProps function
 * as the first argument from the redux store. The function is called
 * every time when a change in the store's state is detected
 * https://react-redux.js.org/using-react-redux/connect-mapstate
 * Also the component then will receive these mapStateToProps and the action as argument as well,
 * which we can use destructuring to gather necessary info
 */

export default connect(mapStateToProps, { getPost })(Post);
