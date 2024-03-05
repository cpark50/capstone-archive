import React, { useContext, useEffect, useState } from 'react';

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createHashRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { ProjectView } from './pages/ProjectView';
import { Upload } from './pages/Upload';
import { ProjectFull } from './components/ProjectFull';
import { Head } from './sections/Head';
import { VerifyProjects } from './pages/VerifyProjects';
import { ThankYou } from './pages/ThankYou';
import { Login } from './pages/login';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Admin } from './pages/admin';
import { Student } from './pages/student';
import { Verifer } from './pages/verifier';
import { AuthContext, AuthContextProvider } from './context/AuthContext';


const CheckVerification = ({ element, requiredPermission }) => {
  const { currentUser, permissionLevel, accessLevel } = useContext(AuthContext)
  if (permissionLevel !== null && requiredPermission === accessLevel) {
    // Redirect to login or another fallback path
    return element;
  } else { return <Navigate to={"/login"} replace />; }
}

const IndexWithRouter = () => {


  // current user is broken and returns undefined 
  //

  // function to 
  const router = createHashRouter([
    {
      path: "/",
      element: <div><Head></Head><ProjectView /></div>
    },
    {
      path: "/view/:projectID",
      element: <div><Head></Head><ProjectFull /></div>
    },
    {
      path: "/submit",
      element: <div><Head></Head><Upload /></div>
    },
    {
      path: "/verify",
      element: <div><Head></Head><VerifyProjects /></div>
    },
    {
      path: "/adminpage",
      element: <CheckVerification element={<div><Head></Head><Admin /></div>} requiredPermission={2} />
    },
    {
      path: "/verifierpage",
      element: <CheckVerification element={<div><Head></Head><Verifer /></div>} requiredPermission={1} />
    },
    {
      path: "/studentpage",
      element: <CheckVerification element={<div><Head></Head><Student /></div>} requiredPermission={0} />
    },
    {
      path: "/thankYou",
      element: <ThankYou></ThankYou>
    },
    {
      path: "/login",
      element: <Login></Login>,
    }
  ]);

  return (
    <AuthContextProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </AuthContextProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<IndexWithRouter />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
