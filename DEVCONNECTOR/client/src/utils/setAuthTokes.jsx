import axios from 'axios';

/*
* We are doing it so that we have global header, and we send it with every request as soon as we get/have the token, 
* instead of choosing what request we want to send the token with
* So after setting the token, all the request will contain the token automatically
*/
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;