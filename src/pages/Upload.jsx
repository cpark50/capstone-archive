import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { addDoc, collection, getDocs } from '@firebase/firestore';
import { getSchoolYears, uploadFile, departments, quarters } from '../firebaseUtils';
import { FormItem } from '../components/FormItem';
import { useNavigate } from 'react-router-dom';


export const Upload = () => {
    // Refs for form inputs
    const refs = {
        award: React.useRef(),
        companyURL: React.useRef(),
        course: React.useRef(),
        courseLevel: React.useRef(),
        description: React.useRef(),
        faculty: React.useRef(),
        liasons: React.useRef(),
        misc: React.useRef(),
        projectName: React.useRef(),
        poster: React.useRef(),
        slide: React.useRef(),
        summary: React.useRef(),
        teamMembers: React.useRef(),
        videoName: React.useRef()
    };

    // Firestore collections
    const projectsRef = collection(firestore, 'projects');
    const companiesRef = collection(firestore, 'companies');

    // State variables
    const [companies, setCompanies] = useState([]);
    const [isFormValid, setIsFormValid] = useState(true);
    const [state, setState] = useState({
        awardChecked: false,
        endQuarter: 'Fall',
        programlevel: 'Grad',
        imageUpload: null,
        level: 'Undergrad',
        logoUpload: null,
        otherCompany: '',
        otherDepartment: '',
        pendingVerification: true,
        selectedCompany: 'Select Company',
        selectedDepartment: 'Select Department',
        selectedYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        startQuarter: 'Fall',
        verified: false,
        videoUpload: null
    });

    // Fetch companies from Firestore on component mount
    useEffect(() => {
        const fetchCompanies = async () => {
            const querySnapshot = await getDocs(companiesRef);
            const companiesData = [];
            querySnapshot.forEach((doc) => {
                companiesData.push({
                    id: doc.id,
                    companyName: doc.data().companyName,
                    logoURL: doc.data().logoURL,
                    companyURL: doc.data().companyURL,
                });
            });
            setCompanies(companiesData);
        };

        fetchCompanies();
    }, []);

    // Event handler for department change
    const handleDepartmentChange = (e) => {
        const selectedValue = e.target.value;
        setState(prevState => ({ ...prevState, selectedDepartment: selectedValue }));

        if (selectedValue === 'Other') {
            setState(prevState => ({ ...prevState, otherDepartment: '' }));
        }
    };
    // Event handler for other department change
    const handleOtherDepartmentChange = (e) => {
        setState(prevState => ({ ...prevState, otherDepartment: e.target.value }));
    };

    // Event handler for company change
    const handleCompanyChange = (e) => {
        const selectedValue = e.target.value;
        const selectedCompany = companies.find(company => company.companyName === selectedValue);
        setState(prevState => ({ ...prevState, selectedCompany: selectedCompany ? selectedCompany.id : selectedValue }));

        if (selectedValue === 'Add New Company') {
            setState(prevState => ({ ...prevState, otherCompany: '' }));
        } else {
            setState(prevState => ({ ...prevState, selectedCompany: selectedValue, otherCompany: '' }));
        }
    };

    // Event handler for other company change
    const handleOtherCompanyChange = (e) => {
        setState(prevState => ({ ...prevState, otherCompany: e.target.value }));
    };

    // Check if the selected department/company is 'Other'
    const isOtherDeptSelected = state.selectedDepartment === 'Other';
    const isOtherCompSelected = state.selectedCompany === 'Add New Company';

    const navigate = useNavigate();

    // Event handler for form submission
    const handleSave = async (e) => {
        e.preventDefault();
        let isValid = true; //If the form is valid
        //Check all the input
        const requiredFields = [
            refs.projectName.current.value,
            refs.summary.current.value,
            refs.description.current.value,
            refs.teamMembers.current.value,
            refs.course.current.value,
            refs.faculty.current.value,
            refs.liasons.current.value,
            (state.selectedDepartment !== 'Select Department'),
            (state.selectedCompany !== 'Select Company'),
            (isOtherDeptSelected ? state.otherDepartment : true),
            (isOtherCompSelected ? state.otherCompany : true),
        ];
        if (requiredFields.some(field => !field)) {
            isValid = false;
        }
        setIsFormValid(isValid);

        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Check if the company with the same name already exists
        const existingCompany = companies.find(company => company.companyName === state.otherCompany);

        if (existingCompany) {
            alert('Company with this name already exists. Please choose a different name.');
            return;
        }

        // Logic for handling company data
        let selectedDepartmentValue = isOtherDeptSelected ? state.otherDepartment : state.selectedDepartment;
        let selectedCompanyValue = isOtherCompSelected ? state.otherCompany : state.selectedCompany;
        let companyData = {};
        let logoUrl = '';

        if (state.logoUpload) {
            logoUrl = await uploadFile(`logos/${state.logoUpload.name}`, state.logoUpload);
        }

        // Logic for handling data when adding a new company
        if (isOtherCompSelected) {
            companyData = {
                companyName: state.otherCompany,
                logoURL: logoUrl,
                companyURL: refs.companyURL.current.value
            };

            // Check if the company with the same name already exists (double-check)
            const existingCompany = companies.find(company => company.companyName === state.otherCompany);

            if (existingCompany) {
                alert('Company with this name already exists. Please choose a different name.');
                return;
            }

            const docRef = await addDoc(companiesRef, companyData);
            console.log('Company Added');
            selectedCompanyValue = docRef.id;
        } else {
            // Logic for handling data when selecting an existing company
            const selectedCompany = companies.find(company => company.companyName === selectedCompanyValue);
            companyData = selectedCompany;
            console.log('Company: ', companyData);
            selectedCompanyValue = companyData.id;
        }

        // Data that will be submitted into the database
        let data = {
            companyID: selectedCompanyValue,
            companyName: companyData.companyName,
            companyURL: companyData.companyURL,
            course: refs.course.current.value,
            department: selectedDepartmentValue,
            description: refs.description.current.value,
            endQuarter: state.endQuarter,
            programlevel: state.programlevel,
            faculty: refs.faculty.current.value,
            level: state.level,
            liasons: refs.liasons.current.value,
            logoURL: companyData.logoURL,
            misc: refs.misc.current.value,
            pendingVerification: state.pendingVerification,
            poster: refs.poster.current.value,
            projectName: refs.projectName.current.value,
            schoolYear: state.selectedYear,
            slide: refs.slide.current.value,
            startQuarter: state.startQuarter,
            summary: refs.summary.current.value,
            teamMembers: refs.teamMembers.current.value,
            verified: state.verified,
            videoName: refs.videoName.current.value
        }

        // Award checkbox
        if (state.awardChecked) {
            data.award = refs.award.current.value;
        }

        // Upload image
        if (state.imageUpload) {
            const imageUrl = await uploadFile(`images/${state.imageUpload.name}`, state.imageUpload);
            data = { ...data, imageURL: imageUrl };
        }

        // Upload video
        if (state.videoUpload) {
            const videoUrl = await uploadFile(`videos/${state.videoUpload.name}`, state.videoUpload);
            data = { ...data, videoURL: videoUrl };
        }

        // Add data to firestore
        try {
            await addDoc(projectsRef, data);
            console.log('Document successfully written!');
            navigate('/thankYou');
        } catch (error) {
            console.error('Error writing document:', error);
        }
    };
    return (
        <div className="flex flex-row justify-center items-start min-h-screen space-x-4">
            <div className="flex flex-col items-center justify-center space-y-4">
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
                    {/*Project Information*/}
                    <div className="flex flex-col space-y-4">
                        <h1 style={{ color: '#79B7FF' }} className=' font-extrabold text-2xl'>Project Information</h1>

                        <FormItem label="Project Title" required>
                            <input type="text" ref={refs.projectName} className="border rounded px-2 py-1" maxLength={50}></input>
                        </FormItem>

                        <FormItem label="Project Summary" tooltip="Write a short description of your project!" required>
                            <textarea ref={refs.summary} className="border rounded px-2 py-1 h-20" placeholder='Write a short description of your project!' maxLength={200}></textarea>
                        </FormItem>

                        <FormItem label="Project Description" tooltip="Write a detailed description of your project!" required>
                            <textarea ref={refs.description} className="border rounded px-2 py-1 h-20" placeholder='Write a detailed description of your project!' maxLength={500}></textarea>
                        </FormItem>

                        <FormItem label="Team Members" tooltip="Separate names by comma" required>
                            <textarea ref={refs.teamMembers} className="border rounded px-2 py-1 h-20" placeholder='John Doe, Sarah Davis, etc ...'></textarea>
                        </FormItem>
                    </div>

                    {/*Course Information*/}
                    <div className="flex flex-col space-y-4">
                        <h1 style={{ color: '#79B7FF' }} className=' font-extrabold text-2xl'>Course Information</h1>

                        <FormItem label="Course Name" required>
                            <input type="text" ref={refs.course} className="border rounded px-2 py-1" placeholder='INF 117, CS 143B, etc...' maxLength={50}></input>
                        </FormItem>

                        <FormItem label="Course Level" required>
                            <select value={state.level} onChange={(e) => setState(prevState => ({ ...prevState, level: e.target.value }))} className="border rounded px-2 py-1">
                                <option value="Undergrad">Undergraduate</option>
                                <option value="Graduate">Graduate</option>
                            </select>
                        </FormItem>

                        <FormItem label="Faculty Advisors" required>
                            <textarea ref={refs.faculty} className="border rounded px-2 py-1 h-20" placeholder='Hadar Ziv, Shannon Alfaro, etc...'></textarea>
                        </FormItem>

                        <FormItem label="Department" tooltip="Select what department the course is in" required>
                            <select value={state.selectedDepartment} onChange={handleDepartmentChange} className="border rounded px-2 py-1">
                                {departments.map((department) => (
                                    <option key={department} value={department}>
                                        {department}
                                    </option>
                                ))}
                            </select>

                            {isOtherDeptSelected && (
                                <div>
                                    <label> Other : </label>
                                    <input type="text" value={state.otherDepartment} onChange={handleOtherDepartmentChange} className="border rounded px-2 py-1" />
                                </div>
                            )}
                        </FormItem>

                        <FormItem label="SchoolYear" tooltip="The schoolyear this project was worked on" required>
                            <select value={state.selectedYear} onChange={(e) => setState(prevState => ({ ...prevState, selectedYear: e.target.value }))} className="border rounded px-2 py-1">
                                {getSchoolYears().map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </FormItem>

                        <FormItem label="Start Quarter" required>
                            <select value={state.startQuarter} onChange={(e) => setState(prevState => ({ ...prevState, startQuarter: e.target.value }))} className="border rounded px-2 py-1">
                                {quarters.map((quarter) => (
                                    <option key={quarter} value={quarter}>
                                        {quarter}
                                    </option>
                                ))}
                            </select>
                        </FormItem>

                        <FormItem label="End Quarter" required>
                            <select value={state.endQuarter} onChange={(e) => setState(prevState => ({ ...prevState, endQuarter: e.target.value }))} className="border rounded px-2 py-1">
                                {quarters.map((quarter) => (
                                    <option key={quarter} value={quarter}>
                                        {quarter}
                                    </option>
                                ))}
                            </select>
                        </FormItem>
                    </div>


                    {/*Partner Information*/}
                    <div className="flex flex-col space-y-4">
                        <h1 style={{ color: '#79B7FF' }} className=' font-extrabold text-2xl'>Partner Information</h1>

                        <FormItem label="Choose Company" required>
                            <select value={state.selectedCompany} onChange={handleCompanyChange} className="border rounded px-2 py-1">
                                <option value="Select Company">Select Company</option>
                                <option value="Add New Company">Add New Company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.companyName}>
                                        {company.companyName}
                                    </option>
                                ))}
                            </select>

                            {isOtherCompSelected && (
                                <div>
                                    <FormItem label="Enter New Company Name">
                                        <input type="text" value={state.otherCompany} onChange={handleOtherCompanyChange} className="border rounded px-2 py-1" />
                                    </FormItem>

                                    <FormItem label="Upload Company Logo">
                                        <input type="file" onChange={(event) => { setState(prevState => ({ ...prevState, logoUpload: event.target.files[0] })) }} className="border rounded px-2 py-1" />
                                    </FormItem>

                                    <FormItem label="Enter Company URL">
                                        <input type="text" ref={refs.companyURL} className="border rounded px-2 py-1" />
                                    </FormItem>
                                </div>
                            )}
                        </FormItem>

                        <FormItem label="Partner Liaisons" tooltip="Company employee worked with. Separate by comma." required>
                            <textarea ref={refs.liasons} className="border rounded px-2 py-1 h-20" placeholder='John Doe, Sarah Davis, etc ...'></textarea>
                        </FormItem>
                    </div>

                    {/*Other Project Information*/}
                    <div className="flex flex-col space-y-4">
                        <h1 style={{ color: '#79B7FF' }} className=' font-extrabold text-2xl'>Other Project Information</h1>

                        <FormItem label="Project Image" tooltip="A screenshot of your project.">
                            <input type="file" onChange={(event) => { setState(prevState => ({ ...prevState, imageUpload: event.target.files[0] })) }} className="file-input file-input-bordered file-input-primary border rounded px-2 py-1"></input>
                        </FormItem>

                        {/* For now no awards */}
                        {state.awardChecked && (
                            <div>
                                <label className="mr-2">Enter Award Name</label>
                                <input type="text" ref={refs.award} className="border rounded px-2 py-1"></input>
                            </div>
                        )}

                        <FormItem label="Project Video">
                            <label className=''>Title</label>
                            <input type="text" ref={refs.videoName} className="border rounded px-2 py-1"></input>
                            <label className=''>Upload</label>
                            <input type="file" onChange={(event) => { setState(prevState => ({ ...prevState, videoUpload: event.target.files[0] })) }} className="border rounded px-2 py-1 file-input file-input-bordered file-input-primary"></input>
                        </FormItem>

                        <FormItem label="Poster URL">
                            <input type="text" ref={refs.poster} className="border rounded px-2 py-1"></input>
                        </FormItem>

                        <FormItem label="Slides URL">
                            <input type="text" ref={refs.slide} className="border rounded px-2 py-1"></input>
                        </FormItem>


                        <FormItem label="Misc URL">
                            <input type="text" ref={refs.misc} className="border rounded px-2 py-1"></input>
                        </FormItem>
                    </div>

                    <div className="flex justify-center w-full col-span-full">
                        <button type='submit' className="bg-sky-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded">Submit</button>
                    </div>

                </form>
            </div>

            {/* Need Help Box */}
            <div className="flex flex-col w-56 h-auto p-4 border rounded space-y-4 bg-white shadow-lg">
                <h2 className="text-lg font-bold text-center">Need Help?</h2>
                <p className="text-sm">If you have any questions or need assistance, please contact</p>
                <p className="text-sm font-bold">Mimi Anderson:</p>
                <a href="mailto:yangmm@uci.edu" className="text-sm text-blue-600">yangmm@uci.edu</a>
            </div>
        </div>
    )
}