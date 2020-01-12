import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleWare = [thunk];
// rootReducer is coming from index.js file in the reducer folder. We don't need to specify index.js file
// if we just specify the folder, the code will automatically assume the import is defined in the index.js file

// createStore(reducer,initialStae,middleware) here we are passing middleware in a slightly different way
// composeWithDevTools allow us to use the redux dev tools
const store = createStore(rootReducer,initialState,composeWithDevTools(applyMiddleware(...middleWare)));

export default store;