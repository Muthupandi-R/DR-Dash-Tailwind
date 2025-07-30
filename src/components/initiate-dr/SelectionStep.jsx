import React, { useEffect, useState } from "react";
import CustomSelect from "../select/CustomSelect";
import { fetchProjects } from "../../lib/helpers/index";

const REGION_OPTIONS = {
  azure: ["East US", "Central US", "Southeast Asia"],
  aws: ["us-east-2", "us-west-1", "ap-south-1"],
  gcp: ["us-east1", "us-central1-b", "asia-east1"],
};

const SelectionStep = ({ selectedCloud, onNext }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [sourceRegion, setSourceRegion] = useState("");
  const [targetRegion, setTargetRegion] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await fetchProjects(selectedCloud);
        if (isMounted && response) {
          const options = response.map((project) => ({
            value: project.name,
            label: project.projectName || project.name,
          }));
          setProjects(options);
        }
      } catch (error) {
        if (isMounted) setProjects([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, [selectedCloud]);

  const regionOptions = (REGION_OPTIONS[selectedCloud] || []).map((region) => ({
    value: region,
    label: region,
  }));

  const handleNext = () => {
    if (projectName && sourceRegion && targetRegion) {
      onNext({ projectName, sourceRegion, targetRegion });
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center py-8 w-full">
      <div className="w-full max-w-md bg-gradient-to-br from-blue-100 via-white to-purple-100 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 items-center border-2 border-primary-100 hover:border-primary-300 hover:shadow-primary-200 transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-4 text-primary-700 text-center drop-shadow">Select Project and Regions</h2>
        <CustomSelect
          label="Project Name"
          options={projects}
          value={projectName}
          onChange={setProjectName}
          disabled={loading}
        />
        <CustomSelect
          label="Source Region"
          options={regionOptions}
          value={sourceRegion}
          onChange={setSourceRegion}
        />
        <CustomSelect
          label="Target Region"
          options={regionOptions}
          value={targetRegion}
          onChange={setTargetRegion}
        />
        <button
          className="mt-4 px-6 py-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:scale-105 hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 w-full border-0 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
          disabled={!projectName || !sourceRegion || !targetRegion}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SelectionStep;
