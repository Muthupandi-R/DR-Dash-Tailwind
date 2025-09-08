import React from "react";
import { Activity, MapPin, Hash, Cpu, Layers, Copy, Check } from "lucide-react";
import { getLabel } from "../../services/apiService";

const ClusterOverviewCard = ({
  cluster,
  copied,
  copyToClipboard,
  getStatusClasses,
  selectedCloud
}) => {
  return (
    <div>
      {/* Header with enhanced styling */}
      <div className="card-header p-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white drop-shadow-sm">
              {cluster?.name || "Cluster Details"}
            </h2>
            <p className="text-primary-100 text-sm mt-1">
              {getLabel(selectedCloud)} : {cluster?.projectName || "—"}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getStatusClasses(
              cluster?.state
            )}`}
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            {cluster?.state || "Unknown"}
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
                  {cluster?.kubernetesVersion || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-purple-50/80 p-5 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 hover:border-purple-300/60">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="text-white" size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {getLabel(selectedCloud)}
                </p>
                <p className="text-base font-semibold text-gray-900 mt-1 truncate">
                  {cluster?.projectName || "—"}
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
                    {cluster?.cloudAccountId || "—"}
                  </p>
                  {cluster?.cloudAccountId && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(cluster.cloudAccountId)}
                      className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
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
                    {cluster?.state || "Unknown"}
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
  );
};

export default ClusterOverviewCard;
