import React, { useState } from "react";
import TabItem from "./TabItem";

const facets = [
  {
      "expression": "location",
      "totalRecords": 3,
      "count": 3,
      "resultType": "FacetResult",
      "data": [
          {
              "location": "asia-south1",
              "count": 1
          },
          {
              "location": "us-east1",
              "count": 5
          },
          {
              "location": "us-central1",
              "count": 1
          }
      ]
  },
  {
      "expression": "type",
      "totalRecords": 2,
      "count": 2,
      "resultType": "FacetResult",
      "data": [
          {
              "type": "computeEngine",
              "count": 1
          },
          {
              "type": "sql",
              "count": 6
          }
      ]
  },
  {
      "expression": "projectName",
      "totalRecords": 2,
      "count": 2,
      "resultType": "FacetResult",
      "data": [
          {
              "projectName": "My First Project",
              "count": 2
          },
          {
              "projectName": "DRD-Project",
              "count": 5
          }
      ]
  }
];

const TableTabs = () => {
  const [activeTab, setActiveTab] = useState("location");

  return (
    <div className="flex flex-row items-center gap-5 px-5 text-xs">
      {facets.map((facet, index) => (
        <TabItem
          key={index}
          expression={facet.expression.toUpperCase()}
          data={facet.data}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ))}
    </div>
  );
};

export default TableTabs;
