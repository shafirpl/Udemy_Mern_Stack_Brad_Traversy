import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleWare = [thunk];

// createStore(reducer,initialStae,middleware) here we are passing middleware in a slightly different way
const store = createStore(rootReducer,initialState,composeWithDevTools(applyMiddleware(...middleWare)));

export default store;