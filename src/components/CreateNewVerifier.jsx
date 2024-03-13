import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { addDoc, collection, doc, serverTimestamp, setDoc, getDocs, query } from 'firebase/firestore';
import { firestore } from "../firebase"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../pages/admin-styles.css';
const VerifierPopup = () => {
    const auth = getAuth()
    const [department, setDepartment] = useState('');
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

    const generateUser = () => {
        let userLength = 12;
        let newUser = "";
        for (let i = 0; i < userLength; i++) {
            newUser += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        newUser += "@verifier.com"

        setUsername(newUser)

    }

    const generatePassword = () => {
        let passwordLength = 12;
        let newPassword = "";
        for (let i = 0; i < passwordLength; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        setPassword(newPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("creating")

        if (department != "" && username != "" && password != "") {
            try {


                // Information for the account being created (verifier)
                const userCredential = await createUserWithEmailAndPassword(auth, username, password);
                const user = userCredential.user;


                // Add user details to Firestore
                await setDoc(doc(firestore, "users", userCredential.user.uid), {
                    name: username,
                    password: password,
                    role: "verifier",
                    department: department,
                    status: true,
                    students: 0
                }).then(async function (docRef) {
                    await setDoc(doc(firestore, `users/${userCredential.user.uid}`), { associatedTAName: userCredential.user.uid }, { merge: true });

                });

            } catch (error) {
                console.log(error)
            }
            console.log("created")

        } else {
            console.log(department, username, password)
        }
    };


    return (
        <Popup trigger={<button className='add-verifier'>Add Verifier</button>}
            modal closeOnDocumentClick>
            <div className="pop-up">
                <h2 className="popup-title" > Add New Verifier</h2>
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
                        <label htmlFor="department">Department: </label>

                        <select
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Informatics">Informatics</option>
                        </select>
                        <hr className="divider" />
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

                    <span class="create-verifier-text">Create Verifier</span>
                    <button type="submit" class="generate-verifier-btn" onClick={handleSubmit}>Create Verifier</button>
                </form>
                {/* <button type="submit">Close</button> */}
            </div>
        </Popup>
    );
};

export default VerifierPopup;
