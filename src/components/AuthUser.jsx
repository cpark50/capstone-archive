import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";



// Returns Athentication State
const AuthUser = () => {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
                console.log("LOGGED IN")
            } else {
                setAuthUser(null);
            }
        });
    }, [])
    return (
        <div>{authUser ? <p> Signed In</p> : <p>Signed Out</p>}</div>
    )
}

export default AuthUser;