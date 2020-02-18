import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from '../actions/types.jsx';

import setAuthToken from '../utils/setAuthTokes.jsx';


import {setAlert} from './alert.jsx'

// Load User
export const loadUser = () => async dispatch =>  {
    if(localStorage.token) {
        // setting up the global header token, why we are doing it? look at the file this function was 
        // imported from
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('/api/auth');
        dispatch({
          // the user data will be the payload, or data containing about info about the user
          /*
           * We are gathering the necessary data from backend using axios, packing it in the
           * payload, and then dispatching the action with the payload, which will
           * automatically update the state in central store with necessary/updated
           * data. We have to define that in the reducer, like what are we going to
           * handle the action to update the store in the reducer
           */
          type: USER_LOADED,
          payload: res.data
        });
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,

        });
    }
}

// Register User

export const register = ({name,email,password}) => async dispatch => {
    const config= {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const body = JSON.stringify({name,email,password});

    try {
        const res = await axios.post('/api/users',body,config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (error) {
        /* 
        * not sure about this one
        * most probably https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
        * so axios errors has a response object, which holds the data object, and we defined the errors to be errors
        * so data has errors array
        * this errors are coming from backend, look at routes/api/auth.js
        * there the middleware performs some check, and if the check fails, we send/return an error array
        * as well as status 400 (line 92)
        * we get the errors array using validationResult(req) in that file
        * Uncomment and See the console logs to see what error.response looks like
        * just plain error looks weird
        */ 

        // console.log(error);
        // console.log(error.response);
        // console.log(error.response.data);
        const errors = error.response.data.errors;
        errors.forEach(error => dispatch(setAlert(error.msg,'danger',5000)));
        dispatch({
            type: REGISTER_FAIL
        });
    }
}

// Login User

export const login = (email,password) => async dispatch => {
    const config= {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const body = JSON.stringify({email,password});

    try {
        const res = await axios.post('/api/auth',body,config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (error) {
        /* 
        * not sure about this one
        * most probably https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
        * so axios errors has a response object, which holds the data object, and we defined the errors to be errors
        * so data has errors array
        * this errors are coming from backend, look at routes/api/auth.js
        * there the middleware performs some check, and if the check fails, we send/return an error array
        * as well as status 400 (line 92)
        * we get the errors array using validationResult(req) in that file
        * Uncomment and See the console logs to see what error.response looks like
        * just plain error looks weird
        */ 

        // console.log(error);
        // console.log(error.response);
        // console.log(error.response.data);
        const errors = error.response.data.errors;
        errors.forEach(error => dispatch(setAlert(error.msg,'danger',5000)));
        dispatch({
            type: LOGIN_FAIL
        });
    }
}

// Log out and clear profile
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT});
}
