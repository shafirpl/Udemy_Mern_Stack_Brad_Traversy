import React from 'react';
import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
//import { setAlert } from "../../actions/alert.jsx";
import PropTypes from "prop-types";
import { login } from '../../actions/auth.jsx';
// import axios from 'axios';

// here we are just destructuring so we don't need to use props.login
// this is similar to {login} = props
// we could do something like const Login = (props)
// then login = props.login, isAuthenticated = props.isAuthenticated etc
// look at the last line, I wrote comment how I have access to isAuthenticated
const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async e => {
        e.preventDefault();
        // console.log("Success");
        login(email, password);

        /*
        * the commented section is simpler way to register an user without using redux
        */
        /*
        * this is equivalent of doing name: name, email:email etc
        */
        // const newUser = {
        //     name,
        //     email,
        //     password
        // }
        // try {
        //     const config = {
        //         headers:{
        //             'Content-Type': 'application/json',
        //         }    
        //     }
        //     const body = JSON.stringify(newUser);
        //     // since we added proxy in package.json file in the client folder, we don't need to 
        //     // add localhost:5000
        //     const res = await axios.post('/api/users', body, config);
        //     console.log(res.data);

        // } catch (error) {
        //     console.error(error.response.data);
        // }
    }

    const handleOnChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const { email, password } = formData;

    //Redirect if logged in
    if (isAuthenticated) {
        return <Redirect to="/dashboard" />
    }
    return (
        <div>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={e => handleSubmit(e)}>
                <div className="form-group">
                    <input
                        required
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        onChange={e => handleOnChange(e)}
                        value={email} />
                </div>
                <div className="form-group">
                    <input
                        required
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        onChange={e => handleOnChange(e)}
                        value={password}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Sign In" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign In</Link>
            </p>
        </div>
    )
}

/*
* https://reactjs.org/docs/typechecking-with-proptypes.html
* we are using it as a type checking thing. It is not essential but it helps to reduce bugs
*/

Login.prototype = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

// kind of assume that what we pass in the first argument of connect, it will receive the existing state whenever
// the state gets updated

/*
* We use () in an arrow function to return an object without using the return keyword, however, if we want, we could
* do something like this
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};
*/

const mapStateToProps = state => (
    {isAuthenticated: state.auth.isAuthenticated}
);


/* we are connecting this component to the redux
* this is for redux
* Connect takes two arguments in the first (), the state and
* Second argument is any action we want to use that we imported from action files
* This will allow us to acces props.login
* Also it will allow us to access isAuthenticated, or whatever mapStateToProps function returns
*/

export default connect(mapStateToProps, { login })(Login)
