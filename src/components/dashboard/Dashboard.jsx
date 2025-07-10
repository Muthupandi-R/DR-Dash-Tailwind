// Dashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import PieChart from "./StatusPieChart";
import DashTable from "./DashTable";
import { fetchResourceStats } from "../../lib/helpers";
import SkeletonPieChart from "../Loaders/SkeletonPieChart";

const pieTitles = [
  "Service Total Count",
  "Running vs Stopped",
];

function getPieData(apiData, filter) {
  let services = Object.values(apiData).filter(
    (item) => item && item.label && typeof item.totalCount === "number"
  );

  if (filter && filter.type === "service") {
    services = services.filter((item) => item.label === filter.value);
  }

  let pieData1 = services.map((item) => ({
    label: item.label,
    value: item.totalCount,
  }));

  let running = 0,
    stopped = 0;
  services.forEach((item) => {
    if (typeof item.running === "number") running += item.running;
    if (typeof item.stopped === "number") stopped += item.stopped;
  });
  let pieData2 = [
    { label: "Running", value: running },
    { label: "Stopped", value: stopped },
  ];

  if (filter && filter.type === "status") {
    const statusKey = filter.value === "Running" ? "running" : "stopped";
    const statusServices = services.filter((item) => item[statusKey] > 0);
    pieData1 = statusServices.map((item) => ({
      label: item.label,
      value: item[statusKey],
    }));
    let statusSum = statusServices.reduce((sum, item) => sum + item[statusKey], 0);
    pieData2 = [{ label: filter.value, value: statusSum }];
  }

  return [pieData1, pieData2];
}

const Dashboard = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState([null, null, null]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchData() {
      try {
        const data = await fetchResourceStats();
        if (data) {
          setApiData(data);
        } else {
          setError('No data found');
        }
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pieDatas = useMemo(() => (apiData ? getPieData(apiData, filter) : [[], []]), [apiData, filter]);

  useEffect(() => {
    setSelected((prev) =>
      prev.map((sel, idx) =>
        sel !== null && (!pieDatas[idx] || !pieDatas[idx][sel]) ? null : sel
      )
    );
  }, [pieDatas]);

  const handleSegmentClick = (chartIdx, segmentIdx) => {
    if (selected[chartIdx] === segmentIdx) {
      setFilter(null);
      setSelected([null, null, null]);
      return;
    }

    let newFilter = null;
    if (chartIdx === 0 || chartIdx === 2) {
      newFilter = { type: "service", value: pieDatas[chartIdx][segmentIdx].label };
    } else if (chartIdx === 1) {
      newFilter = { type: "status", value: pieDatas[1][segmentIdx].label };
    }

    setFilter(newFilter);
    const newSelected = [null, null, null];
    newSelected[chartIdx] = segmentIdx;
    setSelected(newSelected);
  };

  return (
    <div className="w-full bg-slate-100 mt-16">
      <div className="flex flex-col gap-4 mt-3">
      <div className="flex flex-row gap-x-8 w-full justify-end">
        {pieDatas.map((data, idx) => (
          <div key={idx} className="flex-1 flex justify-center mb-10">
            {loading ? (
              <SkeletonPieChart />
            ) : data && data.length > 0 ? (
              <PieChart
                data={data}
                title={pieTitles[idx]}
                onSegmentClick={(segmentIdx) => handleSegmentClick(idx, segmentIdx)}
                legendPosition={idx === 1 ? 'bottom' : 'right'}
              />
            ) : (
              <div className="text-center text-gray-500">No data</div>
            )}
            {selected[idx] !== null && data[selected[idx]] && !loading && (
              <div className="text-center mt-2 text-sm font-semibold text-blue-700">
                Filtered: {data[selected[idx]].label} ({data[selected[idx]].value})
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs"
                  onClick={() => {
                    setFilter(null);
                    setSelected([null, null, null]);
                  }}
                >
                  Reset
                </button>
              </div>
            )}
        </div>
        ))}
      </div>
        <div className="flex flex-row gap-4 w-full">
          <DashTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;