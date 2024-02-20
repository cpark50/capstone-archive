import React, { useEffect, useState, useContext } from "react";
// import SideMenu from "../components/NavigationMenu";
import { DataGrid } from "@mui/x-data-grid";
import "reactjs-popup/dist/index.css"; // Import the CSS file
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

import VerifierPopup from "../components/CreateNewVerifier.jsx"
import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot
} from "@firebase/firestore";
import { firestore } from "../firebase.js";
import { userColumns, userRows } from "../styles/datasource.js";


export const Admin = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(firestore, "users"),
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setData(list);
            },
            (error) => {
                console.log(error);
            }
        );

        return () => {
            unsub();
        };
    }, []);

    // probably can be exported to verifier, similiar functionality with id deletion
    const handleDelete = async (id) => {
        // firebase deletion of users
        // TODO ADD SECOND CHECK ON DELETION FOR SINGLE USERS AND MULTI USER SELECT
        // TODO DELETE THE ASSOCIATED LOGIN ACCOUNT ASWELL 
        try {
            await deleteDoc(doc(firestore, "users", id));
            setData(data.filter((item) => item.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    // probably can be exported to verifier

    const handleEdit = async (id) => {
        // firebase editing of both the FIRESTORE for stored user information and FIREBASE AUTH for valid login

        // 1. set default params
        // 2. Make changes to params in external popup window
        // 3. Set variables in firestore to those params
        try {
            // TODO ADD POPUP FOR THE EDITING OF POTENTIALLY PASSWORDS, EMAILS, DEPARTMENT, ETC
            await updateDoc(doc(firestore, "users", id), { name: "edittest@verifier.com" });
            console.log("name changes")
        } catch (err) {
            console.log(err);
        }
    };

    // probably can be exported to verifier
    const actionColumn = [
        // Any actions regarding each user should go here 
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        {/* <Link to="/users/test" style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link> */}
                        <div
                            className="editButton"
                            onClick={() => handleEdit(params.row.id)}
                        >
                            Edit
                        </div>
                        <div
                            className="deleteButton"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            Delete
                        </div>

                    </div>
                );
            },
        },
    ];


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
                    <div className="datatable">
                        <DataGrid
                            className="datagrid"
                            rows={data}
                            columns={userColumns.concat(actionColumn)}
                            pageSize={9}
                            rowsPerPageOptions={[9]}
                            checkboxSelection
                        />
                    </div>


                </div>
                <div className="scroll-box">
                    {/* Content here, this div will scroll if needed */}
                </div>
            </div>
        </div>
    );
};