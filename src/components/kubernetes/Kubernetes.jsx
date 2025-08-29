import React, { useState } from "react";
import KubernetesTable from "./KubernetesTable";
import KubernetesCard from "./KubernetesCard";

const kubernetesData = [
  {
    name: "drd-cluster-az",
    type: "cluster",
    resourceGroup: "az-fb-rg-drd",
    version: "1.31.9",
    location: "East US",
    subscription: "Pay-As-You-Go",
    sku: "Base",
    fleetManager: "Click here to assign",
    state: "Stopped",
    clusterStatus: "Succeeded",
    subscriptionId: "d6240a3c-34a4-4a5c-955b-06228bf34ca8",
    apiServer: "drd-cluster-az-dns-5c3diz9m.hcp.eastus.azmk8s.io",
    networkConfig: "Azure CNI Overlay",
    nodePools: "2 node pools",
    containerRegistries: "Attach a registry",
  },
  {
    name: "drd-kub-cluster",
    type: "cluster",
    resourceGroup: "ats-rg",
    version: "1.31.9",
    location: "East US",
    subscription: "Pay-As-You-Go",
    sku: "Base",
    fleetManager: "Click here to assign",
    state: "Running",
    clusterStatus: "Succeeded",
    subscriptionId: "d6240a3c-34a4-4a5c-955b-06228bf34ca8",
    apiServer: "drd-kub-cluster-dns-9x1z2k7q.hcp.eastus.azmk8s.io",
    networkConfig: "Azure CNI Overlay",
    nodePools: "2 node pools",
    containerRegistries: "Attach a registry",
  },
  {
    name: "prod-cluster-eastus",
    type: "cluster",
    resourceGroup: "rg-production",
    version: "1.30.3",
    location: "East US",
    subscription: "Enterprise-Plan",
    sku: "Standard",
    fleetManager: "Assigned",
    state: "Running",
    clusterStatus: "Succeeded",
    subscriptionId: "a123b456-78c9-4d0e-9f12-6789abcdef01",
    apiServer: "prod-eastus-dns-ab12cd34.hcp.eastus.azmk8s.io",
    networkConfig: "Azure CNI",
    nodePools: "3 node pools",
    containerRegistries: "Connected",
  },
];

const Kubernetes = () => {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const showFullTable = !selectedCluster;

  return (
    <div className="flex overflow-hidden border border-gray-300 rounded-lg shadow-md mt-15">
      {/* Table Section */}
      {(!isExpanded || !selectedCluster) && (
        <div className={`${showFullTable ? "w-full" : "w-[15%]"}`}>
          <KubernetesTable
            clusters={kubernetesData}
            onSelect={(cluster) => {
              setSelectedCluster(cluster);
              setIsExpanded(false);
            }}
            selectedCluster={selectedCluster}
          />
        </div>
      )}

      {/* Card Section */}
      {selectedCluster && (
        <KubernetesCard
          cluster={selectedCluster}
          isExpanded={isExpanded}
          onExpand={() => setIsExpanded(!isExpanded)}
          onClose={() => {
            setSelectedCluster(null);
            setIsExpanded(false);
          }}
        />
      )}
    </div>
  );
};

export default Kubernetes;
