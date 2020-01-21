import axios from 'axios';
import {setAlert} from './alert.jsx';

import {GET_PROFILE, PROFILE_ERROR} from './types.jsx';

// get current user's profile

export const getCurrentProfile = ()=> async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            action: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText,
            status: error.response.status}
        })
    }
}