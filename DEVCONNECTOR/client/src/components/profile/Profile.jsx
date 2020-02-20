/*
* This component renders a single profile information, which it fetches by id
*/
import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById, getCurrentProfile } from "../../actions/profile.jsx";
import {Link} from 'react-router-dom';
import ProfileTop from './ProfileTop.jsx';
import ProfileAbout from './ProfileAbout.jsx';
import ProfileExperience from './ProfileExperience.jsx';
import ProfileEducation from './ProfileEducation.jsx';
import ProfileGithub from './ProfileGithub.jsx';
// we are destructuring the received argument here
/*
* if we had props, then we would do
* const {getProfileById, profile, auth, math} = props
* const {profile, loading} = profile
*/
const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match
}) => {
  /*
   * Recall if we want to fetch some data or something like that
   * before the component loads, we use useEffect, which runs first
   * after the component loads and fetches the necessary data
   *
   * https://scotch.io/courses/using-react-router-4/route-params
   * Basically, react router passes a match object as prop/argument to every route
   * it renders (recall in the app.js file we are rendering it under a Route component)
   * inside that match object we have a params object, that will contain info like id and stuff. For
   * example, in our app.js, one of the routes will render this component and it has an :id in its path. So in order to access
   * that id we need match.params.id
   * that param object will allow us to access id and other route parameters
   *
   * The [] means the function will only run when getCurrentProfile us called or changes.
   * This is equivalent to componentDiDMount (Read colt steele google doc to see what componeneDidMount does)
   * Also read useEffect on the doc
   * We usually loads state, handle ajax calls etc in useEffect
   * Go through Colt Steele's google doc on React on componentDidMount and
   * useEffect section to see how it works
   */
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getCurrentProfile]);

  return (
    <Fragment>
      {profile === null || loading ? (<Spinner />) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
                <ProfileTop profile={profile} />
                <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map(experience => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map(education => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>

            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
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

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
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

export default connect(mapStateToProps, { getProfileById })(Profile);
