import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import moment from "moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map(exp => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className="hide-sm">{exp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{moment.utc(exp.from)}</Moment> -{" "}
        {exp.to === null ? (
          " Now"
        ) : (
          <Moment format="YYYY/MM/DD">{moment.utc(exp.to)}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteExperience(exp._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

/*
* https://reactjs.org/docs/typechecking-with-proptypes.html
* we are using it as a type checking thing. It is not essential but it helps to reduce bugs
*/

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
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

export default connect(null, { deleteExperience })(Experience);

