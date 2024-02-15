import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    // TODO: store in local 
    currentUser: null, // FOR SOME REASON THIS IS ALWAYS GOING TO BE UNDEFINED AHHHHHHHH
    // TODO: Make sure important information is not show in the local 
    permissionLevel: JSON.parse(localStorage.getItem("user")) || null,
    accessLevel: JSON.parse(localStorage.getItem("permission")) || null

}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {

        localStorage.setItem("user", JSON.stringify(state.permissionLevel))
        localStorage.setItem("permission", JSON.stringify(state.accessLevel))

    }, [state.permissionLevel])

    return (
        <AuthContext.Provider value={{ permissionLevel: state.permissionLevel, currentUser: state.currentUser, accessLevel: state.accessLevel, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}