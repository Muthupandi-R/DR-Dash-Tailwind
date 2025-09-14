import React, { useState, useContext, useEffect } from "react";
import TableLayout from "./TableLayout";
import DrHeader from "./DrHeader";
import {
  fetchInitiateDrResources,
  getDrSuffix,
  fetchFailoverProgressResource,
} from "../../services/apiService";
import SkeletonTable from "../Loaders/SkeletonTable";
import ContextApi from "../../context/ContextApi";
import {
  buildAzurePayload,
  buildAwsPayload,
  buildGcpPayload,
} from "../../utils/drPayloadUtils";
import axios from "axios";
import useWebSocket from "./useWebSocket";

// Table configuration for different clouds
const getTableConfigs = (cloud) => {
  const configs = {
    azure: [
      {
        key: "dbServer",
        label: "SQL",
        color: "from-blue-500 via-blue-400 to-blue-600",
        border: "border-blue-400",
        type: "SQL Server",
      },
      {
        key: "serverlessComputing",
        label: "Function App",
        color: "from-purple-500 via-purple-400 to-purple-600",
        border: "border-purple-400",
        type: "Function App",
      },
      {
        key: "appHosting",
        label: "Web App",
        color: "from-pink-500 via-pink-400 to-pink-600",
        border: "border-pink-400",
        type: "Web App",
      },
      {
        key: "computeService",
        label: "Virtual Machine",
        color: "from-orange-500 via-orange-400 to-orange-600",
        border: "border-orange-400",
        type: "Virtual Machine",
      },
      {
        key: "kubernetesService",
        label: "Kubernetes",
        color: "from-green-500 via-green-400 to-green-600",
        border: "border-green-400",
        type: "AKS",
      },
    ],
    aws: [
      {
        key: "dbServer",
        label: "RDS",
        color: "from-blue-500 via-blue-400 to-blue-600",
        border: "border-blue-400",
        type: "RDS",
      },
      {
        key: "serverlessComputing",
        label: "Lambda",
        color: "from-purple-500 via-purple-400 to-purple-600",
        border: "border-purple-400",
        type: "Lambda",
      },
      {
        key: "computeService",
        label: "EC2",
        color: "from-orange-500 via-orange-400 to-orange-600",
        border: "border-orange-400",
        type: "EC2",
      },
      {
        key: "kubernetesService",
        label: "Kubernetes",
        color: "from-green-500 via-green-400 to-green-600",
        border: "border-green-400",
        type: "EKS",
      },
    ],
    gcp: [
      {
        key: "dbServer",
        label: "SQL",
        color: "from-blue-500 via-blue-400 to-blue-600",
        border: "border-blue-400",
        type: "Cloud SQL",
      },
      {
        key: "serverlessComputing",
        label: "Cloud Function",
        color: "from-purple-500 via-purple-400 to-purple-600",
        border: "border-purple-400",
        type: "Cloud Function",
      },
      {
        key: "computeService",
        label: "Compute Engine",
        color: "from-orange-500 via-orange-400 to-orange-600",
        border: "border-orange-400",
        type: "Compute Engine",
      },
      {
        key: "kubernetesService",
        label: "Kubernetes",
        color: "from-green-500 via-green-400 to-green-600",
        border: "border-green-400",
        type: "GKE",
      },
    ],
  };
  return configs[cloud] || configs.azure;
};

const TableData = ({
  projectName,
  sourceRegion,
  targetRegion,
  onBack,
  failoverData,
  propTopicId 
}) => {
  const [leftTables, setLeftTables] = useState([]);
  const [rightTables, setRightTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableConfigs, setTableConfigs] = useState([]);
  const [selectedLeftRows, setSelectedLeftRows] = useState([]);
  const [progressData, setProgressData] = useState({}); // Store progress per row
  const [checkBoxDisabled, setCheckBoxDisabled] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState(null);
  const [totalFailovered, setTotalFailovered] = useState({});
  const [topicId, setTopicId] = useState(null);

  const { selectedCloud } = useContext(ContextApi);

  // 🔹 if propTopicId is passed, set it
  useEffect(() => {
    if (propTopicId) {
      setTopicId(propTopicId);
    }
  }, [propTopicId]);

  // Function to transform API data to table format
  const transformApiDataToTable = (apiData, tableConfig) => {
    const keyMapping = {
      dbServer: "dbServer",
      serverlessComputing: "serverlessComputing",
      appHosting: "appHosting",
      computeService: "computeService",
      kubernetesService: "kubernetesService",
    };
    const apiKey = keyMapping[tableConfig.key];
    const categoryData = apiData[apiKey] || [];
    return {
      ...tableConfig,
      data: categoryData.map((item) => ({
        id: item.id,
        resourceName: item.name,
        location: item.location,
        status: item.state,
        type: item.type,
      })),
    };
  };

  // Function to match right side data with left side based on name suffix
  const matchRightSideData = (leftData, rightData, suffix) => {
    return leftData.map((leftItem) => {
      const expectedRightName = leftItem.resourceName + suffix;
      let matchingRightItem = null;
      Object.values(rightData).forEach((category) => {
        if (Array.isArray(category)) {
          const found = category.find(
            (rightItem) => rightItem.name === expectedRightName
          );
          if (found) matchingRightItem = found;
        }
      });
      if (matchingRightItem) {
        return {
          ...leftItem,
          resourceName: matchingRightItem.name,
          location: matchingRightItem.location,
          status: matchingRightItem.state,
          type: matchingRightItem.type,
        };
      } else {
        return {
          ...leftItem,
          id: leftItem.id + "-dr", // ← unique ID for DR progress mapping
          resourceName: leftItem.resourceName + suffix,
          location: targetRegion,
          status: "",
        };
      }
    });
  };

  // Function to fetch and process data
  const fetchData = async (projectName) => {
    if (!projectName) return;
    setLoading(true);
    try {
      const suffix = getDrSuffix(selectedCloud);
      const drProjectName = projectName + suffix;
      const currentTableConfigs = getTableConfigs(selectedCloud);
      setTableConfigs(currentTableConfigs);
      const leftData = await fetchInitiateDrResources(
        projectName,
        selectedCloud
      );
      const rightData = await fetchInitiateDrResources(
        drProjectName,
        selectedCloud
      );
      const progressMap = {};
      const jobId = failoverData[0]?.jobId;

      if (jobId) {
        const progressRes = await fetchFailoverProgressResource(jobId);
        console.log(progressRes, "progressRes");

        if (progressRes.resources && Array.isArray(progressRes.resources)) {
          progressRes.resources.forEach((res) => {
            progressMap[res.resourceId] = res;
          });
        }
        setTotalFailovered({
          resourcesTotal: progressRes?.resourcesTotal,
          resourcesCompleted: progressRes?.resourcesCompleted,
          resourcesRunning: progressRes?.resourcesRunning,
          resourcesFailed: progressRes?.resourcesFailed,
        });
      }

      console.log(progressMap, "progressMap");

      const processedLeftTables = currentTableConfigs.map((config) => {
        const table = transformApiDataToTable(leftData, config);
        return {
          ...table,
          data: table.data.map((row) => {
            const progress = progressMap[row.resourceName]; // match by resourceName
            return progress
              ? {
                  ...row,
                  isFailover: true,
                  progressPercent: Math.max(0, 100 - progress.progressPercent),
                  progressStatus: progress.status,
                  progressMessage: progress.message,
                  steps: progress.steps,
                }
              : row;
          }),
        };
      });
      console.log(processedLeftTables, "processedLeftTables");

      const processedRightTables = currentTableConfigs.map((config) => {
        const leftTable = processedLeftTables.find(
          (table) => table.key === config.key
        );

        // Match right side with progressMap using resourceName + suffix
        const matchedRightData = matchRightSideData(
          leftTable.data,
          rightData,
          suffix
        ).map((row) => {
          const progress =
            progressMap[row?.resourceName.slice(0, -suffix.length)];
          console.log(progress, "progress");
          return progress
            ? {
                ...row,
                isFailover: true,
                progressPercent: progress.progressPercent,
                progressStatus: progress.status,
                progressMessage: progress.message,
                steps: progress.steps,
              }
            : row;
        });

        return {
          ...config,
          data: matchedRightData,
        };
      });
      console.log(processedRightTables, "processedRightTables");

      setLeftTables(processedLeftTables);
      setRightTables(processedRightTables);
    } catch (error) {
      const emptyTables = tableConfigs.map((config) => ({
        ...config,
        data: [],
      }));
      setLeftTables(emptyTables);
      setRightTables(emptyTables);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when projectName changes
  React.useEffect(() => {
    if (projectName) {
      fetchData(projectName);
    }
    // eslint-disable-next-line
  }, [projectName]);

  const handleSelectResource = (selectedIds) => {
    setSelectedLeftRows(selectedIds);
    const filteredRows = selectedIds;
    let payload = null;
    if (selectedCloud === "azure") {
      payload = buildAzurePayload(filteredRows, projectName);
    } else if (selectedCloud === "aws") {
      payload = buildAwsPayload(filteredRows, projectName);
    } else if (selectedCloud === "gcp") {
      payload = buildGcpPayload(filteredRows);
    }
    setGeneratedPayload(payload);
  };

  // const handleInitiateDr = () => {
  //   setCheckBoxDisabled(true);
  //   const updatedProgress = {};

  //   console.log("🚀 DR Payload", generatedPayload);

  //   // Optionally call your DR initiation API
  //   // await initiateDR(payload);

  //   // Initialize progress bar for UI animation
  //   selectedLeftRows.forEach((row) => {
  //     updatedProgress[row.id] = 100;
  //     updatedProgress[row.id + "-dr"] = 0;
  //   });

  //   setProgressData(updatedProgress);

  //   const interval = setInterval(() => {
  //     setProgressData((prev) => {
  //       const next = { ...prev };
  //       let done = true;

  //       selectedLeftRows.forEach((row) => {
  //         const leftId = row.id;
  //         const rightId = row.id + "-dr";

  //         if (next[leftId] > 0) {
  //           next[leftId] = Math.max(0, next[leftId] - 10);
  //           done = false;
  //         }

  //         if (next[rightId] < 100) {
  //           next[rightId] = Math.min(100, next[rightId] + 10);
  //           done = false;
  //         }
  //       });

  //       if (done) clearInterval(interval);
  //       return next;
  //     });
  //   }, 300);
  // };

  // Determine how many skeletons to show per side based on current tableConfigs

 // ✅ WebSocket subscription (auto-updates tables)
  useWebSocket(topicId, (payload) => {
    if (payload?.resources) {
      updateTables(payload.resources);

      setTotalFailovered({
        resourcesTotal: payload.resourcesTotal,
        resourcesCompleted: payload.resourcesCompleted,
        resourcesRunning: payload.resourcesRunning,
        resourcesFailed: payload.resourcesFailed,
      });
    }
  });

const handleInitiateDr = async () => {
  if (!generatedPayload) return;

  setCheckBoxDisabled(true);
  console.log("🚀 DR Payload", generatedPayload);

  try {
    // 1. Call the failover initiation API
    const response = await axios.post(
      `https://devapi.drtestdash.com/disaster-recovery/api/cloud/v1/${selectedCloud}/failover-script/execute`,
      generatedPayload
    );

    const result = response?.data?.data;
    console.log(result, "🚀 DR Initiation Response");

    const jobId = result?.jobId;
    const topicId = result?.topic
    if (!jobId) return;

    // 2. Start polling immediately
    const pollProgress = async () => {
      try {
        const progressRes = await fetchFailoverProgressResource(jobId);
        console.log(progressRes, "📊 Progress Response");

        setTotalFailovered({
          resourcesTotal: progressRes.resourcesTotal,
          resourcesCompleted: progressRes.resourcesCompleted,
          resourcesRunning: progressRes.resourcesRunning,
          resourcesFailed: progressRes.resourcesFailed,
        });

        if (progressRes?.resources) {
          updateTables(progressRes.resources);
        }

        // // Keep polling until all completed
        // const allDone = progressRes.resources?.every(
        //   (r) => r.progressPercent === 100 || r.status === "Completed"
        // );
        // if (!allDone) {
        //   setTimeout(pollProgress, 3000);
        // }
      } catch (err) {
        console.error("Error while polling progress:", err);
      }
    };
    pollProgress();
    if (topicId) {
        setTopicId(topicId); // 🚀 trigger WebSocket subscription
      }

  } catch (err) {
    console.error("Error initiating DR:", err);
  }
};

// Reusable function to update tables
const updateTables = (resources) => {
  const progressMap = {};
  resources.forEach((res) => {
    progressMap[res.resourceId] = res;
  });

  setLeftTables((prevTables) =>
    prevTables.map((table) => ({
      ...table,
      data: table.data.map((row) => {
        const progress = progressMap[row.resourceName];
        return progress
          ? {
              ...row,
              isFailover: true,
              progressPercent: Math.max(0, 100 - progress.progressPercent),
              progressStatus: progress.status,
              progressMessage: progress.message,
              steps: progress.steps,
            }
          : row;
      }),
    }))
  );

  setRightTables((prevTables) =>
    prevTables.map((table) => ({
      ...table,
      data: table.data.map((row) => {
        const suffix = getDrSuffix(selectedCloud);
        const baseName = row.resourceName?.slice(0, -suffix.length);
        const progress = progressMap[baseName];
        return progress
          ? {
              ...row,
              isFailover: true,
              progressPercent: progress.progressPercent,
              progressStatus: progress.status,
              progressMessage: progress.message,
              steps: progress.steps,
            }
          : row;
      }),
    }))
  );
};



  const leftSkeletons = tableConfigs.slice(
    0,
    Math.ceil(tableConfigs.length / 2)
  );
  const rightSkeletons = tableConfigs.slice(
    0,
    Math.ceil(tableConfigs.length / 2)
  );
  const leftNonEmpty = leftTables.filter(
    (table) => table.data && table.data.length > 0
  );
  const rightNonEmpty = rightTables.filter(
    (table) => table.data && table.data.length > 0
  );
  const hideStepper = leftNonEmpty.length > 0 && rightNonEmpty.length > 0;

  return (
    <>
      <DrHeader
        projectName={projectName}
        sourceRegion={sourceRegion}
        targetRegion={targetRegion}
        onInitiateDr={handleInitiateDr}
        onBack={onBack}
        hideStepper={hideStepper}
        selectedCloud={selectedCloud}
        totalFailovered={totalFailovered}
      />
      {loading ? (
        <div className="flex gap-8 mt-8">
          <div className="flex-1 flex flex-col gap-8">
            {leftSkeletons.map((_, idx) => (
              <SkeletonTable key={idx} />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-8">
            {rightSkeletons.map((_, idx) => (
              <SkeletonTable key={idx} />
            ))}
          </div>
        </div>
      ) : (
        <TableLayout
          leftTables={leftTables}
          rightTables={rightTables}
          progressData={progressData}
          checkBoxDisabled={checkBoxDisabled}
          selectedRows={selectedLeftRows}
          setSelectedRows={setSelectedLeftRows}
          onSelectResource={handleSelectResource}
        />
      )}
    </>
  );
};

export default TableData;
