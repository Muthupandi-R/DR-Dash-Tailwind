// Dashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import PieChart from "./StatusPieChart";
import DashTable from "./DashTable";
import StatsPieCharts from "./StatusPieChart";

const Dashboard = () => {
  
  return (
    <div className="w-full min-h-screen bg-gradientPrimary mt-12">
      <div className="flex flex-col gap-4 mt-3">
        <StatsPieCharts />
        <div className="flex flex-row gap-4 w-full">
          <DashTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;