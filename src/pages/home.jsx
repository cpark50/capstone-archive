import React, { useState } from 'react';
import { firestore } from '../firebase';
import { addDoc, collection } from '@firebase/firestore';
import { uploadFile, departments } from '../firebaseUtils';
import moment from 'moment';

export default function Home() {
    const companyRef = React.useRef();
    const descriptionRef = React.useRef();
    const endDateRef = React.useRef();
    const nameRef = React.useRef();
    const startDateRef = React.useRef();
    const videoNameRef = React.useRef();
    const projectsRef = collection(firestore, 'projects');

    // Use States
    const [imageUpload, setImageUpload] = useState(null);
    const [logoUpload, setLogoUpload] = useState(null);
    const [otherDepartment, setOtherDepartment] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('Select Department');
    const [videoUpload, setVideoUpload] = useState(null);

    const handleDepartmentChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedDepartment(selectedValue);

        if (selectedValue === 'Other') {
            setOtherDepartment('');
        }
    };

    const handleOtherDepartmentChange = (e) => {
        setOtherDepartment(e.target.value);
    };

    const isOtherSelected = selectedDepartment === 'Other';

    // Function to handle save
    const handleSave = async (e) => {
        e.preventDefault();

        if (selectedDepartment === 'Select Department') {
            alert('Please select a department');
            return;
        }

        if (isOtherSelected && otherDepartment === '') {
            alert('Please enter the other department');
            return;
        }

        let selectedDepartmentValue = isOtherSelected ? otherDepartment : selectedDepartment;

        let data = {
            company: companyRef.current.value,
            startDate: moment(startDateRef.current.value).toDate(),
            endDate: moment(endDateRef.current.value).toDate(),
            department: selectedDepartmentValue,
            description: descriptionRef.current.value,
            name: nameRef.current.value,
            videoName: videoNameRef.current.value,
        }

        // Upload image
        if (imageUpload) {
            const imageUrl = await uploadFile(`images/${imageUpload.name}`, imageUpload);
            data = { ...data, imageURL: imageUrl };
        }

        // Upload logo
        if (logoUpload) {
            const logoUrl = await uploadFile(`logos/${logoUpload.name}`, logoUpload);
            data = { ...data, logoURL: logoUrl };
        }

        // Upload video
        if (videoUpload) {
            const videoUrl = await uploadFile(`videos/${videoUpload.name}`, videoUpload);
            data = { ...data, videoURL: videoUrl };
        }

        // Add data to firestore
        try {
            await addDoc(projectsRef, data);
            console.log('Document successfully written!');
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    };

    // HTML
    return (
        <div>

            <form onSubmit={handleSave}>
                <label>Enter Company Name</label>
                <input type="text" ref={companyRef}></input>

                <label>Start Date</label>
                <input type="date" ref={startDateRef}></input>

                <label>End Date</label>
                <input type="date" ref={endDateRef}></input>

                <label>Choose Department</label>
                <select value={selectedDepartment} onChange={handleDepartmentChange}>
                    {departments.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>

                {isOtherSelected && (
                    <div>
                        <label>Other Department</label>
                        <input type="text" value={otherDepartment} onChange={handleOtherDepartmentChange} />
                    </div>
                )}

                <label>Enter Description</label>
                <input type="text" ref={descriptionRef}></input>

                <label>Upload Image</label>
                <input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }}></input>

                <label>Upload Company Logo</label>
                <input type="file" onChange={(event) => { setLogoUpload(event.target.files[0]) }}></input>

                <label>Enter Project Name</label>
                <input type="text" ref={nameRef}></input>

                <label>Enter Video Name</label>
                <input type="text" ref={videoNameRef}></input>

                <label>Upload Video</label>
                <input type="file" onChange={(event) => { setVideoUpload(event.target.files[0]) }}></input>

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}