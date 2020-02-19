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

/*
* https://reactjs.org/docs/typechecking-with-proptypes.html
* we are using it as a type checking thing. It is not essential but it helps to reduce bugs
*/

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth

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
* Also the component then will receive these mapStateToProps and the action as argument as well,
* which we can use destructuring to gather necessary info
*/

export default connect(mapStateToProps)(PrivateRoute)
