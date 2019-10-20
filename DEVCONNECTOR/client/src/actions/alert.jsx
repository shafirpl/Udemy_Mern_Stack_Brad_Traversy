import uuid from 'uuid';
import {SET_ALERT, REMOVE_ALERT} from './types.jsx';

// we can do this weird thing because of the funk middleware
export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    })
}