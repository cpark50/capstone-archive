import React, { useContext, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import ProjectView from "./ProjectView";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import './login-styles.css'; 


export const Login = () => {

    // const params = useParams();
    let navigatePage = "/"

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const { dispatch } = useContext(AuthContext)


// It will submit the user&password to login
    const handlelogin = (e) => {
        e.preventDefault();

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
            // TODO: make changes to the UI for these console logs 
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
            <button id="LoginButton" onClick={handlelogin}>SIGN IN</button>
        </div >


    )
}

export const Logout = () => {
// TODO: Navigate to ProjectView
// TODO: Reset permissionLevel, accessLevel in AuthContext.
// TODO: What is LOGOUT in AuthReducer???

}