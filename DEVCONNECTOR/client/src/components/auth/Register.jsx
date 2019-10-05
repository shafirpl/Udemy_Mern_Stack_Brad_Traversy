import React from 'react';
import {useState} from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const handleSubmit =async e => {
        e.preventDefault();
        if(password !== password2){
            console.log("Passwords do not match");
        } else {

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
        };
    }

    const handleOnChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const {name, email, password, password2} = formData;
    return (
        <div>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => handleSubmit(e)}>
                <div className="form-group">
                    <input 
                        type="text"
                        placeholder="Name" 
                        name="name" 
                        required 
                        value = {name}
                        onChange = {e => handleOnChange(e)} />
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        onChange={e => handleOnChange(e)}
                        value = {email}/>
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        onChange={e => handleOnChange(e)}
                        value = {password}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        onChange={e => handleOnChange(e)}
                        value = {password2}
                    />
                </div>
                <input  
                    type="submit" 
                    className="btn btn-primary" 
                    value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </div>
    )
}

export default Register
