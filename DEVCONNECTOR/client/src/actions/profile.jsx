import axios from 'axios';
import { setAlert } from './alert.jsx';

import { GET_PROFILE, PROFILE_ERROR } from './types.jsx';

// get current user's profile

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            action: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        })
    }
}

// create or update profile
export const createProfile = (fromData, history, edit = false) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', fromData, config);
        dispatch({
            type: GET_PROFILE,
            action: res.data
        });


        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', "success"));

        if (!edit) {
            /*
            * we cannot use redirect in an action, so we are using push method from history
            */
            history.push('/dashboard');
        }
    } catch (error) {
        const errors = error.response.data.errors;
        errors.forEach(error =>
            dispatch(setAlert(error.msg, "danger", 5000))
        );
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
}