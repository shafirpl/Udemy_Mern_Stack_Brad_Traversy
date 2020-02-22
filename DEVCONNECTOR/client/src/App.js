import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Landing from "./components/layout/Landing.jsx";
import Routes from "./components/routing/Routes.jsx";
import { loadUser } from "./actions/auth.jsx";

// this imports are for redux, we need 2 stuff, a provider and the store file

import { Provider } from "react-redux";
import store from "./store.jsx";

import "./App.css";

// if (localStorage.token) {
//   // setting up the global header token, why we are doing it? look at the file this function was
//   // imported from
//   setAuthToken(localStorage.token);
// }

// watch from 11:08
// https://www.udemy.com/course/mern-stack-front-to-back/learn/lecture/14555612?start=0#overview
// for the useEffect part why we have empty bracket
// Look up useEffect documentation, so basically it will runevery time any component gets updated,
// so we dispatch the loaduser, which sets ups the global token and adds it automatically to every request
//
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          {/* we had an issue with page not found component,
          https://www.udemy.com/course/mern-stack-front-to-back/learn/lecture/14555836#questions
          So in order to fix this, we decided to move all the routes/components to 
          a different file, it also cleans up the app.js file as well */}
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
