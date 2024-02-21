import React from "react";
import { Link } from "react-router-dom";
import { Login } from "../pages/login";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";




export const Head = () => {

  const [seen, setSeen] = useState(false)
  let nav = "/login"
  let logout = "/logout"

  const { currentUser, permissionLevel, accessLevel } = useContext(AuthContext)
  if (permissionLevel !== null) {
    if (accessLevel === 0) {
      nav = "/studentpage"
    } else if (accessLevel === 1) {
      nav = "/verifierpage"
    } else if (accessLevel === 2) {
      nav = "/adminpage"
    }

  }

  function togglePop() {
    setSeen(!seen);
  };


  return (
    <div className="">
      <div className="border-2 border-white h-32 flex flex-col justify-center">
        <div className=" flex justify-between border-2 border-white">
          <div className=" flex border-2  border-white">
            <a href="/view?#" className="flex border-2 border-white">

              <h1 className=" text-6xl alex-font tracking-wider text-[#0064a4] ml-12" >UCI</h1>
              <div className=" flex flex-col justify-center ">
                <h2 className="  text-[#79B7FF] text-3xl alex-font ml-12" >CAPSTONE</h2>
                <h2 className=" text-[#AED3FF] text-2xl alex-font -mt-1 ml-12" >ARCHIVE</h2>

              </div>
              <div className=" m-auto font-bold m-4">
                <Link to={nav}>
                  <button className=" border-2 border-slate-800 text-slate-800 p-2 rounded-md m-4 hover:text-white hover:bg-slate-900 text-lg duration-300 relative top-0 hover:top-2">
                    Login
                  </button>
                </Link>
                <Link to={logout}>
                  <button className=" border-2 border-slate-800 text-slate-800 p-2 rounded-md m-4 hover:text-white hover:bg-slate-900 text-lg duration-300 relative top-0 hover:top-2">
                    Logout
                  </button>
                </Link>
              </div>
            </a>
          </div>
          <div>
          </div>
        </div>
        <div class="bg-yellow-300 opacity-75 w-full h-1.5 mt-2">
        </div>
      </div>
    </div>
  );
};