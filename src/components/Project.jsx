import React from "react";
import { firestore } from "../firebase";
import { collection, doc, getDoc } from "@firebase/firestore";
import { useState, useEffect } from "react";
export const Project = (props) => {
  /* Render only: 
  Title
  Company Logo
  Description
  Sponsor Name

  projectKey is a prop (str) passed in, which is the document code used to access that project in the database.
  */

  /* Obtain the doc from firestore */

  /* If given a projectKey as a prop, obtain that projects' information to store into "data" variable */
  let docRef;
  let projectKey = props.projectKey;
  const [data, setData] = useState();

  useEffect(() => {
    const handleLoad = async (e) => {
      try {
        await getDoc(docRef).then((projInfo) => setData(projInfo.data()));
      } catch (error) {
        console.log(error);
      }
    };

    if (projectKey) {
      docRef = doc(firestore, "projects", projectKey);
      handleLoad();
    }
  }, []);

  return (
      <a href = "/view" target = "_blank" className="xs:w-[80vw] sm:w-[40vw] lg:w-[28vw] m-4 border-2 rounded-lg p-6">
        {!data && <p> Error: Could not load data</p>}
        {(
          <div className="  rounded-xl overflow-hidden aspect-square">
            <img
              className=" object-cover w-full h-full"
              src={data.logoURL}
            ></img>
          </div>
        )}
        
        <h1 className=" text-right text-xl font-bold leading-relaxed">{data?.company}</h1>
        <h2 className=" text-center text-3xl font-extrabold">{data?.name}</h2>
        <p className="">{data?.description}</p>
    </a>
  );
};
