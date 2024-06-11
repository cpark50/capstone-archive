import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

// Authentication State
const INITIAL_STATE = {
    currentUser: null, // FOR SOME REASON THIS IS ALWAYS GOING TO BE UNDEFINED AHHHHHHHH
    permissionLevel: JSON.parse(localStorage.getItem("user")) || null,
    accessLevel: JSON.parse(localStorage.getItem("permission")) || null,
    uid: JSON.parse(localStorage.getItem("uid")) || null

}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {

        localStorage.setItem("user", JSON.stringify(state.permissionLevel))
        localStorage.setItem("permission", JSON.stringify(state.accessLevel))
        localStorage.setItem("uid", JSON.stringify(state.uid))



    }, [state.permissionLevel])

    return (
        <AuthContext.Provider value={{ permissionLevel: state.permissionLevel, currentUser: state.currentUser, accessLevel: state.accessLevel, uid: state.uid, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}