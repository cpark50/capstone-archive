import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from "../firebase"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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
        // for loop to add people
        // for the number of users generate random account name 
        // random password
        generateUser()
        generatePassword()
        // try statement 
        // add to auth 
        try {
            // TODO PUT BACK 
            const res = await createUserWithEmailAndPassword(
                auth, username, password
            )
            await addDoc(collection(firestore, "users"), {
                name: username,
                password: password,
                role: "verifier",
                department: department,
            });
            // add to collections 

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Popup trigger={<button>Create New Verifier</button>} modal closeOnDocumentClick>
            <div className="pop-up">
                <h2>New Verifier</h2>
                <form onSubmit={handleSubmit}>
                    {/* Call on generate users button */}
                    <div>
                        <button onClick={generateUser}>Generate User</button>
                    </div>
                    <div>
                        <button onClick={generatePassword}>Generate Password</button>
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
                    </div>
                    <div>
                        <label htmlFor="number">Number: </label>
                        <input
                            type="number"
                            id="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>


                    <button type="submit">Create Verifier</button>
                </form>
                <button type="submit">Close</button>
            </div>
        </Popup>
    );
};

export default VerifierPopup;
