import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteComment } from "../../actions/post";

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date },
  auth,
  deleteComment
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
      {/* This part is ensuring that only the author who wrote the comment can delete it, other user who didn't write the 
      comment cannot delete it */}
      {!auth.loading && user === auth.user._id && (
        <button
          onClick={() => deleteComment(postId, _id)}
          type="button"
          className="btn btn-danger"
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  </div>
);


/*
 * https://reactjs.org/docs/typechecking-with-proptypes.html
 * we are using it as a type checking thing. It is not essential but it helps to reduce bugs
 */


CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
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

export default connect(mapStateToProps, { deleteComment })(CommentItem);
