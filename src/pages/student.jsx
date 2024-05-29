import { Link } from 'react-router-dom';
import backgroundImage from '../assets/pointing.jpg';
import React, { useEffect, useState, useContext } from 'react';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { AuthContext } from "../context/AuthContext";
import { firestore } from "../firebase.js";



const CheckUID = () => {
    const { uid } = useContext(AuthContext);
    return uid;
};

export const Student = () => {
    const user = CheckUID()


    const [data, setData] = useState({ projectID: null, projectStatus: 'Unsubmitted' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [projectStatus, setProjectStatus] = useState('Unsubmitted');

    useEffect(() => {
        if (!user) return; // If user is not logged in, do not proceed


        const fetchData = async () => {
            try {
                const snapShot = await getDocs(collection(firestore, "users"));
                let list = [];


                await Promise.all(
                    snapShot.docs.map(async (doc) => {
                        let userData = { id: doc.id, ...doc.data() };

                        const subcollectionSnapshot = await getDocs(
                            collection(firestore, "users", doc.id, "students")
                        );

                        subcollectionSnapshot.forEach((subDoc) => {
                            let studentData = { id: subDoc.id, ...subDoc.data() };

                            // Check if the studentData.id matches the user identifier
                            if (studentData.id === user) {
                                setData(studentData);
                                if (data.projectStatus === "submitted") {
                                    setIsSubmitted(true)
                                    setProjectStatus("submitted")
                                }
                                if (data.projectStatus === "pending") {
                                    setIsSubmitted(true)
                                    setProjectStatus("pending")
                                }
                            }
                        });
                    })
                );

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const unsub = onSnapshot(collection(firestore, "users"), fetchData);

        return () => {
            unsub();
        };
    }, [user, firestore]); // Re-run the effect when user or firestore changes



    return (

        <div className="student-main" id="outer-container" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div>
                {!isSubmitted ? (
                    <Link to="/submit">
                        <button className="border-2 border-slate-800 text-slate-800 p-2 rounded-md hover:text-white hover:bg-slate-900 text-lg duration-300">
                            Submit Project
                        </button>
                    </Link>
                ) : (
                    <Link to={`/view/${data.projectID}`}>
                        <button className="border-2 border-slate-800 text-slate-800 p-2 rounded-md hover:text-white hover:bg-slate-900 text-lg duration-300">
                            View Submitted Project
                        </button>
                    </Link>
                )}
                <div className="border-2 border-slate-800 text-slate-800 p-2 rounded-md text-lg bg-slate-100">
                    <p>Project Status: <span className="font-bold">{projectStatus}</span></p>                </div>
            </div>
        </div >
    );
};
