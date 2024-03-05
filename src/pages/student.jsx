import React, { useState, useEffect } from "react";
import SideMenu from "../components/NavigationMenu";
import { Link } from "react-router-dom";



export const Student = () => {
    {


        return (
            <div className="student-main" id="outer-container">
                <div id="page-wrap">
                    <h1>Student Page</h1>
                    <Link to="/submit">
                        <button className=" border-2 border-slate-800 text-slate-800 p-2 rounded-md m-4 hover:text-white hover:bg-slate-900 text-lg duration-300 relative top-0 hover:top-2">
                            Submit Project
                        </button>
                    </Link>
                    <link rel="stylesheet" href="/submit" />

                </div>
            </div>

        )
    }

}