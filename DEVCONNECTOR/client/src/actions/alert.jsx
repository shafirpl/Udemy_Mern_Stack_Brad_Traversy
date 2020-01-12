import uuid from 'uuid';
import {SET_ALERT, REMOVE_ALERT} from './types.jsx';

// we can do this weird thing because of the funk middleware
// like python timeout = 2000 means if the value is not provided, the default value will be 2000
export const setAlert = (msg, alertType, timeout = 2000) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });

    /*
    * We want the message to be gone after some time, just like real world which would show
    * password doesn't match or something, and then the message will be gone after some time
    * I had an issue whereas i accidentally placed the ) at 2000, so the code looked like this
    * setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}, 2000)); so that 2000 accidentally became part of
    * payload and the timeout time was not defined, in which case the default value 0 was used, which means instant removal
    * of the alert
    */
    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), timeout);
};