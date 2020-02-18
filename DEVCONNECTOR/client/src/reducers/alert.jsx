/*
* this is how our states will look like, they will have an id, a msg and 
* an alert type. Then based on the alert type, we will display messages or do something.
* These
 const initialState = [
     {
         id: 1,
         msg: 'Please log in',
         alertType: 'success'
     }
    ]

*/

/*
* In the reducer file, we basically update the application state based on the action type we received from the action
* file with the necessary data/payload that we also received from the action file. Recall that action file sends an
* action type and a payload/necessary data, which we use to update the entire application state.
*
* Usually we return the unpacked entire state (by doing ...state), and only update the necessary part in a return statement
*/

import { SET_ALERT, REMOVE_ALERT } from '../actions/types.jsx';

const initialState = [];

const alertFunction = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case SET_ALERT:
            // since state is immutable, we need to return all states, so we need spread operator
            // set alert will set an alert
            return [...state,payload];
        case REMOVE_ALERT:
            // remove alert will remove a specific alert, we have to find it by id
            return state.filter(alert => alert.id !== payload);
            // every reducer will have a default state of returning state
        default:
            return state;
    }
}

export default alertFunction;