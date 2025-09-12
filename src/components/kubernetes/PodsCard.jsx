import React from "react";
import MessageNoPods from "./MessageNoPods";
import SkeletonTable from "../Loaders/SkeletonTable";
import { CalendarDays, Info } from "lucide-react";
import { FaCube } from "react-icons/fa";
import { getOrderStatus, formatDateTime } from "../../services/apiService";

export default function PodsCard({
  pods,
  loading,
  selectedNamespace,
  setSelectedNamespace,
}) {
  return (
    <div className="mt-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/40 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="card-header p-3">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="flex items-center justify-between">
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setSelectedNamespace(null)}
              className="text-white/90 hover:text-white underline-offset-4 hover:underline text-sm font-medium cursor-pointer"
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
              {selectedNamespace?.name}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-xs font-semibold text-white">
              {loading ? "0" : pods?.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* Pods Table */}
      {loading ? (
        <SkeletonTable rows={4} columns={4} />
      ) : pods && pods.length > 0 ? (
        <div className="p-5 overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-primary-50 via-indigo-50 to-purple-50 border-b border-gray-200/60">
                  <th
                    rowSpan={2}
                    scope="rowgroup"
                    className="border-3 border-gray-300 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      Name
                    </div>
                  </th>
                  <th
                    rowSpan={2}
                    scope="rowgroup"
                    className="border-3 border-gray-300 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Status
                    </div>
                  </th>
                  <th
                    colSpan={2}
                    scope="colgroup"
                    className="border-3 border-gray-300 px-3 py-2 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Utilization
                    </div>
                  </th>
                  <th
                    rowSpan={2}
                    scope="rowgroup"
                    className="border-3 border-gray-300 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      Created At
                    </div>
                  </th>
                  <th
                    rowSpan={2}
                    scope="rowgroup"
                    className="border-3 border-gray-300 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Node
                    </div>
                  </th>
                </tr>
                <tr className="bg-gradient-to-r from-primary-50 via-indigo-50 to-purple-50 border-b border-gray-200/60">
                  <th
                    scope="col"
                    className="border-3 border-gray-300 px-3 py-2 text-center"
                  >
                    CPU
                  </th>
                  <th
                    scope="col"
                    className="border-3 border-gray-300 px-3 py-2 text-center"
                  >
                    Memory
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200/40">
                {pods.map((pod, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 1 ? "bg-primary-50/40" : "bg-white"
                    } `}
                  >
                    <td className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <FaCube className="text-indigo-700" size={14} />
                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm 
                    ${
                      pod?.status?.toLowerCase() === "running"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                          ></div>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {pod?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {getOrderStatus(pod?.status)}
                    </td>
                    {/* CPU */}
                    <td className="p-2 whitespace-nowrap relative">
                      <div className="flex items-center gap-1">
                        {/* Info icon with tooltip */}
                        <div className="relative group">
                          <Info
                            size={14}
                            className="text-gray-500 hover:text-primary-600 cursor-pointer"
                          />
                          {/* Tooltip */}
                          <div className="absolute left-0 bottom-full mt-2 w-64 bg-indigo-50 border border-indigo-100 rounded-xl shadow-lg p-4 text-xs text-gray-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform scale-95 group-hover:scale-100 z-20">
                            <div className="space-y-2">
                              <p className="flex justify-between">
                                <span className="font-semibold text-gray-900">
                                  CPU Usage:
                                </span>
                                <span>{pod?.cpuUsage || "-"}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="font-semibold text-gray-900">
                                  CPU Requests:
                                </span>
                                <span>{pod?.cpuRequest || "-"}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="font-semibold text-gray-900">
                                  CPU Limits:
                                </span>
                                <span>{pod?.cpuLimit || "-"}</span>
                              </p>
                            </div>

                            {/* Decorative arrow at bottom */}
                            <div className="absolute -bottom-2 left-4 w-3 h-3 bg-indigo-50 border-r border-b border-indigo-100 rotate-45"></div>
                          </div>
                        </div>
                        {pod?.cpuUtilization && pod?.cpuUtilization !== "N/A"
                          ? pod.cpuUtilization
                          : "-"}
                      </div>
                    </td>

                    {/* Memory */}
                    <td className="p-2 whitespace-nowrap relative">
                      <div className="flex items-center gap-1">
                        {/* Info icon with tooltip */}
                        <div className="relative group">
                          <Info
                            size={14}
                            className="text-gray-500 hover:text-primary-600 cursor-pointer"
                          />        

                          {/* Tooltip */}
                          <div className="absolute left-0 bottom-full mt-2 w-64 bg-indigo-50 border border-indigo-100 rounded-xl shadow-lg p-4 text-xs text-gray-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform scale-95 group-hover:scale-100 z-20">  
                            <div className="space-y-2">
                              <p className="flex justify-between">
                                <span className="font-semibold text-gray-900">
                                  Memory Usage:
                                </span>
                                <span>{pod?.memoryUsage || "-"}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="font-semibold text-gray-900">
                                  Memory Requests:
                                </span>
                                <span>{pod?.memoryRequest || "-"}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="font-semibold text-gray-900">
                                  Memory Limits:
                                </span>
                                <span>{pod?.memoryLimit || "-"}</span>
                              </p>
                            </div>

                            {/* Decorative arrow at bottom */}
                            <div className="absolute -bottom-2 left-4 w-3 h-3 bg-indigo-50 border-r border-b border-indigo-100 rotate-45"></div>
                          </div>
                        </div>
                        <span>
                          {" "}
                          {pod?.memoryUtilization &&
                          pod?.memoryUtilization !== "N/A"
                            ? pod.memoryUtilization
                            : "-"}
                        </span>
                      </div>
                    </td>

                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <CalendarDays className="text-white" size={12} />
                        </div>
                        <span className="text-xs text-gray-900 font-medium">
                          {pod?.createdAt ? formatDateTime(pod.createdAt) : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">{pod?.node}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <MessageNoPods />
      )}
    </div>
  );
}
