import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem.jsx";

import { getProfiles } from "../../actions/profile.jsx";

// const Profiles = props => {
//     return (
//         <div>

//         </div>
//     )

/*
* this is equivalent to
const {getProfiles, profile} = props
const {profiles,loading} = profile

*/
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  /*
   * Recall useEffect will run first after the component gets rendered, and we only want it to run once, that is why
   * we are putting getProfiles in the [], this also means that we are giving the dependency for this useState.
   * Empty bracket also works, but gives us a dependency console warning
   * https://reactjs.org/docs/hooks-effect.html
   * This is equivalent to componentDiDMount (Read colt steele google doc to see what componeneDidMount does)
   * Also read useEffect on the doc
   * We usually loads state, handle ajax calls etc in useEffect
   */
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with
            developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

/*
 * https://reactjs.org/docs/typechecking-with-proptypes.html
 * we are using it as a type checking thing. It is not essential but it helps to reduce bugs
 */

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
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

export default connect(mapStateToProps, { getProfiles })(Profiles);
