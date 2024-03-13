import React, { useEffect, useState, useContext } from "react";
import "reactjs-popup/dist/index.css"; // Import the CSS file
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import EditUserPopup from '../components/EditUserPopup.jsx';
import StudentPopup from "../components/CreateNewStudent.jsx"
// firebase imports
import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot
} from "@firebase/firestore";
import { firestore } from "../firebase.js";
import { userColumns, userRows } from "../styles/datasourceverifier.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// AG grid imports 
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { type } from "@testing-library/user-event/dist/type/index.js";
// AG grid imports end 

// TODO MAKE THE POPUP INTO A COMPONENT FOR IMPORT 


// 1. Ability to see Accounts available to them (accountComponent); 
//  - database for students should have: 
//      - accountName, password; projectStatus; department; ProjectID; canEdit; role; verifierID; ID; 
//  - database for verifier: 
//      - accountName, password; department; role; ID; listStudents; 
// 2. Add accounts
// 3. Delete accounts
// 4. View projects 
// 5. Accept projects
// 6. Add projects with comments


export const Verifer = () => {
    ModuleRegistry.registerModules([RowGroupingModule]);
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // maybe move to just the context so we don't need to import then created user var

    useEffect(() => {
        const fetchData = async () => {
            // BIGGGGGGGGGG TOODOOO 
            // WHEN STUDENTS ARE CREATED IT CHANGES THE GETAUTH.CURRENTUSER TO THE IDEA OF THE STUDENTS, 
            // IDEA: FOR THE CONTEXT SAVE THE AUTH AND CALL TO GET IT RATHER THAN CALLING IT HERE

            const user = getAuth().currentUser

            try {
                const snapShot = await getDocs(collection(firestore, "users"));
                let list = [];

                console.log("Current user: " + user.uid)

                await Promise.all(snapShot.docs.map(async (doc) => {
                    let userData = { id: doc.id, ...doc.data() };

                    console.log("Checked File: " + doc.id)

                    // checks if document is the TAs
                    if (doc.id === user.uid) {
                        const subcollectionSnapshot = await getDocs(collection(firestore, "users", doc.id, "students"));

                        subcollectionSnapshot.forEach((subDoc) => {
                            let studentData = { id: subDoc.id, ...subDoc.data() }
                            list.push(studentData);
                        });
                    }
                }));

                console.log(list)
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

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form data here

        // Close the pop-up after processing
        // You can add your logic to submit data or perform other actions here
    };

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


    return (
        <div className="main-background" id="outer-container">
            <div id="page-wrap">
                <h1 className="welcome-text">Welcome Verifier!</h1>
                {/* Add title for dropdowns */}
                <div className="dropdown-titles">
                    <h2 className="dropdown-title">Status</h2>
                </div>
                {/* End of title for dropdowns */}
                <div className="header">
                    <div className="dropdowns">
                        <select className="dropdown">
                            <option value="complete">Complete</option>
                            <option value="pending">Pending</option>
                            <option value="unsubmitted">Unsubmitted</option>
                            {/* Add options for roles */}
                        </select>
                    </div>
                    <div className="verifier-buttons">
                        {/* ADD STUDENT POPUP  */}
                        <StudentPopup />
                    </div>
                </div>


                <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
                    <AgGridReact
                        columnDefs={userColumns.concat(actionColumn)}
                        rowData={data}
                        animateRows={true}
                        suppressMovableColumns={true}
                    />
                </div>
            </div>
        </div>
    )
};
