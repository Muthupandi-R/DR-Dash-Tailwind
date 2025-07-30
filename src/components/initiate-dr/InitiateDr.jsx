import React, { useState, useContext } from "react";
import TableData from "./TableData";
import SelectionStep from "./SelectionStep";
import DrHeader from "./DrHeader";
import ContextApi from "../../context/ContextApi";
import project1 from "../../images/project.png";

const MAX_TABS = 5;

const defaultTab = {
  id: 1,
  name: "Project-1",
  step: "selection",
  selection: {
    projectName: "",
    sourceRegion: "",
    targetRegion: "",
  },
};

const InitiateDr = () => {
  const { selectedCloud } = useContext(ContextApi);
  const [tabs, setTabs] = useState([ { ...defaultTab } ]);
  const [activeTab, setActiveTab] = useState(1);

  const handleAddTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const newTabId = tabs.length + 1;
    const newTab = {
      id: newTabId,
      name: `Project-${newTabId}`,
      step: "selection",
      selection: {
        projectName: "",
        sourceRegion: "",
        targetRegion: "",
      },
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTabId);
  };

  const handleRemoveTab = (tabId) => {
    const tabIdx = tabs.findIndex((tab) => tab.id === tabId);
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    if (activeTab === tabId) {
      if (newTabs.length > 0) {
        const nextTab = newTabs[tabIdx] || newTabs[newTabs.length - 1];
        setActiveTab(nextTab.id);
      } else {
        setActiveTab(null);
      }
    }
    setTabs(newTabs);
  };

  const handleSelectionNext = (tabId, { projectName, sourceRegion, targetRegion }) => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === tabId
        ? { ...tab, step: "table", selection: { projectName, sourceRegion, targetRegion } }
        : tab
    ));
  };

  const handleBack = (tabId) => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === tabId
        ? { ...tab, step: "selection" }
        : tab
    ));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-primary-200 via-primary-300 to-primary-200 p-6 mt-8">
      {/* Top Tabs */}
      <div className="flex items-center space-x-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`relative flex items-center cursor-pointer 
            px-6 py-2 rounded-t-md transition-all duration-200 
            min-w-[130px] max-w-xs ${
              activeTab === tab.id
                ? "bg-white border border-b-0 font-semibold"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {/* Tab Image */}
            <img
              src={project1}
              alt="Tab Icon"
              className="mr-3 w-6 h-6 rounded-full object-cover border border-gray-300"
              style={{ pointerEvents: 'none' }}
            />
            <span className="text-xs">{tab.name}</span>
            {/* Remove Icon - only show if more than one tab */}
            {tabs.length > 1 && (
              <button
                className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveTab(tab.id);
                }}
                title="Remove tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {/* + Button */}
        {tabs.length < MAX_TABS && (
          <button
            onClick={handleAddTab}
            className="ml-auto flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-200 focus:outline-none border-none group"
            title="Add new tab"
          >
            <span className="text-2xl font-bold leading-none text-primary-500 group-hover:text-white group-hover:bg-primary-500 group-hover:rounded-md group-hover:px-2 group-hover:py-1 transition-all duration-200">
              +
            </span>
          </button>
        )}
      </div>
      {/* Component Area */}
      <div className="bg-white p-6 rounded shadow-md">
        {tabs.map(tab => (
          <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
            {tab.step === "selection" ? (
              <SelectionStep
                selectedCloud={selectedCloud}
                onNext={({ projectName, sourceRegion, targetRegion }) => handleSelectionNext(tab.id, { projectName, sourceRegion, targetRegion })}
              />
            ) : (
              <>
                <TableData
                  projectName={tab.selection.projectName}
                  sourceRegion={tab.selection.sourceRegion}
                  targetRegion={tab.selection.targetRegion}
                  onBack={() => handleBack(tab.id)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InitiateDr;
