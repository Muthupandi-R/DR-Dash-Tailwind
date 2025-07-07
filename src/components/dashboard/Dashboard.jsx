import React from "react";
import Navbar from "../Navbar";
import DashTable from "./DashTable";
// import StatusBarChart from "./StatusBarChart";
import StatusPieChart from "./StatusPieChart";
const Dashboard = () => {
  return (
    <>
      <div className="w-full bg-slate-100">
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex flex-row gap-4 w-full justify-end">
            {/* <StatusBarChart /> */}
            <StatusPieChart />
          </div>
          <div className="flex flex-row gap-4 w-full">
            <DashTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
