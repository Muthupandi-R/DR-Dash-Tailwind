import React, { useEffect, useState, useContext } from "react";
import {
  fetchDataDashboard,
  getOrderStatus,
  getResourceTypeLabel,
  statusUpdate,
} from "../../lib/helpers";
import { FiMapPin } from "react-icons/fi";
import SkeletonTable from "../Loaders/SkeletonTable";
import TableTabs from "./tabs/TableTabs";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import { RiExpandUpDownLine } from "react-icons/ri";
import ContextApi from "../../context/ContextApi";

export default function DashTable() {
  const [filteredData, setFilteredData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const { socketData } = useContext(ContextApi);

  useEffect(() => {
    const fetchData = async () => {
      setTableLoading(true);
      try {
        const data = await fetchDataDashboard();
        const updatedData = data?.map((item) => ({
          ...item,
          state:
            item?.state === "PowerState/deallocated"
              ? "Stopped"
              : item?.state === "PowerState/running"
              ? "Running"
              : item?.state,
        }));
        setFilteredData(updatedData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setTableLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    statusUpdate(filteredData, setFilteredData, socketData);
  }, [socketData]);

  const isAllSelected =
    filteredData.length > 0 && selectedIds.length === filteredData.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < filteredData.length;

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allIds = filteredData.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowCheckboxChange = (e, rowId) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, rowId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== rowId));
    }
  };

  const applySort = (field, order) => {
    setSortField(order ? field : null);
    setSortOrder(order);

    let sortedData = [...filteredData];
    if (order === "asc") {
      sortedData.sort((a, b) => a[field]?.localeCompare(b[field] || ""));
    } else if (order === "desc") {
      sortedData.sort((a, b) => b[field]?.localeCompare(a[field] || ""));
    }

    setFilteredData(sortedData);
    setSortMenuOpen(false);
  };

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <div className="mt-2 flex justify-between items-center">
        <TableTabs />
        <SearchBar />
      </div>
      <div className="border border-gray-200 rounded-sm mt-1">
        {tableLoading ? (
          <SkeletonTable rows={8} columns={5} />
        ) : (
          <>
            <div className="max-h-[50vh] overflow-y-auto scrollbar-thin overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3">
                      <div className="inline-flex items-center">
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            className={`peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary-500 checked:border-primary-500 ${
                              isIndeterminate && !isAllSelected
                                ? "bg-primary-500 checked:border-primary-500"
                                : ""
                            }`}
                            ref={(el) => {
                              if (el) el.indeterminate = isIndeterminate;
                            }}
                            onChange={handleSelectAllChange}
                          />

                          {/* Checkmark for "checked" */}
                          {isAllSelected && (
                            <span className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}

                          {/* Hyphen for "indeterminate" */}
                          {isIndeterminate && !isAllSelected && (
                            <span className="absolute text-white text-sm font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              &#8211; {/* this is the dash (–) */}
                            </span>
                          )}
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="relative p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        Resource Name
                        <button
                          onClick={() => setSortMenuOpen((prev) => !prev)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <RiExpandUpDownLine className="text-xl" />
                        </button>
                      </div>

                      {sortMenuOpen && (
                        <div className="absolute top-12 left-0 z-10 w-32 bg-white border rounded shadow-lg text-sm">
                          <button
                            className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => applySort("name", "asc")}
                          >
                            <span className="text-gray-700">↑ Asc</span>
                          </button>
                          <button
                            className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => applySort("name", "desc")}
                          >
                            <span className="text-gray-700">↓ Desc</span>
                          </button>
                          <button
                            className="w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => applySort("name", null)}
                          >
                            <span className="text-gray-700">✕ Remove</span>
                          </button>
                        </div>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Resource Group
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Resource Tag
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Project Name
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((data) => (
                    <tr
                      key={data.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-3">
                        {/* <input
                        type="checkbox"
                        checked={selectedIds.includes(data.id)}
                        onChange={(e) => handleRowCheckboxChange(e, data.id)}
                      /> */}
                        <div class="inline-flex items-center">
                          <label class="flex items-center cursor-pointer relative">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(data.id)}
                              className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary-500 checked:border-primary-500"
                              onChange={(e) =>
                                handleRowCheckboxChange(e, data.id)
                              }
                            />
                            <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-900">
                        <h1 className="font-medium text-base text-primary-700 border-b border-transparent hover:border-primary-600 w-fit cursor-pointer">
                          {data?.name}
                        </h1>
                      </td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-900">
                        {getOrderStatus(data?.state)}
                      </td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-900">
                        {getResourceTypeLabel(data?.type, data?.kind)}
                      </td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-900">
                        {data?.projectName}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data?.resourceTags?.Name || "-"}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data?.projectTags?.Name}
                      </td>
                      <td className="flex items-center gap-2 border-0 text-sm text-gray-800">
                        <FiMapPin className="text-blue-600" />
                        {data?.location || "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end mt-2">
        <Pagination />
      </div>
    </div>
  );
}
