import React, { useContext } from "react";
import { getOrderStatus } from "../../services/apiService";
import ServiceIcon from "../service-icon/ServiceIcon";
import ContextApi from "../../context/ContextApi";
import SkeletonTable from "../Loaders/SkeletonTable";
import { Cpu } from "lucide-react";
import CardSkeleton from "../Loaders/CardSkeleton";

const KubernetesTable = ({ clusters, onSelect, selectedCluster, loading }) => {
  console.log(clusters, "clusters");
  const { selectedCloud } = useContext(ContextApi);

  return (
    <div className={`w-full h-full bg-gradient-to-br from-white via-primary-50/30 to-indigo-50/20 ${!selectedCluster ? "rounded-2xl" : ""} border border-gray-200/60 shadow-lg shadow-primary-500/10 overflow-hidden backdrop-blur-sm`}>
      <div className={`${!selectedCluster ? "p-6" : "p-2"}`}>
        <div className="flex items-center justify-between">
          <div className={`${!selectedCluster ? "mb-6" : "mb-2"}`}>
            <h2
              className={`${
                !selectedCluster ? "text-2xl" : "text-l text-center"
              } font-bold bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent`}
            >
              Kubernetes Clusters
            </h2>
            {!selectedCluster && (
              <p className="text-gray-600 mt-2">
                Manage and monitor your container orchestration clusters
              </p>
            )}
          </div>

          {/* Summary Stats */}
          {(!selectedCluster && !loading) ? (
            <div
              className={`mb-6 ${
                selectedCluster
                  ? "grid grid-cols-1 gap-4"
                  : "grid grid-cols-1 sm:grid-cols-3 gap-4"
              }`}
            >
              <div
                className={`bg-gradient-to-r from-primary-400 to-indigo-400 rounded-xl ${
                  selectedCluster ? "p-3" : "p-4"
                } text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-primary-100 ${
                        selectedCluster ? "text-xs" : "text-sm"
                      }`}
                    >
                      Total Clusters
                    </p>
                    <p
                      className={`${
                        selectedCluster ? "text-xl" : "text-2xl"
                      } font-bold`}
                    >
                      {clusters.length}
                    </p>
                  </div>
                  <div
                    className={`${
                      selectedCluster ? "w-8 h-8" : "w-12 h-12"
                    } bg-white/20 rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className={`${selectedCluster ? "w-5 h-5" : "w-6 h-6"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className={`bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl ${
                  selectedCluster ? "p-3" : "p-4"
                } text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-emerald-100 ${
                        selectedCluster ? "text-xs" : "text-sm"
                      }`}
                    >
                      Active Clusters
                    </p>
                    <p
                      className={`${
                        selectedCluster ? "text-xl" : "text-2xl"
                      } font-bold`}
                    >
                      {
                        clusters?.filter(
                          (c) =>
                            c?.state?.toLowerCase().includes("running") ||
                            c?.state?.toLowerCase().includes("active")
                        ).length
                      }
                    </p>
                  </div>
                  <div
                    className={`${
                      selectedCluster ? "w-8 h-8" : "w-12 h-12"
                    } bg-white/20 rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className={`${selectedCluster ? "w-5 h-5" : "w-6 h-6"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className={`bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl ${
                  selectedCluster ? "p-3" : "p-4"
                } text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-amber-100 ${
                        selectedCluster ? "text-xs" : "text-sm"
                      }`}
                    >
                      Other Status
                    </p>
                    <p
                      className={`${
                        selectedCluster ? "text-xl" : "text-2xl"
                      } font-bold`}
                    >
                      {
                        clusters.filter(
                          (c) =>
                            !(
                              c?.state?.toLowerCase().includes("running") ||
                              c?.state?.toLowerCase().includes("active")
                            )
                        ).length
                      }
                    </p>
                  </div>
                  <div
                    className={`${
                      selectedCluster ? "w-8 h-8" : "w-12 h-12"
                    } bg-white/20 rounded-lg flex items-center justify-center`}
                  >
                    <svg
                      className={`${selectedCluster ? "w-5 h-5" : "w-6 h-6"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : loading ? <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <CardSkeleton key={idx} />
                  ))}
              </div> : ""}
        </div>

        <div className={`bg-white/80 backdrop-blur-sm ${!selectedCluster ? "rounded-lg" : ""} border border-gray-200/40 overflow-hidden shadow-lg`}>
          <div
            className={`overflow-x-auto ${
              clusters.length > 6 ? "max-h-96 overflow-y-auto" : ""
            }`}
          >
            {loading ? (
              <SkeletonTable rows={5} columns={5} />
            ) : (
              <table>
                <thead>
                  <tr className="bg-gradient-to-r from-primary-50 via-indigo-50 to-purple-50 border-b border-gray-200/60">
                    <th
                      className={` ${
                        selectedCluster ? "text-center" : "text-left"
                      } `}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        Name
                      </div>
                    </th>
                    {!selectedCluster && (
                      <>
                        <th>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            State
                          </div>
                        </th>

                        <th>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            Project Name
                          </div>
                        </th>
                        <th>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            Kubernetes Version
                          </div>
                        </th>
                        <th>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            Location
                          </div>
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/40">
                  {clusters.map((cluster, index) => ( 
                    <tr
                      key={index}
                      className={`${
                        selectedCluster &&
                        ((selectedCluster?.id &&
                          selectedCluster?.id === cluster?.id) ||
                          selectedCluster?.name === cluster?.name)
                          ? "bg-primary-100 ring-2 ring-primary-300 border-l-4 border-primary-500"
                          : index % 2 === 1
                          ? "bg-primary-50/40"
                          : "bg-white"
                      } cursor-pointer group`}
                      onClick={() => onSelect(cluster)}
                    >
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <ServiceIcon
                              cloud={selectedCloud}
                              serviceType={cluster?.type}
                            />
                            <div
                              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm 
                    ${
                      cluster?.state.toLowerCase() === "running" || cluster?.state.toLowerCase() === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                            ></div>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {cluster?.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      {!selectedCluster && (
                        <>
                          <td className="p-2 whitespace-nowrap">
                            {getOrderStatus(cluster?.state)}
                          </td>

                          <td>
                            {/* <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {cluster?.projectName
                                    ?.charAt(0)
                                    ?.toUpperCase() || "P"}
                                </span>
                              </div>
                              <span className="text-xs text-gray-900">
                                {cluster?.projectName || "-"}
                              </span>
                            </div> */}
                             <span className="text-xs text-gray-900">
                                {cluster?.projectName || "-"}
                              </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                                <Cpu className="text-white" size={12} />
                              </div>
                              <span className="text-xs text-gray-900 font-medium">
                                {cluster?.kubernetesVersion || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-900 font-medium">
                                {cluster?.location || "Unknown"}
                              </span>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KubernetesTable;
