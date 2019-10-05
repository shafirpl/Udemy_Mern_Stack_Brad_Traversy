import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
// import axios from 'axios';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async e => {
        e.preventDefault();
        console.log("Success");

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

export default Login
