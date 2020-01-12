import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types.jsx';


import {setAlert} from './alert.jsx'

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