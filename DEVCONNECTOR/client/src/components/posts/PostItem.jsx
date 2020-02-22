import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
  showActions
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img className="round-img" src={avatar} alt="" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{text}</p>
      <p className="post-date">
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>

      {showActions && (
        <Fragment>
          <button
            onClick={() => addLike(_id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-up" />{" "}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button
            onClick={() => removeLike(_id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-down" />
          </button>
          <Link to={`/post/${_id}`} className="btn btn-primary">
            Discussion{" "}
            {comments.length > 0 && (
              <span className="comment-count">{comments.length}</span>
            )}
          </Link>
          {/* This part is ensuring that only the author who wrote the post can delete it, other user who didn't write the 
          post cannot delete it */}
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={() => deletePost(_id)}
              type="button"
              className="btn btn-danger"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

/*
 * ShowActions basically determines whether we wanna show all the controls/buttons for post stuff like that.
 * so when we are showing the posts/rendering the posts.jsx file, we wanna show them. However when we are rendering a
 * single post, we don't wanna show that. DefaultProps means if we don't pass any value, showActions will be true.
 * for example, in Post.jsx file we are passing false to this component, so it will be false, but in posts.jsx file we are
 * not passing anything, so this will be true and in the posts.jsx file render we can see all post item has the like buttons
 * and stuff like that.
 */
PostItem.defaultProps = {
  showActions: true
};

/*
 * https://reactjs.org/docs/typechecking-with-proptypes.html
 * we are using it as a type checking thing. It is not essential but it helps to reduce bugs
 */

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth
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

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
