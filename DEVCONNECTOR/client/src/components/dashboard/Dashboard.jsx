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

export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(Dashboard);
