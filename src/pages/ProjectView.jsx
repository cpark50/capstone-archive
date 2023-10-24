import React from "react";
import { useState, useRef, useEffect } from "react";
import { Project } from "../components/Project";
import { collection, doc, getDocs, query } from "@firebase/firestore";
import { firestore } from "../firebase";

export const ProjectView = () => {
  const [projectIDs, setProjectIDs] = useState(["dummyData"]);

  const q = query(collection(firestore, "projects"));

  /* Load all project IDs into a list, and update the state of projectIDs */

  useEffect(() => {
    const handleLoad = async (e) => {
      let docs = getDocs(q);
      let projectsIDs_temp = [];
      (await docs).forEach((doc) => projectsIDs_temp.push(doc.id));
      await setProjectIDs(projectsIDs_temp);
    };

    handleLoad().catch(console.error);
  }, [q, projectIDs, setProjectIDs]);

  return (
    <div className="">
      {/* Search/filters here*/}
      <form className=" flex justify-center flex-wrap" action="#">
        <div className="m-2 flex flex-col">
          <label className=" font-bold"> SPONSORS </label>
          <select
            className="rounded-md border-[1.5px] border-[#C4C4C4] w-48 p-2 font-semibold"
            name="languages"
            id="lang"
          >
            {/* Dynamically load options later on based on the data*/}
            <option value="javascript">Biomedical</option>
            <option value="php">Game development</option>
            <option value="java">Etc.</option>
          </select>
        </div>

        <div className="m-2 flex flex-col">
          <label className=" font-bold"> DEPARTMENTS </label>
          <select
            className="rounded-md border-[1.5px] border-[#C4C4C4] w-48 p-2 font-semibold"
            name="languages"
            id="lang"
          >
            {/* Dynamically load options later on based on the data*/}
            <option value="javascript">JavaScript</option>
            <option value="php">PHP</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="m-2 flex flex-col">
          <label className=" font-bold"> YEAR </label>
          <select
            className="rounded-md border-[1.5px] border-[#C4C4C4] w-48 p-2 font-semibold"
            name="languages"
            id="lang"
          >
            {/* Dynamically load options later on based on the data*/}
            <option value="javascript">JavaScript</option>
            <option value="php">PHP</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div className=" m-2 flex flex-col justify-end">
          <input
            className="rounded-md border-[1.5px] border-blue-600 bg-blue-600 hover:bg-transparent hover:text-blue-600 duration-300 w-48 p-2 font-semibold text-white"
            type="submit"
            value="SEARCH"
          />
        </div>
      </form>

      {/*Load projects dynamically based on form information */}

      <div className=" m-4 border-2 border-[#C4C4C4] rounded-2xl flex flex-wrap">
        {projectIDs.map((projectID, i) => (
          <Project projectKey={projectID} key={i}></Project>
        ))}
      </div>
    </div>
  );
};