import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = (props) => {
    /*
     * the rest operator example
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
     */
    const { component: Component, auth: {isAuthenticated,loading}, ...rest } = props;
    // this means if we it is not authenticated and loaded, redirect to login page, otherwise redirect to whatever
    // component has been passed
    // https://www.udemy.com/course/mern-stack-front-to-back/learn/lecture/10055352#questions/9124156
    // the code is more clearer and explains what it does
//return (<Route {...rest} render={props => !isAuthenticated && !loading ? (<p>hello{console.log(props)}</p>) : (<Component {...props} />)} />)
    return (<Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to="/login" />) : (<Component {...props} />)} />)
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth

})

export default connect(mapStateToProps)(PrivateRoute)
