// we typed racf, and it automagically shows that it can create an arrow based
// functional component out of react, since we had es7/react/redux package installed
import React from "react";
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({isAuthenticated}) => {

  if(isAuthenticated){
    return <Redirect to='/dashboard'/>
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
/*
* https://reactjs.org/docs/typechecking-with-proptypes.html
* we are using it as a type checking thing. It is not essential but it helps to reduce bugs
*/

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,

})

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

export default connect(mapStateToProps)(Landing);
