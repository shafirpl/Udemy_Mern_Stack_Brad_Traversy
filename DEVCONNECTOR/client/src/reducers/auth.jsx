import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
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
        case REGISTER_SUCCESS: 
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

        case REGISTER_FAIL:
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