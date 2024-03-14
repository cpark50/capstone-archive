import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/pointing.jpg';

export const Student = () => {
    return (
        <div className="student-main" id="outer-container" style={{
            // backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div id="page-wrap" style={{ textAlign: 'center' }}>
                {/* <h1>Welcome Anteater!</h1> */}
                <Link to="/submit">
                    <button className=" border-2 border-slate-800 text-slate-800 p-2 rounded-md hover:text-white hover:bg-slate-900 text-lg duration-300">
                        Submit Project
                    </button>
                </Link>

                {/* Add ability to view project */}

                {/* Add ability to view project status */}

                {/* Add ability to edit after resend */}
            </div>
        </div>
    );
};
