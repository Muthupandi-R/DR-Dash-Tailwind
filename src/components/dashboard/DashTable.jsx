import React, { useEffect, useState, useContext, useRef } from "react";
import {
  fetchDataDashboard,
  getOrderStatus,
  getResourceTypeLabel,
  statusUpdate,
} from "../../services/apiService";
import SkeletonTable from "../Loaders/SkeletonTable";
import TableTabs from "./tabs/TableTabs";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import NoDataCard from "./NoDataCard";
import { RiExpandUpDownLine } from "react-icons/ri";
import ContextApi from "../../context/ContextApi";
import ServiceIcon from "../service-icon/ServiceIcon";
import { getStatusColor } from "../../services/apiService";
export default function DashTable() {
  const [filteredData, setFilteredData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef(null);
  const { socketData } = useContext(ContextApi);
  const { selectedCloud } = useContext(ContextApi);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [facets, setFacets] = useState([]);
  const [paginationTokens, setPaginationTokens] = useState([]); // initial page = ""
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setPaginationTokens([""]); // reset to first page
    setCurrentPage(0);
    fetchPaginatedData(0); // initial load
  }, [selectedCloud, selectedFilters, searchFilter, pageSize]);

  useEffect(() => {
    statusUpdate(filteredData, setFilteredData, socketData);
  }, [socketData]);

  // Handle click outside to close sort menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuOpen(false);
      }
    };

    if (sortMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortMenuOpen]);

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

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPaginationTokens([""]); // reset to first page
    setCurrentPage(0);
  };

  const applySort = (field, order) => {
    setSortField(order ? field : null);
    setSortOrder(order);

    if (!filteredData?.length) return;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[field] || "";
      const bValue = b[field] || "";

      if (order === "asc") return aValue.localeCompare(bValue);
      if (order === "desc") return bValue.localeCompare(aValue);
      return 0;
    });

    // update the filteredData.data with sorted version
    setFilteredData(sorted);

    setSortMenuOpen(false);
    if (!order) {
      setSortField(null);
      setSortOrder(null);
      return fetchPaginatedData(0);
    }
  };

  const fetchPaginatedData = async (pageNumber) => {
    setTableLoading(true);
    try {
      const tokenToUse = paginationTokens[pageNumber] || "";
      const data = await fetchDataDashboard(
        selectedCloud,
        selectedFilters,
        searchFilter,
        tokenToUse,
        pageSize
      );

      setFilteredData(data?.data || []);
      setFacets(data?.facets || []);

      const newSkipToken = data?.$skipToken;

      if (newSkipToken) {
        setPaginationTokens((prev) => {
          if (!prev.includes(newSkipToken)) {
            return [...prev, newSkipToken];
          }
          return prev; // don't update if token already exists
        });
      }
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error("Pagination error:", err);
    } finally {
      setTableLoading(false);
    }
  };

  return (
    <div className="bg-gradientPrimary px-4 pt-3 pb-4 rounded-lg flex-1 ">
      <div className="mt-2 flex justify-between items-center">
        <TableTabs facets={facets} setSelectedFilters={setSelectedFilters} />
        <SearchBar setSearchFilter={setSearchFilter} />
      </div>
      <div className="border border-gray-200 rounded-lg mt-1 bg-white/80 shadow-lg">
        {tableLoading ? (
          <SkeletonTable rows={8} columns={5} />
        ) : (
          <>
            <div className="max-h-[50vh] overflow-y-auto scrollbar-thin overflow-x-auto rounded-lg">
              <table>
                <thead className="bg-primary-200">
                  <tr className="bg-gradient-to-r from-primary-50 via-indigo-50 to-purple-50 border-b border-gray-200/60">
                    <th>
                      <div className="inline-flex items-center">
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            className={`peer h-3 w-3 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary-500 checked:border-primary-500 ${
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
                            <span className="absolute text-white text-xs font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              &#8211; {/* this is the dash (–) */}
                            </span>
                          )}
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="relative p-2 text-left  uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        Resource Name
                        <button
                          onClick={() => setSortMenuOpen((prev) => !prev)}
                          className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                        >
                          <RiExpandUpDownLine className="text-xl" />
                        </button>
                      </div>

                      {sortMenuOpen && (
                        <div
                          ref={sortMenuRef}
                          className="absolute top-10 right-14 z-10 w-32 bg-white border rounded shadow-lg text-xs"
                        >
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
                            className={`w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                              !sortField ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!sortField}
                            onClick={() => applySort("name", null)}
                          >
                            <span className="text-gray-700">✕ Remove</span>
                          </button>
                        </div>
                      )}
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        State
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        Type
                      </div>
                    </th>

                    <th>
                      <div className="flex items-center gap-2">
                      Resource Tag
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                       Project Name
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        Location
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/40">
                  {filteredData && filteredData.length > 0 ? (
                    filteredData?.map((data, idx) => (
                      <tr
                        key={data.id}
                        className={`${
                          idx % 2 === 1 ? "bg-primary-50/40" : "bg-white"
                        }`}
                      >
                        <td>
                          <div className="inline-flex items-center">
                            <label className="flex items-center cursor-pointer relative">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(data.id)}
                                className="peer h-3 w-3 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary-500 checked:border-primary-500"
                                onChange={(e) =>
                                  handleRowCheckboxChange(e, data.id)
                                }
                              />
                              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </span>
                            </label>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <ServiceIcon
                                cloud={selectedCloud}
                                serviceType={data?.type}
                              />
                              <div
                                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm 
                    ${getStatusColor(data?.state)}`}
                              ></div>
                            </div>
                            <span className="font-semibold hover:text-primary-600">
                              {data?.name}
                            </span>
                          </div>
                        </td>
                        <td className=" whitespace-nowrap">
                          {getOrderStatus(data?.state)}
                        </td>
                        <td className="whitespace-nowrap font-medium">
                          {getResourceTypeLabel(data?.type, data?.kind)}
                        </td>
                        <td className="whitespace-nowrap font-medium">
                          {data?.resourceTags?.Name || "-"}
                        </td>
                        <td className="whitespace-nowrap font-medium">
                          {data?.projectName || "-"}
                        </td>
                        <td className="whitespace-nowrap">
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
                              {data?.location || "Unknown"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        <NoDataCard />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end mt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={paginationTokens.length}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          onNext={() => {
            if (currentPage + 1 < paginationTokens.length) {
              fetchPaginatedData(currentPage + 1);
            }
          }}
          onPrev={() => {
            if (currentPage > 0) {
              fetchPaginatedData(currentPage - 1);
            }
          }}
        />
      </div>
    </div>
  );
}
