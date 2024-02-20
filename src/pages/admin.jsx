import React, { useState, useContext } from "react";
import SideMenu from "../components/NavigationMenu";
import "reactjs-popup/dist/index.css"; // Import the CSS file
import { AuthContext } from "../context/AuthContext";
import VerifierPopup from "../components/CreateNewVerifier.jsx"
import './admin-styles.css'; 

export const Admin = () => {

    return (
        <div className="main-background" id="outer-container">
            <div id="page-wrap">
                <h1 className="welcome-text">Welcome Admin!</h1>
                {/* Add title for dropdowns */}
                <div className="dropdown-titles">
                    <h2 className="dropdown-title">Role</h2>
                    <h2 className="dropdown-title2">Department</h2>
                </div>
                {/* End of title for dropdowns */}
                <div className="header">
                    <div className="dropdowns">
                        <select className="dropdown">
                            <option value="roles">All</option>
                            {/* Add options for roles */}
                        </select>
                        <select className="dropdown">
                            <option value="departments">All</option>
                            {/* Add options for departments */}
                        </select>
                    </div>
                    <div className="buttons">
                        <VerifierPopup />
                        <button className="add-student">Add Student</button>
                        <button className="refresh">Refresh</button>
                    </div>
                </div>
                <div className="bar">
                    <span className="email">Email</span>
                    <span className="password">Password</span>
                    <span className="role">Role</span>
                    <span className="department">Department</span>
                </div>
                <div className="scroll-box">
                    {/* Content here, this div will scroll if needed */}
                </div>
            </div>
        </div>
    );
};