import React, { useState } from "react";
import TabItem from "./TabItem";

const facets = [
  {
    expression: "location",
    data: [
      { location: "eastus", count: 4 },
      { location: "southindia", count: 1 },
    ],
  },
  {
    expression: "type",
    data: [
      { type: "microsoft.web/sites", count: 2 },
      { type: "microsoft.compute/virtualmachines", count: 1 },
      { type: "microsoft.containerservice/managedclusters", count: 1 },
      { type: "microsoft.sql/servers", count: 1 },
    ],
  },
  {
    expression: "state",
    data: [
      { state: "Stopped", count: 2 },
      { state: "PowerState/deallocated", count: 1 },
      { state: "Ready", count: 1 },
      { state: "Running", count: 1 },
    ],
  },
  {
    expression: "projectName",
    data: [
      { projectName: "az-fb-rg-drd", count: 4 },
      { projectName: "ats-rg", count: 1 },
    ],
  },
];

const TableTabs = () => {
  const [activeTab, setActiveTab] = useState("location");

  return (
    <div className="flex flex-row items-center gap-5 px-5">
      {facets.map((facet, index) => (
        <TabItem
          key={index}
          expression={facet.expression}
          data={facet.data}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ))}
    </div>
  );
};

export default TableTabs;
