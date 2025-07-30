//Tabletabs.jsx
import React, { useState } from "react";
import TabItem from "./TabItem";

const TableTabs = ({facets, setSelectedFilters}) => {
  const [activeTab, setActiveTab] = useState("location");

  return (
    <div className="flex flex-row items-center gap-5 px-5 text-xs">
      {Array.isArray(facets) && facets.map((facet, index) => (
        <TabItem
          key={index}
          expression={facet.expression.toUpperCase()}
          data={facet.data}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedFilters={setSelectedFilters}
        />
      ))}
    </div>
  );
};

export default TableTabs;
