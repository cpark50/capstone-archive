import React, { useEffect, useState, useContext } from "react";
// import SideMenu from "../components/NavigationMenu";
// import { DataGrid } from "@mui/x-data-grid";


import "reactjs-popup/dist/index.css"; // Import the CSS file
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import EditUserPopup from '../components/EditUserPopup.jsx';
import VerifierPopup from "../components/CreateNewVerifier.jsx"

import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot
} from "@firebase/firestore";
import { firestore, deleteUserAuth } from "../firebase.js";
import { userColumns, userRows } from "../styles/datasource.js";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
// import { ModuleRegistry } from '@ag-grid-community';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';

// test 
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";




export const Admin = () => {
    ModuleRegistry.registerModules([RowGroupingModule]);

    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [collapsed, setCollapsed] = useState(false)

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
    // TODOS: 
    // 1: Ask for confirmation, DONE
    // 2: Delete user from firebase, DONE
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


    const handleEdit = (id) => {
        const userToEdit = data.find(user => user.id === id);
        setSelectedUser(userToEdit);
        // Instead of rendering the popup conditionally in the return statement,
        // you can directly return it here based on the selected user
        return (
            <EditUserPopup
                id={id}
                user={userToEdit}
                onSave={handleSaveEdit}
                onClose={handleCloseEdit}
            />
        );
    };


    const handleSaveEdit = async (editedUser) => {
        try {
            // Update Firestore document with edited user data
            await updateDoc(doc(firestore, "users", editedUser.id), editedUser);
            console.log("User updated successfully:", editedUser);
            // Close the popup
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

    // probably can be exported to verifier
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            cellRenderer: (params) => {
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
                        <div
                            className="expandButton"
                            onClick={() => setCollapsed(!collapsed)}>
                            {handleExpand}
                            Expand
                        </div>
                    </div>
                );
            },
        },
    ];

    // const StudentDropdown = ({ value }) => {


    // 

    // const StudentDropdown = () => {
    //     // Render a simple dropdown for each teacher's students
    //     return (
    //         <select>
    //             {value.map((student, index) => (
    //                 <option key={index}>{student}</option>
    //             ))}
    //         </select>
    //     );
    // };

    // const gridOptions = {
    //     treeData: true,

    //     // other grid options ...
    // }

    const getDataPath = (data) => {
        return data.order;
    }

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
                {/* <div className="bar">
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
                </div> */}

                <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
                    <AgGridReact
                        columnDefs={userColumns.concat(actionColumn)}
                        rowData={data}
                        animateRows={true}
                        suppressMovableColumns={true}
                        // gridOptions={gridOptions}
                        getDataPath={getDataPath(data)}


                    // need to access the collection, then render the data 
                    // 1. when render the row get the collection and store in a value
                    // 2. 
                    />
                </div>

            </div>
        </div>
    );
};
