import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { Project } from "../components/Project";

export const ProjectView = () => {
  const [projectData, setProjectData] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sponsors, setSponsors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);


  useEffect(() => {
    const fetchUniqueValues = async () => {

      const uniqueSponsors = new Set();
      const uniqueDepartments = new Set();
      const uniqueYears = new Set();

      const querySnapshot = await getDocs(collection(firestore, "projects"));


      querySnapshot.forEach((doc) => {
        const data = doc.data();
        uniqueSponsors.add(data.sponsor);
        uniqueDepartments.add(data.department);
        uniqueYears.add(data.schoolYear); 
      });



      const sortedSponsors = Array.from(uniqueSponsors).sort();

      const sortedDepartments = Array.from(uniqueDepartments).sort();

      const sortedYears = Array.from(uniqueYears).sort();


      setSponsors(sortedSponsors);
      setDepartments(sortedDepartments);
      setYears(sortedYears); 

    };

    fetchUniqueValues();

  }, []);

  useEffect(() => {
    const handleLoad = async () =>
    {
      try{
        let queryRef = query(collection(firestore, "projects"));

        if (selectedSponsor){
          queryRef = query(queryRef, where("sponsor", "==", selectedSponsor));
        }

        if (selectedDepartment){
          queryRef = query(queryRef, where("department", "==", selectedDepartment));
        }

        if (selectedYear){
          queryRef = query(queryRef, where("schoolYear", "==", selectedYear)); 
        }



        const documentSnapshot = await getDocs(queryRef);



        const projects = documentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));



        setProjectData(projects);
      } 
      catch (error){
        console.error("Error loading projects:", error);
      }

    };

    handleLoad();
  }, [selectedSponsor, selectedDepartment, selectedYear]);


  return(
    <div className="text-[#313144]">
      <form className="flex justify-center flex-wrap mt-12" action="#">
        <div className="m-2 flex flex-col">

          <label className="font-bold">SPONSORS</label>
          <select
            className="rounded-md border-[1.5px] border-[#C4C4C4] w-48 p-2 font-semibold text-sm"
            value={selectedSponsor}
            onChange={(e) => setSelectedSponsor(e.target.value)}
          >
            <option value="">All</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor} value={sponsor}>
                {sponsor}
              </option>
            ))}
          </select>

        </div>

        <div className="m-2 flex flex-col">
          <label className="font-bold">DEPARTMENTS</label>
          <select
            className="rounded-md border-[1.5px] border-[#C4C4C4] w-48 p-2 font-semibold text-sm"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

        </div>

        <div className="m-2 flex flex-col">

          <label className="font-bold">YEAR</label>
          <select
            className="rounded-md border-[1.5px] border-[#C4C4C4] w-48 p-2 font-semibold text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

        </div>

        <div className="m-2 flex flex-col justify-end">

          <input
            className="rounded-md border-[1.5px] border-blue-600 bg-blue-600 hover:bg-transparent hover-text-blue-600 duration-300 w-48 p-2 font-semibold text-white cursor-pointer"
            type="submit"
            value="FILTER"
          />
        </div>

      </form>

      <div className="m-4 border-2 rounded-2xl flex flex-wrap justify-center">


        {projectData.map((project, i) => (
          <Project projectID={project.id} projectData={project} key={i} />
        ))}


      </div>
    </div>
  );
};
