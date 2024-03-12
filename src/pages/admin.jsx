import React, { useEffect, useState, useContext } from "react";
// import SideMenu from "../components/NavigationMenu";
import { DataGrid } from "@mui/x-data-grid";
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


export const Admin = () => {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

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
                id = {id}
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


    // probably can be exported to verifier
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        {/* Call handleEdit to render the EditUserPopup */}
                        {handleEdit(params.row.id)}
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
                    <div className="admin-buttons">
                        <VerifierPopup />
                        {<button style={{ position: 'relative' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: '50%', left: '97px', transform: 'translate(-50%, -50%)' }}>
                            <path fill="black" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                            </svg>Add Student 
                        </button>}

                        <button style={{ position: 'relative' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: '50%', left: '90px', transform: 'translate(-50%, -50%)' }}>
                            <path fill="black" d="M13.5 2c-5.288 0-9.649 3.914-10.377 9h-3.123l4 5.917 4-5.917h-2.847c.711-3.972 4.174-7 8.347-7 4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5c-3.015 0-5.662-1.583-7.171-3.957l-1.2 1.775c1.916 2.536 4.948 4.182 8.371 4.182 5.797 0 10.5-4.702 10.5-10.5s-4.703-10.5-10.5-10.5z"/>
                            </svg>Refresh
                        </button>
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
            </div>
        </div>
    );
};
