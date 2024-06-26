import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { addDoc, collection, doc, serverTimestamp, setDoc, getDocs, query } from 'firebase/firestore';
import { firestore } from "../firebase"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../pages/admin-styles.css';

// Create new Student Popup
const StudentPopup = () => {
    // Auth state
    const auth = getAuth()

    // Use States
    const [department, setDepartment] = useState('TEMP');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');

    const [details, setDetails] = useState({
        name: "0",
        password: "0",
        department: "0"
    });

    const handleChange = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value

        })
    }

    const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    // Generate Random user
    const generateUser = () => {
        let userLength = 12;
        let newUser = "";
        for (let i = 0; i < userLength; i++) {
            newUser += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        newUser += "@student.com"

        setUsername(newUser)

    }

    // Generate Random password
    const generatePassword = () => {
        let passwordLength = 6;
        let newPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        setPassword(newPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (department != "" && username != "" && password != "") {
            try {
                // Generate random username and password
                // Create user in Firebase Authentication
                // TURN BACK ON LATER< OFF FOR TESTING


                const taInfo = auth.currentUser.uid

                // Information for the account being created (student)
                const userCredential = await createUserWithEmailAndPassword(auth, username, password);
                const user = userCredential.user;


                // set Name to something else
                await setDoc(doc(firestore, `users/${taInfo}/students`, user.uid),
                    {
                        // generate new name in other document 
                        name: username,
                        associatedTAName: taInfo,
                        password: password,
                        role: "student",
                        department: department,
                        status: true,
                        projectStatus: "unsubmitted",
                        projectID: null,
                        studentUID: user.uid
                    });
                // Add user details to Firestore
            } catch (error) {
                console.log(error)
            }
            console.log("created")

        } else {
            console.log(department, username, password)
            // TODO: ADD POPUP SAYING WHAT IS MISSING 
        }
    };


    // HTML
    return (
        <Popup trigger={<button className='add-verifier'>Add Student</button>}
            modal closeOnDocumentClick>
            <div className="pop-up">
                <h2 className="popup-title" > Add New Student</h2>
                <form >
                    {/* Call on generate users button */}
                    <hr className="divider" />
                    <div>
                        <span class="generate-user-text">Generate User</span>
                        <hr className="divider" />
                        <button class="generate-user-btn" onClick={generateUser}>Generate User</button>
                    </div>
                    <div>
                        <span class="generate-passsword-text">Generate Password</span>
                        <hr className="divider" />
                        <button class="generate-password-btn" onClick={generatePassword}>Generate Password</button>
                    </div>
                    <div>
                        <label htmlFor="number" className="admin-page-label" >Number: </label>
                        <input
                            type="number"
                            id="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Enter a number"
                        />
                        <hr className="divider" />

                    </div>

                    <span class="create-verifier-text">Create Student</span>
                    <button type="submit" class="generate-verifier-btn" onClick={handleSubmit}>Create Student</button>
                </form>
                {/* <button type="submit">Close</button> */}
            </div>
        </Popup>
    );
};

export default StudentPopup;
