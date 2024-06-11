import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Project } from './Project';


// Fetches Projects under Company via Filter
const CompanyProjects = ({ companyName }) => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(firestore, 'projects'),
          where('company', '==', companyName),
          where('verified', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const fetchedProjects = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() });
        });
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [companyName]);

  const smallProjectStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
    // Add other styles as necessary
  };

  return (
    <div className="my-2">
      <div
        className="flex justify-between items-center px-4 py-2 border rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {companyName} ({projects.length})
        </span>
        <span>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div style={smallProjectStyle}>
          {projects.map((project) => (
            <div key={project.id} style={{ margin: '70px', width: '200px' }}> 
              <Project projectID={project.id} projectData={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyProjects;