import React, { useState } from "react";
import PodsCard from "./PodsCard";
import ServiceIcon from "../service-icon/ServiceIcon";
import { CalendarDays } from "lucide-react";
import SkeletonTable from "../Loaders/SkeletonTable";
import {
  getOrderStatus,
  fetchPodsData,
  formatDateTime,
} from "../../services/apiService";

export default function NamespacesCard({
  selectedCluster,
  namespaces,
  selectedNamespace,
  setSelectedNamespace,
  selectedCloud,
  loading,
}) {
  const [pods, setPods] = useState([]);
  const [podsLoading, setPodsLoading] = useState(false);

  const fetchPods = async (ns, cluster) => {
    setPodsLoading(true);
    try {
      const data = await fetchPodsData(ns, cluster, selectedCloud);
      setPods(data);
    } catch (err) {
      console.error("error fetching namespace:", err);
    } finally {
      setPodsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="card-header p-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white drop-shadow-sm">
              Namespaces
            </h2>
            <p className="text-primary-100 text-sm mt-1">
              Total: {namespaces?.totalCount} namespaces
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-xs font-semibold text-white">
                {
                  namespaces?.namespacesList?.filter(
                    (ns) => ns.status === "Active"
                  ).length
                }{" "}
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Namespace Table */}
      <div className="p-6">
        <div
          className={`bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/40 overflow-hidden shadow-lg ${
            selectedNamespace ? "hidden" : ""
          }`}
        >
          <div className="overflow-x-auto">
            {loading ? (
              <SkeletonTable rows={4} columns={4} />
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table>
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-50 via-indigo-50 to-purple-50 border-b border-gray-200/60">
                      <th>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          Name
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          Status
                        </div>
                      </th>

                      <th>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                          Created At
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/40">
                    {namespaces?.namespacesList?.map((ns, idx) => (
                      <tr
                        key={idx}
                        onClick={() => {
                          setSelectedNamespace(ns);
                          fetchPods(ns, selectedCluster);
                        }}
                        className={`${
                          idx % 2 === 1 ? "bg-primary-50/40" : "bg-white"
                        } cursor-pointer group`}
                      >
                        <td className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <ServiceIcon
                                cloud={selectedCloud}
                                serviceType={"namespace"}
                              />
                              <div
                                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm 
                    ${
                      ns?.status?.toLowerCase() === "active"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                              ></div>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {ns?.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          {getOrderStatus(ns?.status)}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                              <CalendarDays className="text-white" size={12} />
                            </div>
                            <span className="text-xs text-gray-900 font-medium">
                              {ns?.createdAt
                                ? formatDateTime(ns.createdAt)
                                : "-"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pods Panel */}
        {selectedNamespace && (
          <PodsCard
            pods={pods}
            loading={podsLoading}
            selectedNamespace={selectedNamespace}
            setSelectedNamespace={setSelectedNamespace}
          />
        )}
      </div>
    </div>
  );
}
