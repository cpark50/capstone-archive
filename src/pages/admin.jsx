import React, { useEffect, useState, useContext } from "react";
import "reactjs-popup/dist/index.css"; // Import the CSS file
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import EditUserPopup from '../components/EditUserPopup.jsx';
import VerifierPopup from "../components/CreateNewVerifier.jsx"

// firebase imports
import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot
} from "@firebase/firestore";
// Note: deleteUserAuth does not work due to constraints of firebase, look into alternatives or just archive accounts 
import { firestore, deleteUserAuth } from "../firebase.js";
import { userColumns, userRows } from "../styles/datasource.js";
// firebase imports end


// AG grid imports 
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { type } from "@testing-library/user-event/dist/type/index.js";
// AG grid imports end 





export const Admin = () => {
    ModuleRegistry.registerModules([RowGroupingModule]);

    // Use States
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [collapsed, setCollapsed] = useState(false)

    // Function to load user accounds
    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapShot = await getDocs(collection(firestore, "users"));
                let list = [];

                await Promise.all(snapShot.docs.map(async (doc) => {
                    let userData = { id: doc.id, ...doc.data() };
                    list.push(userData);

                    const subcollectionSnapshot = await getDocs(collection(firestore, "users", doc.id, "students"));

                    subcollectionSnapshot.forEach((subDoc) => {
                        let studentData = { id: subDoc.id, ...subDoc.data() }
                        list.push(studentData);
                    });
                }));

                setData(list);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const unsub = onSnapshot(collection(firestore, "users"), fetchData);

        return () => {
            unsub();
        };
    }, []);

    // Function to handle deletion of user
    const handleDelete = async (id) => {

        try {
            const confirmation = window.confirm("Are you sure you want to delete this user?");
            if (confirmation) {
                console.log("Deleting user from Firestore:", id);
                await deleteDoc(doc(firestore, "users", id));

                console.log("Deleting user from Firebase Authentication:", id);
                await deleteUserAuth(id); // Calling deleteUserAuth function to delete user from Firebase Authentication

                setData(data.filter((item) => item.id !== id));
                console.log("User successfully deleted:", id);
            }
        } catch (err) {
            console.log("Error deleting user:", err);
        }
    };


    // Function to handle edit of user
    const handleEdit = (id) => {
        const userToEdit = data.find(user => user.id === id);
        setSelectedUser(userToEdit);
        return (
            <EditUserPopup
                id={id}
                user={userToEdit}
                onSave={handleSaveEdit}
                onClose={handleCloseEdit}
            />
        );
    };


    // Function to save edit
    const handleSaveEdit = async (editedUser) => {
        try {
            await updateDoc(doc(firestore, "users", editedUser.id), editedUser);
            console.log("User updated successfully:", editedUser);
            setSelectedUser(null);
        } catch (error) {
            console.log("Error updating user:", error);
        }
    };

    const handleCloseEdit = () => {
        setSelectedUser(null);
    };

    // code to handle expansion dropdown 
    const handleExpand = () => {
        if (!collapsed) {

        }

    };

    // Function to load actions per user
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            cellRenderer: (params) => {
                try {

                    const id = params.data.id;

                    // Check if the 'id' exists
                    const showActionColumn = id !== undefined;
                    return (
                        <div className="cellAction">
                            {/* Call handleEdit to render the EditUserPopup */}
                            {/* {handleEdit(params.data.id)} */}
                            <div
                                className="deleteButton"

                                onClick={() => handleDelete(params.data.id)}
                            >
                                Delete
                            </div>
                        </div>
                    );
                } catch (error) {
                    return ''
                }

            },

        },
    ];

    // HTML
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
                    <div className="admin-buttons">
                        <VerifierPopup />

                        <button style={{ position: 'relative' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: '50%', left: '90px', transform: 'translate(-50%, -50%)' }}>
                                <path fill="black" d="M13.5 2c-5.288 0-9.649 3.914-10.377 9h-3.123l4 5.917 4-5.917h-2.847c.711-3.972 4.174-7 8.347-7 4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5c-3.015 0-5.662-1.583-7.171-3.957l-1.2 1.775c1.916 2.536 4.948 4.182 8.371 4.182 5.797 0 10.5-4.702 10.5-10.5s-4.703-10.5-10.5-10.5z" />
                            </svg>Refresh
                        </button>
                    </div>
                </div>

                {/* start of section for the user display */}
                <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
                    <AgGridReact
                        columnDefs={userColumns.concat(actionColumn)}
                        rowData={data}
                        animateRows={true}
                        suppressMovableColumns={true}
                        enableCellTextSelection={true}
                    />
                </div>
                {/* end of user display  */}
            </div>
        </div>
    );
};
