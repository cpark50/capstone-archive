import React, { useState } from "react";
import Popup from "reactjs-popup";
import { updateDoc, doc } from "firebase/firestore";
import { firestore, updateUserEmail, updateUserPassword } from "../firebase";
import "../pages/admin-styles.css";

const EditUserPopup = ({ id, user, onSave, onClose }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditedUser({ ...editedUser, [name]: newValue });
  };

  // TODO: HandleSave should also change the info of the user's Email and Password on authentication side, I am working on this.

  const handleSave = async () => {
    updateUserEmail(id, editedUser.name);
    // updateUserPassword(id, editedUser.Password);
    await onSave(editedUser);
    onClose(); // Close the popup after saving
  };

  const handleClose = () => {
    onClose(); // Close the popup without saving
  };

  return (
    <Popup
      trigger={<button className="editButton">Edit</button>}
      modal
      closeOnDocumentClick
    >
      <div className="pop-up">
        <div className="popup-title">
          <h2>Edit User</h2>
          <button className="close-popup-btn" onClick={handleClose}> x </button>
        </div>

        <form onSubmit={handleSave}>
          <div id="input">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedUser.name}
              onChange={handleChange}
            />
          </div>
          <div id="input">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              value={editedUser.password}
              onChange={handleChange}
            />
          </div>
          <div id="input">
            <label htmlFor="role">Role: </label>
            <input
              type="text"
              id="role"
              name="role"
              value={editedUser.role}
              onChange={handleChange}
            />
          </div>
          <div id="input">
            <label htmlFor="department">Department: </label>
            <select
              id="department"
              name="department"
              value={editedUser.department}
              onChange={handleChange}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Informatics">Informatics</option>
            </select>
          </div>
          {/* <div>
                        <label htmlFor="department">Department: </label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={editedUser.department}
                            onChange={handleChange}
                        />
                    </div> */}

          <div id="input">
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
          <button className="save-btn" type="submit">
            Save
          </button>
        </form>
      </div>
    </Popup>
  );
};

export default EditUserPopup;
