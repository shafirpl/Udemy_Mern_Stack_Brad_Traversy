import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";
/*
* We usually use useState whenever we have form, to manipulate the
* form items
*/
const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState("");

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Leave a Comment</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault();
          addComment(postId, { text });
          setText("");
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Comment the post"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

/*
 * https://reactjs.org/docs/typechecking-with-proptypes.html
 * we are using it as a type checking thing. It is not essential but it helps to reduce bugs
 */

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired
};

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
 * Here null means we are not retreiving any state info from the redux store
 */
export default connect(null, { addComment })(CommentForm);
