import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from '../actions/types.jsx';

const initialState = {
    /*
    * Our plan is to get the item from local storage, so the token will be saved in the browswer
    * cache, something like a cookie
    */
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default (state = initialState, action) => {
    const {type, payload} = action
    switch(type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                // recall from the auth.jsx action file, the payload sent res.data which contains all info about user
                user: payload
            }
        case REGISTER_SUCCESS: 
        case LOGIN_SUCCESS:
            /*
            * If the user successfully registers, we set the token to the local storage like a cookie
            * we are getting the payload token from the backend
            */
            localStorage.setItem('token',payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }

        // this means both REGISTER_FAIL and AUTH_ERROR will do the same thing
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
            
        default: 
            return state;
    }
}