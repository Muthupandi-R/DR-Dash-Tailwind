import React, { useState } from "react";
import {
  X,
  ChevronsLeft,
  ChevronsRight,
  Activity,
  MapPin,
  Hash,
  Cpu,
  Network,
  Copy,
  Check,
} from "lucide-react";

const KubernetesCard = ({ cluster, isExpanded, onExpand, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedNamespace, setSelectedNamespace] = useState(null);

  // Dummy namespaces for now (replace with API data if needed)
  const namespaces = [
    {
      name: "default",
      status: "Active",
      createdAt: "2024-08-20 10:30",
      pods: [
        { name: "api-server-7f9d8", status: "Running", restarts: 0, age: "2d" },
        { name: "scheduler-5b6c7", status: "Running", restarts: 0, age: "2d" },
      ],
    },
    {
      name: "kube-system",
      status: "Active",
      createdAt: "2024-08-15 08:10",
      pods: [],
    },
    {
      name: "dev",
      status: "Active",
      createdAt: "2024-08-18 12:00",
      pods: [
        { name: "web-6f87c9", status: "Running", restarts: 1, age: "12h" },
      ],
    },
    {
      name: "test",
      status: "Terminating",
      createdAt: "2024-08-10 09:00",
      pods: [],
    },
  ];

  // UI helpers for overview card
  const getStatusClasses = (status) => {
    const normalized = (status || "").toLowerCase();
    if (
      ["running", "active", "succeeded", "ready"].some((s) =>
        normalized.includes(s)
      )
    ) {
      return "text-teal-700 bg-teal-50 ring-1 ring-inset ring-teal-200";
    }
    if (
      ["pending", "provisioning", "updating"].some((s) =>
        normalized.includes(s)
      )
    ) {
      return "text-amber-700 bg-amber-50 ring-1 ring-inset ring-amber-200";
    }
    if (
      ["failed", "error", "terminating"].some((s) => normalized.includes(s))
    ) {
      return "text-red-700 bg-red-50 ring-1 ring-inset ring-red-200";
    }
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
            className="p-2 bg-gradient-to-r from-primary-500 to-indigo-600 text-white rounded-xl hover:from-primary-600 hover:to-indigo-700 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            onClick={onExpand}
          >
            {isExpanded ? (
              <ChevronsRight size={18} />
            ) : (
              <ChevronsLeft size={18} />
            )}
          </button>
          <span className="text-xs font-semibold text-gray-800 bg-gray-50/90 px-3 py-1.5 rounded-full border border-gray-200/60 shadow-sm">
            {cluster?.name}
          </span>
        </div>
        <button
          className="absolute top-2 right-2 p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Sidebar */}
        <div className="w-52 border-r-3 border-gray-300 pr-6 mt-8">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-lg shadow-primary-500/30 transform scale-105"
                    : "hover:bg-gradient-to-r hover:from-primary-50 hover:to-indigo-50 hover:text-primary-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeTab === "overview" ? "bg-white" : "bg-primary-400"
                    }`}
                  ></div>
                  Overview
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("namespaces");
                  setSelectedNamespace(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 ${
                  activeTab === "namespaces"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 transform scale-105"
                    : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeTab === "namespaces" ? "bg-white" : "bg-emerald-400"
                    }`}
                  ></div>
                  Namespaces
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 pl-8 overflow-y-auto mt-6">
          {activeTab === "overview" && (
            <>
              <div className="bg-gradient-to-br from-white via-primary-50/30 to-indigo-50/50 rounded-3xl border border-gray-200/60 shadow-xl shadow-primary-500/10 overflow-hidden backdrop-blur-sm">
                {/* Header with enhanced styling */}
                <div className="relative p-4 border-b border-gray-200/60 bg-gradient-to-r from-primary-500 to-indigo-500 text-white">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white drop-shadow-sm">
                        {cluster?.name || "Cluster Details"}
                      </h2>
                      <p className="text-primary-100 text-sm mt-1">
                        Resource Group: {cluster?.resourceGroup || "—"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getStatusClasses(
                        cluster?.clusterStatus
                      )}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                      {cluster?.clusterStatus || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Main content with enhanced cards */}
                <div className="p-5 space-y-5">
                  {/* Top row - 3 cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/80 p-5 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-1 hover:border-primary-300/60">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full -translate-y-10 translate-x-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <MapPin className="text-white" size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Location
                          </p>
                          <p className="text-base font-semibold text-gray-900 mt-1 truncate">
                            {cluster?.location || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-emerald-50/80 p-5 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 hover:border-emerald-300/60">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-10 translate-x-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Cpu className="text-white" size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Kubernetes Version
                          </p>
                          <p className="text-base font-semibold text-gray-900 mt-1 truncate">
                            {cluster?.version || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-purple-50/80 p-5 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 hover:border-purple-300/60">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Network className="text-white" size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Network Config
                          </p>
                          <p className="text-base font-semibold text-gray-900 mt-1 truncate">
                            {cluster?.networkConfig || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row - 2 larger cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-amber-50/80 p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1 hover:border-amber-300/60">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Hash className="text-white" size={17} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Subscription ID
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <p className="text-base font-semibold text-gray-900 truncate bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm">
                              {cluster?.subscriptionId || "—"}
                            </p>
                            {cluster?.subscriptionId && (
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(cluster.subscriptionId)
                                }
                                className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                              >
                                {copied ? (
                                  <Check size={14} />
                                ) : (
                                  <Copy size={14} />
                                )}
                                {copied ? "Copied!" : "Copy"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-rose-50/80 p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/20 hover:-translate-y-1 hover:border-rose-300/60">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Activity className="text-white" size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Cluster Status
                          </p>
                          <div className="mt-2">
                            <p className="text-base font-semibold text-gray-900">
                              {cluster?.clusterStatus || "Unknown"}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse"></div>
                              <span className="text-sm text-gray-600">
                                All systems operational
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "namespaces" && (
            <>
              {cluster?.state?.toLowerCase().includes("stopped") ? (
                <div className="bg-gradient-to-br from-white via-red-50/30 to-pink-50/50 rounded-3xl border border-gray-200/60 shadow-xl shadow-red-500/10 overflow-hidden backdrop-blur-sm">
                  {/* Header with warning styling */}
                  {/* <div className="relative p-4 border-b border-gray-200/60 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-white drop-shadow-sm">
                          Cluster Stopped
                        </h2>
                        <p className="text-red-100 text-sm mt-1">
                          This cluster is not running
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-white">
                          Power State: Stopped
                        </span>
                      </div>
                    </div>
                  </div> */}

                  {/* Main content with warning message */}
                  <div className="p-8 text-center">
                    <div className="max-w-md mx-auto">
                      {/* Warning Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>

                      {/* Message */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        No Resources Available
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-xs">
                        There are no resources currently running on this cluster
                        because the cluster is stopped. Restart the cluster to
                        view resources.
                      </p>

                      {/* Status Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Power State: Stopped
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Restart Cluster
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Learn More
                        </button>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-8 p-4 bg-gray-50/80 rounded-xl border border-gray-200/40">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            Cluster resources will become available once
                            restarted
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl border border-gray-200/60 shadow-xl shadow-emerald-500/10 overflow-hidden backdrop-blur-sm">
                  {/* Header with enhanced styling */}
                  <div className="relative p-6 border-b border-gray-200/60 bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-600 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-white drop-shadow-sm">
                          Namespaces
                        </h2>
                        <p className="text-emerald-100 text-sm mt-1">
                          Total: {namespaces.length} namespaces
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                          <span className="text-sm font-semibold text-white">
                            {
                              namespaces.filter((ns) => ns.status === "Active")
                                .length
                            }{" "}
                            Active
                          </span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                          <span className="text-sm font-semibold text-white">
                            {namespaces.reduce(
                              (sum, ns) => sum + (ns.pods?.length || 0),
                              0
                            )}{" "}
                            Total Pods
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced table */}
                  <div className="p-6">
                    <div
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/40 overflow-hidden shadow-lg ${
                        selectedNamespace ? "hidden" : ""
                      }`}
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200/60">
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Created at
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200/60">
                            {namespaces.map((ns, idx) => (
                              <tr
                                key={idx}
                                onClick={() => setSelectedNamespace(ns)}
                                className={`cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-200 group ${
                                  selectedNamespace?.name === ns.name
                                    ? "bg-emerald-50/60"
                                    : ""
                                }`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                      <span className="text-white text-sm font-bold">
                                        {ns.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {ns.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                      ns.status === "Active"
                                        ? "text-teal-700 bg-teal-100 ring-1 ring-inset ring-teal-200"
                                        : "text-red-700 bg-red-100 ring-1 ring-inset ring-red-200"
                                    }`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        ns.status === "Active"
                                          ? "bg-teal-500"
                                          : "bg-red-500"
                                      }`}
                                    ></div>
                                    {ns.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-medium text-gray-700">
                                    {ns.createdAt || "-"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pods panel */}
                    {selectedNamespace && (
                      <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/40 overflow-hidden shadow-lg">
                        <div className="relative p-5 border-b border-gray-200/60 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 text-white">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative flex items-center gap-2">
                            <button
                              onClick={() => setSelectedNamespace(null)}
                              className="text-white/90 hover:text-white underline-offset-4 hover:underline text-sm font-medium"
                            >
                              Namespaces
                            </button>
                            <svg
                              className="w-4 h-4 text-white/80"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <span className="text-sm font-semibold">
                              {selectedNamespace.name}
                            </span>
                          </div>
                        </div>

                        {selectedNamespace.pods &&
                        selectedNamespace.pods.length > 0 ? (
                          <div className="p-5 overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200/60">
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Pod Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Restarts
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Age
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200/60">
                                {selectedNamespace.pods.map((pod, i) => (
                                  <tr
                                    key={i}
                                    className="hover:bg-emerald-50/50 transition-colors"
                                  >
                                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                      {pod.name}
                                    </td>
                                    <td className="px-6 py-3">
                                      <span
                                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                          pod.status
                                            ?.toLowerCase()
                                            .includes("running")
                                            ? "text-teal-700 bg-teal-100 ring-1 ring-inset ring-teal-200"
                                            : pod.status
                                                ?.toLowerCase()
                                                .includes("pending")
                                            ? "text-amber-700 bg-amber-100 ring-1 ring-inset ring-amber-200"
                                            : "text-red-700 bg-red-100 ring-1 ring-inset ring-red-200"
                                        }`}
                                      >
                                        <div
                                          className={`w-2 h-2 rounded-full ${
                                            pod.status
                                              ?.toLowerCase()
                                              .includes("running")
                                              ? "bg-teal-500"
                                              : pod.status
                                                  ?.toLowerCase()
                                                  .includes("pending")
                                              ? "bg-amber-500"
                                              : "bg-red-500"
                                          }`}
                                        ></div>
                                        {pod.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-800">
                                      {pod.restarts}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-800">
                                      {pod.age}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-10 text-center">
                            <div className="max-w-md mx-auto">
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 13h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <h4 className="text-base font-semibold text-gray-900 mb-1">
                                No Pods Found
                              </h4>
                              <p className="text-sm text-gray-600">
                                This namespace currently has no running pods.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KubernetesCard;
