import React, { useState, useContext } from "react";
import TableData from "./TableData";
import SelectionStep from "./SelectionStep";
import DrHeader from "./DrHeader";
import ContextApi from "../../context/ContextApi";
import project1 from "../../images/project.png";

const MAX_TABS = 5;

const defaultTab = {
  id: 1,
  name: "New Project Tab",
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
      name: `New Project Tab${newTabId}`,
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
  console.log('muthu')

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
    <div className="w-full h-full p-1 px-0 overflow-y-auto mt-10">
      {/* Top Tabs */}
      <div className="overflow-x-auto scrollbar-hide">
        <ul className="tabs">
        {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isLast = index === tabs.length - 1;

            return (
              <li
                key={tab.id}
                className={`${isActive ? "active" : ""} ${isLast ? "last-tab" : ""}`}
              >
                <a
                  href="#"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center justify-between  w-full"
                >
                  {/* Left side: Icon and Name */}
                  <div className="flex items-center gap-2">
                    <img
                      src={project1}
                      alt="Tab Icon"
                      className="tab-icon w-6 h-6"
                    />
                    <span className="text-xs text-primary-900">{tab.name}</span>
                  </div>

                  {/* Right side: Close button */}
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTab(tab.id);
                      }}
                      className="tab-close h-5"
                      title="Remove tab"
                    >
                      ×
                    </button>
                  )}
                </a>

              </li>
            );
          })}

          {/* Add (+) Button */}
          {tabs.length < MAX_TABS && (
            <li>
              <button
                onClick={handleAddTab}
                className="tab-add hover:text-primary-100 hover:bg-primary-500 hover:rounded-2xl h-7 w-full top-1 p-2"
                title="Add new tab"
              >
                +
              </button>
            </li>
          )}
        </ul>
      </div>


      {/* Component Area */}
      <div className="bg-primary-50 p-6 rounded shadow-md">
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
