import React, { useEffect, Fragment } from "react";
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
//import { setAlert } from "../../actions/alert.jsx";
import { login } from "../../actions/auth.jsx";
import PropTypes from "prop-types";
import { getCurrentProfile, deleteAccount } from "../../actions/profile.jsx";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions.jsx";
import Experience from './Experience.jsx';
import Education from './Education.jsx';
/*
const {getCurrentProfile, auth, profile} = props
is equivalent to the bottom line
*/
const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile, loading }
}) => {
    const showSomething = () => { };
    /*
    * Recall we use useEffect to initiate some stuff before the component gets
    * rendered. Here using the getCurrentProfile, which is an action defined in 
    * profile.jsx file in actions folder, we are trying to gather all the info
    * about the registered user. As it dispatches the action, the profile state 
    * will have the necessary data coming from redux central store. 
    */
    useEffect(() => {
        getCurrentProfile();
    }, []);
    return loading && profile === null ? (
        <Spinner />
    ) : (
            <Fragment>
                <h1 className="large text-primary">Dashboard</h1>
                <p className="lead">
                    <i className="fas fa-user"> Welcome {user && user.name}</i>
                </p>
                {profile !== null ? (
                    // the true part of profile != null
                    <Fragment>
                        <DashboardActions />
                        <Experience  experience = {profile.experience}/>
                        <Education education = {profile.education}/>
                        <div className="my-2"> 
                            <button className="btn btn-danger" onClick = {() => deleteAccount()}>
                                <i className="fas fa-user-minus">Delete My Account</i>
                            </button> 
                        </div>
                    </Fragment>
                ) : (
                        // the false part of profile != null
                        <Fragment>
                            <p>You have not set up a profile, please add some info</p>
                            <Link to="/create-profile" className="btn btn-primary my-1">
                                Create Profile
                            </Link>
                        </Fragment>
                    )}
            </Fragment>
        );
};

/*
* https://reactjs.org/docs/typechecking-with-proptypes.html
* we are using it as a type checking thing. It is not essential but it helps to reduce bugs
*/ 

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});



/* we are connecting this component to the redux
* this is for redux
* Connect takes two arguments in the first (), the state and
* Second argument is any action we want to use that we imported from action files
* This will allow us to acces auth and profile.
* this state gets updated everytime we dispatch an action
*/

export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(Dashboard);
