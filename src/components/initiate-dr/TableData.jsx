import React, { useState, useContext } from "react";
import TableLayout from "./TableLayout";
import DrHeader from "./DrHeader";
import { fetchInitiateDrResources, getDrSuffix } from "../../lib/helpers/index";
import SkeletonTable from "../Loaders/SkeletonTable";
import ContextApi from "../../context/ContextApi";

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

const TableData = () => {
  const [leftTables, setLeftTables] = useState([]);
  const [rightTables, setRightTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableConfigs, setTableConfigs] = useState([]);
  const [selectedLeftRows, setSelectedLeftRows] = useState([]);
  const [progressData, setProgressData] = useState({}); // Store progress per row

  const { selectedCloud } = useContext(ContextApi);

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
          location: "Central us",
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
      const processedLeftTables = currentTableConfigs.map((config) =>
        transformApiDataToTable(leftData, config)
      );
      const processedRightTables = currentTableConfigs.map((config) => {
        const leftTable = processedLeftTables.find(
          (table) => table.key === config.key
        );
        return {
          ...config,
          data: matchRightSideData(leftTable.data, rightData, suffix),
        };
      });
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

  // Handle project selection
  const handleProjectSelect = (projectName) => {
    fetchData(projectName);
  };

  const handleInitiateDr = () => {
    const updatedProgress = {};

    // Map rows by ID for quick lookup
    const updatedRows = Object.fromEntries(
      selectedLeftRows.map((row) => [row.id, true])
    );
    console.log(updatedRows, "updatedRows");
    

    // Prepare payload
    let payload = null;

    if (selectedCloud === "azure") {
      payload = selectedLeftRows
        .filter((item) => updatedRows[item.id] && item.id)
        .reduce(
          (acc, item) => {
            if (!acc.subscriptionId) {
              acc.subscriptionId = "d6240a3c-34a4-4a5c-955b-06228bf34ca8"; // hardcoded or dynamic
              acc.resourceGroupName = "selected-rg"; // replace with real `selectedValue` if you have it in state
              acc.targetRegion = "centralus";
              acc.resourceSuffix = "cus-dr";
              acc.provider = "azure";
            }

            const type = item.type?.toLowerCase();
            if (
              type === "appservice" &&
              !acc.webApps.includes(item.resourceName)
            ) {
              acc.webApps.push(item.resourceName);
            } else if (
              type === "functionapp" &&
              !acc.functionApps.includes(item.resourceName)
            ) {
              acc.functionApps.push(item.resourceName);
            } else if (
              type === "virtualmachine" &&
              !acc.virtualMachines.includes(item.resourceName)
            ) {
              acc.virtualMachines.push(item.resourceName);
            } else if (
              type === "sqlservers" &&
              !acc.sqlServers.includes(item.resourceName)
            ) {
              acc.sqlServers.push(item.resourceName);
            } else if (
              type === "logicapp" &&
              !acc.logicApps.includes(item.resourceName)
            ) {
              acc.logicApps.push(item.resourceName);
            } else if (
              type === "kubernetes" &&
              !acc.kubernetes.includes(item.resourceName)
            ) {
              acc.kubernetes.push(item.resourceName);
            }

            return acc;
          },
          {
            subscriptionId: null,
            resourceGroupName: null,
            targetRegion: null,
            resourceSuffix: null,
            webApps: [],
            functionApps: [],
            virtualMachines: [],
            sqlServers: [],
            logicApps: [],
            kubernetes: [],
            provider: null,
          }
        );
    } else if (selectedCloud === "aws") {
      payload = selectedLeftRows
        .filter((item) => updatedRows[item.id] && item.id)
        .reduce(
          (acc, item) => {
            if (!acc.provider) {
              acc.provider = "aws";
              acc.sourceRegion = item.location?.toLowerCase() || "us-east-2";
              acc.targetRegion = "us-west-1";
              acc.resourceSuffix = "-dr";
            }

            const type = item.type?.toLowerCase();
            if (type === "ec2" && !acc.ec2Ids.includes(item.resourceName)) {
              acc.ec2Ids.push(item.resourceName);
            } else if (
              type === "rds" &&
              !acc.rdsIds.includes(item.resourceName)
            ) {
              acc.rdsIds.push(item.resourceName);
            } else if (
              type === "lambda" &&
              !acc.lambdaIds.includes(item.resourceName)
            ) {
              acc.lambdaIds.push(item.resourceName);
            } else if (
              type === "eks" &&
              !acc.eksIds.includes(item.resourceName)
            ) {
              acc.eksIds.push(item.resourceName);
            }

            return acc;
          },
          {
            provider: null,
            sourceRegion: null,
            targetRegion: null,
            resourceSuffix: null,
            ec2Ids: [],
            rdsIds: [],
            lambdaIds: [],
            eksIds: [],
          }
        );
    } else if (selectedCloud === "gcp") {
      payload = selectedLeftRows
        .filter((item) => updatedRows[item.id] && item.id)
        .reduce(
          (acc, item) => {
            if (!acc.provider) {
              acc.provider = "gcp";
              acc.sourceRegion = item.location?.toLowerCase() || "us-east-2";
              acc.targetRegion = "us-central1";
              acc.resourceSuffix = "-drdd";
              acc.sourceProjectId = "drd-project-462808";
              acc.sourceProjectName = "selected-project"; // replace with actual project
            }

            const type = item.type?.toLowerCase();
            if (
              type === "computeengine" &&
              !acc.gceIds.includes(item.resourceName)
            ) {
              acc.gceIds.push(item.resourceName);
              acc.gceSourceZone = "-b";
              acc.gceTargetZone = "-a";
            } else if (
              type === "sql" &&
              !acc.sqlIds.includes(item.resourceName)
            ) {
              acc.sqlIds.push(item.resourceName);
            } else if (
              type === "gke" &&
              !acc.gkeIds.includes(item.resourceName)
            ) {
              acc.gkeIds.push(item.resourceName);
            }

            return acc;
          },
          {
            provider: null,
            sourceRegion: null,
            targetRegion: null,
            resourceSuffix: null,
            sourceProjectId: "",
            sourceProjectName: "",
            gceIds: [],
            sqlIds: [],
            gkeIds: [],
            gceSourceZone: "",
            gceTargetZone: "",
          }
        );
    }

    console.log("🚀 DR Payload", payload);

    // Optionally call your DR initiation API
    // await initiateDR(payload);

    // Initialize progress bar for UI animation      
    selectedLeftRows.forEach((row) => {
      updatedProgress[row.id] = 100;
      updatedProgress[row.id + "-dr"] = 0;
    });

    setProgressData(updatedProgress);

    const interval = setInterval(() => {
      setProgressData((prev) => {
        const next = { ...prev };
        let done = true;

        selectedLeftRows.forEach((row) => {
          const leftId = row.id;
          const rightId = row.id + "-dr";

          if (next[leftId] > 0) {
            next[leftId] = Math.max(0, next[leftId] - 10);
            done = false;
          }

          if (next[rightId] < 100) {
            next[rightId] = Math.min(100, next[rightId] + 10);
            done = false;
          }
        });

        if (done) clearInterval(interval);
        return next;
      });
    }, 300);
  };

  // Determine how many skeletons to show per side based on current tableConfigs
  const leftSkeletons = tableConfigs.slice(
    0,
    Math.ceil(tableConfigs.length / 2)
  );
  const rightSkeletons = tableConfigs.slice(Math.ceil(tableConfigs.length / 2));

  return (
    <>
      <DrHeader
        onProjectSelect={handleProjectSelect}
        onInitiateDr={handleInitiateDr}
      />
      {loading ? (
        <div className="flex gap-8 mt-10">
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
          selectedRows={selectedLeftRows}
          setSelectedRows={setSelectedLeftRows}
          onSelectResource={(selectedIds) => {
            setSelectedLeftRows(selectedIds);
          }}
        />
      )}
    </>
  );
};

export default TableData;
