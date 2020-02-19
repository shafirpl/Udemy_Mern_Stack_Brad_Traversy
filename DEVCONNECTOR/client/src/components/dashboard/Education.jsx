import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import moment from "moment";
import { connect } from "react-redux";
import { deleteEducation } from "../../actions/profile";

const Education = ({ education, deleteEducation }) => {
  const educations = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YYYY/MM/DD">{moment.utc(edu.from)}</Moment> -{" "}
        {edu.to === null ? (
          " Now"
        ) : (
          <Moment format="YYYY/MM/DD">{moment.utc(edu.to)}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(edu._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

/*
* https://reactjs.org/docs/typechecking-with-proptypes.html
* we are using it as a type checking thing. It is not essential but it helps to reduce bugs
*/
Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

/* we are connecting this component to the redux
* this is for redux
* Connect takes two arguments in the first (), the state and
* Second argument is any action we want to use that we imported from action files
* this state gets updated everytime we dispatch an action
* When we do connect or the wrap the component
* in connect function, the entire state is received in the mapStateToProps function
* as the first argument from the redux store. The function is called
* every time when a change in the store's state is detected
* https://react-redux.js.org/using-react-redux/connect-mapstate
* Also the component then will receive these mapStateToProps and the action as argument as well,
* which we can use destructuring to gather necessary info
*/

export default connect(null, { deleteEducation })(Education);

