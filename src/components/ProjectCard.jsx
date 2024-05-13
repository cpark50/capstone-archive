import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { Link } from "react-router-dom";
const cardStyles = {
  padding: "20px",
  margin: "0px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  backgroundColor: "white",
};

const ProjectCard = ({ project }) => {
  //Information about other projects
  const [otherProjectsByDepartment, setOtherProjectsByDepartment] = useState(
    []
  );
  const [otherProjectsByCompany, setOtherProjectsByCompany] = useState([]);

  //Information about this project
  //TODO: Cesar, display partner liaisons, start year & qtr, end year & qtr, make company link clickable
  const companyName = project.company || project.companyName || "N/A";
  const department = project.department || "N/A";
  const projectName = project.name || project.projectName || "N/A";
  const teamMembers = project.teamMembers?.split(",") || ["N/A"];
  const faculty = project?.faculty?.split(",") || ["N/A"];
  const liaisons = project?.liasons?.split(",") || ["N/A"];
  const course = project.course || "N/A";
  const schoolYear = project.schoolYear || "N/A";
  const startQuarter = project.startQuarter || "N/A";
  const endQuarter = project.endQuarter || "N/A";
  const summary = project.summary;
  const description = project.description || "N/A";
  const awards = project.awards || "N/A";
  const imageURL = project.imageURL || "";
  const videoName = project.videoName || "N/A";
  const logoURL = project.logoURL || "N/A";
  const videoURL = project.videoURL || "";
  const companyLogoURL = project.companyLogo || "";
  const miscURL = project.misc || "";
  const posterURL = project.poster || "";
  const slidesURL = project.slide || "";
  console.log(teamMembers);

  //Finds projects within the same department
  useEffect(() => {
    const fetchProjects = async () => {
      //First, query projects by department
      const q = query(
        collection(firestore, "projects"),
        where("department", "==", department), //TODO(backend): build indexing to filter out the actual project
        limit(10)
      );

      try {
        const querySnapshot = await getDocs(q);
        const projects = [];
        querySnapshot.forEach((doc) => {
          projects.push({ id: doc.id, ...doc.data() });
        });
        setOtherProjectsByDepartment(projects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }

      const q2 = query(
        collection(firestore, "projects"),
        where("company", "==", companyName), //TODO(backend): build indexing to filter out the actual project
        limit(10)
      );

      try {
        const querySnapshot = await getDocs(q2);
        const projects = [];
        querySnapshot.forEach((doc) => {
          projects.push({ id: doc.id, ...doc.data() });
        });
        setOtherProjectsByCompany(projects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={cardStyles} className="project-card border-2 border-white">
      <div>
        {/* back button */}
        <button
          onClick={() => window.history.back()}
          className=" ml-6 mb-3 text-[#78B6FF] text-med  font-bold  alex-font tracking-wide hover:text-blue-800 duration-300 "
        >
          &lt; BACK
        </button>
      </div>

      <div className=" justify-center border-4 border-white">
        <div className=" flex flex-row flex-wrap justify-between mb-4 border-2 border-white">
          {/*COLUMN 1 */}
          <div className=" border-2 border-white w-full md:w-64 ">
            {/* IMAGE*/}
            <div className="aspect-w-4 aspect-h-3 bg-white border-2 rounded-xl border-gray-300 overflow-hidden">
              {imageURL ? (
                <img
                  src={imageURL}
                  alt="Project Image"
                  className="object-contain h-full w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  No image available
                </div>
              )}
            </div>
            {/*EXTERNAL LINKS*/}
            <div className=" border-0 flex flex-wrap mb-4 mt-4">
              {miscURL && (
                <a
                  href={miscURL}
                  target="_self"
                  className=" ml-3 mr-2 py-0 px-0   text-[#78B6FF] text-lg  font-bold  alex-font tracking-wide hover:text-blue-800 duration-300 "
                >
                  MISC
                </a>
              )}
              {posterURL && (
                <a
                  href={posterURL}
                  target="_self"
                  className=" py-0 px-2   text-[#78B6FF] text-lg  font-bold  alex-font tracking-wide hover:text-blue-800 duration-300"
                >
                  POSTER
                </a>
              )}
              {slidesURL && (
                <a
                  href={slidesURL}
                  target="_self"
                  className=" py-0 px-2  text-[#78B6FF] text-lg  font-bold  alex-font tracking-wide hover:text-blue-800 duration-300"
                >
                  SLIDES
                </a>
              )}
            </div>
            {/* COURSE INFO*/}

            <div className=" border-slate-300 border-0 flex flex-col justify-start ml-2">
              <h1 className="text-[#456386] alex-font uppercase text-med">
                Team Members
              </h1>
              {teamMembers.map((member) => {
                return (
                  <span className=" text-base font-sans font-normal tracking-tighter -mt-1">
                    {member}
                  </span>
                );
              })}
              <h1 className="text-[#456386] alex-font uppercase text-med mt-3 ">
                {" "}
                Partner Liaisons
              </h1>
              {liaisons.map((member) => {
                return (
                  <span className=" text-base font-sans font-normal tracking-tighter -mt-1">
                    {member}
                  </span>
                );
              })}
              <h1 className="text-[#456386] alex-font uppercase text-med mt-3 ">
                {" "}
                Faculty Advisor
              </h1>
              {faculty.map((member) => {
                return (
                  <span className=" text-base font-sans font-normal tracking-tighter -mt-1">
                    {member}
                  </span>
                );
              })}
              <h1 className=" text-[#456386] alex-font uppercase text-med mt-3 ">
                Department Name
              </h1>
              <h2 className=" text-base font-sans font-normal tracking-tighter -mt-1">
                {department}
              </h2>
              <h1 className=" text-[#456386] alex-font uppercase text-med mt-3 ">
                Course
              </h1>
              <h2 className=" text-base font-sans font-normal tracking-tighter -mt-1">
                {course}
              </h2>
              <h1 className=" text-[#456386] uppercase alex-font text-med mt-3 ">
                Project Timeline
              </h1>
              <h2 className=" text-base font-sans font-normal tracking-tighter mb-1 -mt-1">
                {schoolYear}
              </h2>
              <h2 className=" text-sm font-sans font-normal tracking-tighter -mt-1 ">
                Start: {startQuarter}
              </h2> <h2 className=" text-sm font-sans font-normal tracking-tighter -mt-1">
                End: {endQuarter}
              </h2>
            </div>
          </div>

          {/* COLUMN 2*/}
          <div className=" border-2 border-white flex-1 ml-10 mr-10">
            {/*Discription and Video*/}
            <div className=" border-2 border-white ">
              <h1 className=" text-sky-900 text-2xl  uppercase font-bold alex-font leading-7 tracking-wide ">
                {projectName}
              </h1>
              {companyName && companyName !== "N/A" && (
                
               <div className=" text-[#78B6FF] text-xl  font-bold uppercase alex-font leading-7 tracking-wide ">
                  <span className="text-[#456386] alex-font text-lg">
                    PARTNER:
                  </span>{" "}
                  <a target="_blank" href={project?.companyURL} >{companyName}</a>
                </div>
              )}
              <p className=" text-xl mt-3 font-sans font-normal tracking-tighter text-justify">
                {summary}
              </p>

              <p className=" text-xl mt-3 font-sans font-normal tracking-tighter text-justify">
                {description}
              </p>
            </div>
            <div className="mt-14">
              {videoURL ? (
                <div className="">
                  <p className=" text-[#456386] uppercase alex-font text-lg">{videoName}</p>
                  <iframe
                    title="Embedded Video"
                    width="412"
                    height="232"
                    src={videoURL}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <p>No video available</p>
              )}
            </div>
          </div>

          {/*COLUMN 3*/}
          <div className=" border-2 border-white w-64  ">
            <div className=" flex flex-col">
              {/* Suggested Content */}
              {otherProjectsByDepartment.length > 0 && (
                <h1 className="text-[#508b9d] text-sm uppercase alex-font leading-2 tracking-wide mb-2">
                  <span className=" text-sky-900 alex-font text-sm"> More projects in</span> {department}
                </h1>

              )}

              {otherProjectsByDepartment.length > 0 &&
                otherProjectsByDepartment.map((data) => {
                  return (
                    <Link
                      key={data.id}
                      to={`/view/${data.id}`}
                      className="text-[#78B6FF] text-sm uppercase font-normal alex-font hover:text-blue-800 duration-300 whitespace-normal "
                    >
                      {data.name}
                    </Link>
                  );
                })}
              {otherProjectsByCompany.length > 0 && (
                <h1 className="text-[#508b9d] text-sm uppercase alex-font leading-2 tracking-wide mb-2 mt-8">
                  <span className=" text-sky-900 alex-font text-sm"> More projects with</span> {companyName}
                </h1>
              )}
              {otherProjectsByCompany.length > 0 &&
                otherProjectsByCompany.map((data) => {
                  return (
                    <Link
                    reloadDocument = {true}
                      key={data.id}
                      to={`/view/${data.id}`}
                      className=" text-[#78B6FF] text-sm uppercase font-thin alex-font tracking-wide hover:text-blue-800 duration-300 whitespace-normal"
                    >
                      {data.name}
                    </Link>
                  );
                })}
            </div>
            <h1 className="text-red-500 font-bold border-2 border-red-500 text-sm p-4">Current Bug: Must refresh after clicking suggested projects above to actually load up new project info.</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
