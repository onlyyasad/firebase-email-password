import React, { useState } from 'react';
import './Register.css';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("")
    const auth = getAuth(app);

    const handleSubmitForm = (event) =>{
        event.preventDefault();
        setError("")
        setSuccess("")
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const regEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if(!regEx.test(password)){
            setError("Please use at least a number, and at least a special character");
            return;
        }
        console.log(email, password)

        createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser);
            form.reset();
            setSuccess("Successfully Registered!");
            updateUserData(loggedUser, name);
            emailVerification(loggedUser)
        })
        .catch(error => {
            console.error(error.message)
            setError(error.message)
        })

        const updateUserData = (user, name) =>{
            updateProfile(user, {
                displayName: name
            })
            .then(() =>{
                console.log("User Name Updated!")
            } )
            .catch(error => console.log(error.message))
        }

        const emailVerification = (user) =>{
            sendEmailVerification(user)
            .then(result =>{
                console.log(result);
                alert("Please verify your email")
            })
        }
    }
    return (
        <div className='register-form d-flex flex-column justify-content-center'>
            <h1>Please Register Here!!</h1>
            <form onSubmit={handleSubmitForm}>
                <input className='p-2 mt-2' type="text" name="name" id="name" placeholder='Your Name' required/>
                <br />
                <input className='p-2' type="email" name="email" id="email" placeholder='Your Email' required/>
                <br />
                <input className='p-2' type="password" name="password" id="password" placeholder='Your Password' required/>
                <br />
                <button className='btn btn-primary mb-2' type="submit">Register</button>
                <p>Already have an account? Please <Link to="/login">Login</Link> </p>
            </form>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Register;