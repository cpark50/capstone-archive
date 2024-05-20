import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/pointing.jpg';

export const Student = () => {
    return (
        <div className="student-main" id="outer-container" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div id="page-wrap" style={{ textAlign: 'center' }}>
                <h1 className="text-3xl font-bold mb-6">Welcome Anteater!</h1>
                <p className="mb-4 text-lg">Follow the steps below to manage your projects:</p>
                
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Step 1: Submit Your Project</h2>
                    <p className="mb-2">Click the button below to submit your project details and files.</p>
                    <Link to="/submit">
                        <button className="border-2 border-slate-800 text-slate-800 p-2 rounded-md hover:text-white hover:bg-slate-900 text-lg duration-300">
                            Submit Project
                        </button>
                    </Link>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Step 2: View Your Project Status</h2>
                    <p className="mb-2">Check the status of your submitted projects.</p>
                    <Link to="/status">
                        <button className="border-2 border-slate-800 text-slate-800 p-2 rounded-md hover:text-white hover:bg-slate-900 text-lg duration-300">
                            View Project Status
                        </button>
                    </Link>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Step 3: Edit Your Project</h2>
                    <p className="mb-2">If needed, you can edit your project details after resubmission.</p>
                    <Link to="/edit">
                        <button className="border-2 border-slate-800 text-slate-800 p-2 rounded-md hover:text-white hover:bg-slate-900 text-lg duration-300">
                            Edit Project
                        </button>
                    </Link>
                {/* Add ability to view project */}

                {/* Add ability to view project status */}

                {/* Add ability to edit after resend */}
                </div>
            </div>
        </div>
    );
};
