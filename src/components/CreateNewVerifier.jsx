import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from "../firebase"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../pages/admin-styles.css';

const VerifierPopup = () => {
    const auth = getAuth()
    const [department, setDepartment] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');

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
    
        try {
            // Generate random username and password
            generateUser();
            generatePassword();
    
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;
    
            // Add user details to Firestore
            await addDoc(collection(firestore, "users"), {
                name: username,
                password: password,
                role: "verifier",
                department: department,
                status: true,
                students: 0
            });
            // add to collections 

        } catch (error) {
            console.log(error)
        }
    };
    

    return (
        <Popup trigger=  {<button style={{ position: 'relative' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: '50%', left: '95px', transform: 'translate(-50%, -50%)' }}>
        <path fill="black" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </svg>Add Verifier </button>}
         modal closeOnDocumentClick>
            <div className="pop-up">
                <h2 className = "popup-add" > Add New Verifier</h2>
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="department" >Department: </label>
                
                        <select
                            className = "admin-department-add"
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
                        <label htmlFor="number" className = "admin-page-label" >Number: </label>
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
                    <button type="submit" class="generate-verifier-btn">Create Verifier</button>
                </form>
                {/* <button type="submit">Close</button> */}
            </div>
        </Popup>
    );
};

export default VerifierPopup;
