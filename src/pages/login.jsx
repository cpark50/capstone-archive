import React, { useContext, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import './login-styles.css'; 


export const Login = () => {

    // const params = useParams();
    let navigatePage = "/"

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Add a state to store error messages
    const navigate = useNavigate();


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage(""); // Clear error message when user starts typing

    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage(""); // Clear error message when user starts typing
    };

    const { dispatch } = useContext(AuthContext)



    const handlelogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage("Email or password cannot be empty"); // Update error message state
            return;
        }



        if (email && password) {

            const auth = getAuth();

            signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                // Signed in 
                let permissionLevel = -1;
                const userCheck = auth.currentUser.email;
                const user = userCredential.user;
                // checking the user permissions based on domain end
                if (userCheck.endsWith("student.com")) {
                    navigatePage = "/studentpage"
                    permissionLevel = 0
                } else if (userCheck.endsWith("verifier.com")) {
                    navigatePage = "/verifierpage"
                    permissionLevel = 1
                } else if (userCheck.endsWith("admin.com")) {
                    navigatePage = "/adminpage"
                    permissionLevel = 2
                }

                // Set context for app
                // dispatch({ type: "MAINLOGIN", payload: user })

                dispatch({ type: "MAINLOGIN", payload: user })

                dispatch({ type: "PERMISSION_LEVEL", payload: user })

                // Navigate to different page depending on the user. 
                navigate(navigatePage)

            })
                .catch((error) => {
                    console.log("NOT WORK")
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(`Login failed: ${errorCode} ${errorMessage}`);
                });
        } else {
            console.log("Email or password cannot be empty")
        }


    }


    return (

        <div className="LoginForm">
            <div id="uci-text">UCI</div>
            <div id="capstone-text">CAPSTONE</div>
            <div id="achive-text">ARCHIVE</div>
            <h1 id="LoginTitle">Welcome!</h1>
            <p id="SignInSubtitle">Sign in to explore more.</p>

            <div>
                <label for="login-email">UCI Email</label>
                <input type="email"
                    id="login-email"
                    placeholder="Example@uci.edu"
                    value={email}
                    onChange={handleEmailChange}
                />
            </div>
            <div>
                <label for="login-password">Password</label>
                <input type="password"
                    id="login-password"
                    placeholder="Password"
                    className="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button id="LoginButton" onClick={handlelogin}>SIGN IN</button>
        </div >


    )
}

