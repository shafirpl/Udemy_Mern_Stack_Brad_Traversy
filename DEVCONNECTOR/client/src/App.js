import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Landing from './components/layout/Landing.jsx';
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';
import Alert from './components/layout/Alert.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import CreateProfile from './components/profile-forms/CreateProfile.jsx';
import { loadUser } from './actions/auth.jsx';
import PrivateRoute from './components/routing/PrivateRoute.jsx';
// import setAuthToken from './utils/setAuthTokes';
import EditProfile from "./components/profile-forms/EditProfile.jsx";
import AddExperience from "./components/profile-forms/AddExperience.jsx";
import AddEducation from "./components/profile-forms/AddEducation.jsx";
import Profile from './components/profile/Profile.jsx';
import Profiles from "./components/profiles/Profiles.jsx";
import Posts from './components/posts/Posts.jsx';
import Post from './components/post/Post.jsx';


// this imports are for redux, we need 2 stuff, a provider and the store file

import { Provider } from 'react-redux';
import store from './store.jsx';

import './App.css';

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
    store.dispatch(loadUser())
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profile/:id" component={Profile} />
              <Route exact path="/profiles" component={Profiles} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute exact path="/post/:id" component={Post} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
