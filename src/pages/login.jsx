import React, { useContext, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";


export const Login = () => {

    // const params = useParams();

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

    const handlelogin = (e) => {
        e.preventDefault();

        if (email && password) {

            const auth = getAuth();

            signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                // Signed in 
                let navigatePage = "/"
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
            <h1>Login</h1>
            <div id="login-email">
                <label htmlFor="email">Email:</label>
                <input type="email"
                    id="email"
                    className="email"
                    value={email}
                    onChange={handleEmailChange}
                />
            </div>
            <div id="login-password">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    className="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>
            <button onClick={handlelogin}>Login</button>
        </div >


    )
}

