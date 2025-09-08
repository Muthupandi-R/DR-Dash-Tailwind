import React, { useState } from "react";
import {
  X,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Boxes,
} from "lucide-react";
import ClusterOverviewCard from "./ClusterOverviewCard";
import MessageStopped from "./MessageStopped";
import NamespacesCard from "./NamespacesCard";
import { fetchNamespaceData } from "../../services/apiService";

const KubernetesCard = ({
  cluster,
  isExpanded,
  onExpand,
  onClose,
  selectedCloud,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [namespaceData, setNamespaceData] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [isExpandedCard, setIsExpandedCard] = useState(true);

  const getStatusClasses = (status) => {
    const normalized = (status || "").toLowerCase();

    const statusMap = [
      {
        keywords: ["running", "active", "succeeded", "ready"],
        classes: "text-teal-700 bg-teal-50 ring-1 ring-inset ring-teal-200",
      },
      {
        keywords: ["pending", "provisioning", "updating", "stopped"],
        classes: "text-amber-700 bg-amber-50 ring-1 ring-inset ring-amber-200",
      },
    ];

    for (const { keywords, classes } of statusMap) {
      if (keywords.some((s) => normalized.includes(s))) {
        return classes;
      }
    }

    // fallback (optional)
    return "text-gray-700 bg-gray-50 ring-1 ring-inset ring-gray-200";
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      // ignore
    }
  };

  const fetchNamespaces = async (cluster) => {
    setTableLoading(true);
    try {
      const data = await fetchNamespaceData(cluster, selectedCloud);
      setNamespaceData(data);
    } catch (err) {
      console.error("error fetching namespace:", err);
    } finally {
      setTableLoading(false);
    }
  };

  return (
    <div
      className={`transition-all duration-300 p-2 ${
        isExpanded ? "w-full" : "w-[85%]"
      }`}
    >
      <div className="relative bg-gradient-to-br from-white via-gray-50/50 to-primary-50/30 rounded-2xl shadow-xl shadow-primary-500/10 p-6 border border-gray-200/60 h-full flex backdrop-blur-sm">
        {/* Action Buttons */}
        <div className="absolute top-2 left-2 flex gap-2">
          <button
            className="p-2 bg-gradient-to-r from-primary-400 to-indigo-400 text-white rounded-xl hover:from-primary-500 hover:to-indigo-500 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            onClick={onExpand}
          >
            {isExpanded ? (
              <ChevronsRight size={14} />
            ) : (
              <ChevronsLeft size={14} />
            )}
          </button>
          <span className="text-xs font-semibold text-gray-800 bg-gray-50/90 px-3 py-1.5 rounded-full border border-gray-200/60 shadow-sm">
            {cluster?.name}
          </span>
        </div>
        <button
          className="absolute top-2 right-2 p-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl hover:from-red-500 hover:to-pink-500 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          onClick={onClose}
        >
          <X size={14} />
        </button>

        {/* Sidebar */}
        <div
          className={`relative transition-all duration-300 ${
            isExpandedCard ? "w-42 pr-6" : "w-14 pr-4"
          } border-r-2 border-gray-300 mt-8`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpandedCard(!isExpandedCard)}
            className="absolute -right-3 top-1 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-100 cursor-pointer"
          >
            {isExpandedCard ? (
              <ChevronsLeft size={14} />
            ) : (
              <ChevronsRight size={14} />
            )}
          </button>

          <ul className="space-y-2 mt-6 relative z-30">
            {/* Overview */}
            <li className="relative group">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-3 py-2 rounded-2xl font-medium text-xs transition-all duration-300 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-primary-400 to-indigo-400 text-white shadow-lg shadow-primary-500/30 transform scale-105"
                    : "hover:bg-gradient-to-r hover:from-primary-50 hover:to-indigo-50 hover:text-primary-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard
                    className={`w-3 h-3 ${
                      activeTab === "overview"
                        ? "text-white"
                        : "text-primary-500"
                    }`}
                  />
                  {isExpandedCard && <span>Overview</span>}
                </div>
              </button>
              {!isExpandedCard && (
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-primary-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Overview
                </span>
              )}
            </li>

            {/* Namespaces */}
            <li className="relative group">
              <button
                onClick={() => {
                  if (activeTab !== "namespaces") {
                    setActiveTab("namespaces");
                    setSelectedNamespace(null);
                    fetchNamespaces(cluster);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-2xl font-medium text-xs transition-all duration-300 cursor-pointer ${
                  activeTab === "namespaces"
                    ? "bg-gradient-to-r from-primary-400 to-indigo-400 text-white shadow-lg shadow-primary-500/30 transform scale-105"
                    : "hover:bg-gradient-to-r hover:from-primary-50 hover:to-indigo-50 hover:text-primary-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Boxes
                    className={`w-3 h-3 ${
                      activeTab === "namespaces"
                        ? "text-white"
                        : "text-primary-500"
                    }`}
                  />
                  {isExpandedCard && <span>Namespaces</span>}
                </div>
              </button>
              {!isExpandedCard && (
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-primary-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Namespaces
                </span>
              )}
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-48 flex-1 pl-8 overflow-y-auto mt-6">
          <div className="bg-gradient-to-br from-white via-primary-50/30 to-indigo-50/50 rounded-3xl border border-gray-200/60 shadow-xl shadow-primary-500/10 overflow-hidden backdrop-blur-sm">
            {activeTab === "overview" && (
              <ClusterOverviewCard
                cluster={cluster}
                copied={copied}
                copyToClipboard={copyToClipboard}
                getStatusClasses={getStatusClasses}
                selectedCloud={selectedCloud}
              />
            )}

            {activeTab === "namespaces" && (
              <>
                {cluster?.state?.toLowerCase().includes("stopped") ? (
                  <MessageStopped />
                ) : (
                  <NamespacesCard
                    selectedCluster={cluster}
                    namespaces={namespaceData}
                    selectedNamespace={selectedNamespace}
                    setSelectedNamespace={setSelectedNamespace}
                    selectedCloud={selectedCloud}
                    loading={tableLoading}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KubernetesCard;
