import axios from 'axios';
import { setAlert } from './alert.jsx';

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types.jsx';

// get current user's profile

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
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
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
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
};

// Add Experience

export const addExperience = (formData,history) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });


        // remember, we cannot redirect in action, we have to use history.push to redirect
        dispatch(setAlert('Experience Added', "success"));
        history.push('/dashboard');

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

// Add Education

export const addEducation = (formData,history) => async dispatch => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });


        // remember, we cannot redirect in action, we have to use history.push to redirect
        dispatch(setAlert('Education Added', "success"));
        history.push('/dashboard');

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
