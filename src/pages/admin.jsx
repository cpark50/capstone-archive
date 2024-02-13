import React, { useState, useContext } from "react";
import SideMenu from "../components/NavigationMenu";
import "reactjs-popup/dist/index.css"; // Import the CSS file
import { AuthContext } from "../context/AuthContext";
import VerifierPopup from "../components/CreateNewVerifier.jsx"

export const Admin = () => {

    return (
        <div className="main" id="outer-container">
            <div id="page-wrap">
                <h1>Admin Page</h1>
                <VerifierPopup />


            </div>
        </div>
    );
};
