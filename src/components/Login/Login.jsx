import React, { useRef, useState } from 'react';
import './Login.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';

const Login = () => {
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [passFieldType, setPassFieldType] = useState(true);
    
    const emailRef = useRef();
    

    const auth = getAuth(app);

    const handleUserLogin = (event) => {
        event.preventDefault();
        setError("");

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                // Signed in 
                const loggedUser = result.user;
                setUser(loggedUser);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                setError(errorCode)
            });
    }

    const handleResetPassword = () => {
        const email = emailRef.current.value;
        setError("");

        if (!email) {
            alert('Please provide your email address to reset password')
            return;
        }
        
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Please check your email')
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
    }

    const handleShowPassword = () =>{
        setPassFieldType(!passFieldType)
    }
    
    return (
        <div className='d-flex justify-content-center'>
            <div className='w-75'>
                <h1>Please Login Here</h1>
                <Form onSubmit={handleUserLogin}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" ref={emailRef} name="email" placeholder="Enter email" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type={passFieldType? "password": "text"} name="password" placeholder="Password" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check onClick={handleShowPassword} type="checkbox" label="Show Password" />
                        <Form.Check type="checkbox" label="Remember Me" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
                <p>Forget password? Please <button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button></p>
                <p>New Here? Please <Link to="/register">Register</Link> </p>
                {user && <div>
                    <h4>Name: {user.displayName}</h4>
                    <p>Email: {user.email}</p>
                </div>}
                {error && <p className='text-danger'>{error}</p>}
            </div>
        </div>
    );
};

export default Login;