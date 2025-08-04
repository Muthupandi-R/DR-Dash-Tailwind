//index.jsx
import axios from "axios";

export function getOrderStatus(status) {
  const statusMap = {
    RUNNING: {
      textColor: "text-green-600",
      bgColor: "bg-green-100",
      dotColor: "#14804A",
    },
    RUNNABLE: {
      textColor: "text-green-600",
      bgColor: "bg-green-100",
      dotColor: "#14804A",
    },
    STOPPED: {
      textColor: "text-red-600",
      bgColor: "bg-red-100",
      dotColor: "#DC2626",
    },
    PENDING: {
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      dotColor: "#CA8A04",
    },
    ACTIVE: {
      textColor: "text-green-600",
      bgColor: "bg-green-100",
      dotColor: "#14804A",
    },
    AVAILABLE: {
      textColor: "text-green-600",
      bgColor: "bg-green-100",
      dotColor: "#14804A",
    },
    READY: {
      textColor: "text-green-600",
      bgColor: "bg-green-100",
      dotColor: "#14804A",
    },
  };

  const { textColor, bgColor, dotColor } = statusMap[status?.toUpperCase()] || {
    textColor: "text-gray-600",
    bgColor: "bg-gray-100",
    dotColor: "#6B7280",
  };

  return (
    <span
      className={`capitalize py-1 px-2 rounded-md text-xs inline-flex items-center gap-2 ${textColor} ${bgColor}`}
    >
      <span
        className="w-2 h-2 rounded-md text-xs"
        style={{ backgroundColor: dotColor }}
      ></span>
      <span className="text-xs">{status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : ''}</span>
    </span>
  );
}

export async function fetchDataDashboard(selectedCloud,  selectedFilters = {}, searchFilter = "", skipToken = "", pageSize = 5) {
  try {
    // const selconst { selectedCloud } = useContext(ContextApi);

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    let apiUrl = `${baseUrl}/cloud/${selectedCloud}/resources?`;
    const queryParams = [];

    if (Object.keys(selectedFilters).length > 0) {
      const filterString = encodeURIComponent(JSON.stringify(selectedFilters));
      queryParams.push(`filters=${filterString}`);
    }

    if (searchFilter.trim() !== "") {
      queryParams.push(`searchFilter=${encodeURIComponent(searchFilter.trim())}`);
    }
    if (skipToken) {
      queryParams.push(`skipToken=${encodeURIComponent(skipToken)}`);
    }

    queryParams.push(`top=${pageSize}`);

    apiUrl += queryParams.join("&");
    const response = await axios.get(apiUrl);
    return response?.data?.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error; // optional: rethrow for higher-level handling
  }
}

export async function fetchResourceStats(selectedCloud) {
  try {
    let apiUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/cloud/${selectedCloud}/resources-stats`;
    const response = await axios.get(apiUrl);
    return response?.data?.data?.[0];
  } catch (error) {
    console.error("Failed to fetch resource stats:", error);
    throw error;
  }
}

export const getResourceTypeLabel = (type, kind) => {
  const typeMap = {
    "microsoft.compute/virtualmachines": "VirtualMachine",
    "microsoft.sql/servers": "SQL Server",
    "microsoft.containerservice/managedclusters": "Cluster",
  };

  if (typeMap[type]) return typeMap[type];
  if (isWebApp(kind)) return "Web App";
  if (isFunctionApp(kind)) return "Function App";

  return type; // fallback
};

const isWebApp = (kind) => {
  const webAppKinds = new Set([
    "app",
    "app,linux",
    "app,linux,container",
    "app,container",
    "mobileapp",
    "mobileapp,linux",
    "mobileapp,linux,container",
    "api",
    "api,linux",
    "api,linux,container",
  ]);
  return webAppKinds.has(kind);
};

const isFunctionApp = (kind) => {
  const functionAppKinds = new Set([
    "functionapp",
    "functionapp,linux",
    "functionapp,linux,container",
    "elastic",
  ]);
  return functionAppKinds.has(kind);
};

export const statusUpdate = (filteredData, setFilteredData, socketData) => {
  console.log(filteredData, "filteredData");
  
  if(filteredData.length === 0) return;
    const updatedFiltered = filteredData?.map((item) => {
    const isMatchingId =
      item.id?.toLowerCase() === socketData?.topic?.toLowerCase();
    const isMatchingName = item.name === socketData?.data?.name;

    if (isMatchingId && isMatchingName) {
      console.log(`Updating status for item with ID: ${item.id}`);

      const action = socketData?.data?.appEventTypeDetail?.action?.toLowerCase();
      
      const updateState = action === "started" ? "running" : action;

      return {
        ...item,
        state: updateState,
      };
    }

    return item;
  });

  setFilteredData(updatedFiltered);
};

export async function fetchProjects(selectedCloud) {
  try {
    let apiUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/cloud/${selectedCloud}/project-name-list`;
    const response = await axios.get(apiUrl);
    return response?.data?.data?.data;
  } catch (error) {
    console.error("Failed to fetch Projects:", error);
    throw error;
  }
}

export async function fetchInitiateDrResources(projectName, selectedCloud) {
  try {
    let apiUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/cloud/${selectedCloud}/initiate-dr/resources?projectName=${projectName}`;
    const response = await axios.get(apiUrl);
    return response?.data?.data?.["active-nothing-resources"] || [];
   
    
  } catch (error) {
    console.error("Failed to fetch Initiate DR Resources:", error);
    throw error;
  }
}

export function getDrSuffix(cloud) {
  const suffixMap = {
    'azure': '-rg-cus-dr',
    'aws': '-dr',
    'gcp': '-drdd'
  };
  return suffixMap[cloud] || '-rg-cus-dr';
}

