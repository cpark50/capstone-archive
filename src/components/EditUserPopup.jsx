import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from "../firebase";
import '../pages/admin-styles.css';

const EditUserPopup = ({ user, onSave, onClose }) => {
    const [editedUser, setEditedUser] = useState(user);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setEditedUser({ ...editedUser, [name]: newValue });
    };

    const handleSave = async () => {
        await onSave(editedUser);
        onClose(); // Close the popup after saving
    };

    const handleClose = () => {
        onClose(); // Close the popup without saving
    };

    return (
        <Popup trigger={<button className='edit-user'>Edit User</button>} modal closeOnDocumentClick>
            <div className="pop-up">
                <h2>Edit User</h2>
                <form onSubmit={handleSave}>
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editedUser.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={editedUser.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="role">Role: </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={editedUser.role}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="department">Department: </label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={editedUser.department}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Status: </label>
                        <input
                            type="checkbox"
                            id="status"
                            name="status"
                            checked={editedUser.status}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Add more fields for other user information */}
                    <button type="submit">Save</button>
                </form>
                <button onClick={handleClose}>Close</button>
            </div>
        </Popup>
    );
};

export default EditUserPopup;
