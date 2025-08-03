import React, { useEffect, useState, useContext } from "react";
import {
  fetchDataDashboard,
  getOrderStatus,
  getResourceTypeLabel,
  statusUpdate,
} from "../../services/apiService";
import { FiMapPin } from "react-icons/fi";
import SkeletonTable from "../Loaders/SkeletonTable";
import TableTabs from "./tabs/TableTabs";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import { RiExpandUpDownLine } from "react-icons/ri";
import ContextApi from "../../context/ContextApi";
import { getIcon } from "../../utils/iconMap";
export default function DashTable() {
  const [filteredData, setFilteredData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const { socketData } = useContext(ContextApi);
  const { selectedCloud } = useContext(ContextApi);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchFilter, setSearchFilter] = useState("");
  const [facets, setFacets] = useState([]);
  const [paginationTokens, setPaginationTokens] = useState([]); // initial page = ""
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setPaginationTokens([""]); // reset to first page
    setCurrentPage(0);
    fetchPaginatedData(0); // initial load
  }, [selectedCloud, selectedFilters, searchFilter]);

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
  
  
  const ServiceIcon = ({ cloud, serviceType}) => {
    const iconSrc = getIcon(cloud, serviceType);
    return iconSrc ? (
      <img src={iconSrc} alt={`${cloud}-${serviceType}`} className="w-4 h-4" />
    ) : (
      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
    );
  };
  const fetchPaginatedData = async (pageNumber) => {

    setTableLoading(true);
    try {
      const tokenToUse = paginationTokens[pageNumber] || "";
      const data = await fetchDataDashboard(selectedCloud, selectedFilters, searchFilter, tokenToUse);
  
      setFilteredData(data?.data || []);
      setFacets(data?.facets || []);
  
      const newSkipToken = data?.$skipToken;

    if (newSkipToken
    ) {
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
    <div className="bg-gradientPrimary px-4 pt-3 pb-4 rounded-sm flex-1">
      <div className="mt-2 flex justify-between items-center">
        <TableTabs facets={facets} setSelectedFilters={setSelectedFilters} />
        <SearchBar setSearchFilter={setSearchFilter} />
      </div>
      <div className="border border-gray-200 rounded-sm mt-1">
        {tableLoading ? (
          <SkeletonTable rows={8} columns={5} />
        ) : (
          <>
            <div className="max-h-[50vh] overflow-y-auto scrollbar-thin overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary-200">
                  <tr>
                    <th className="p-2">
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
                      className="relative p-2 text-left text-xs font-medium text-primary-700 uppercase tracking-wider"
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
                        <div className="absolute top-12 right-0 z-10 w-32 bg-white border rounded shadow-lg text-xs">
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
                            className={`w-full px-3 py-2 hover:bg-gray-100 flex items-center gap-2 ${!sortField ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled = { !sortField}
                            onClick={() => applySort("name", null)}
                          >
                            <span className="text-gray-700">✕ Remove</span>
                          </button>
                        </div>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-medium text-primary-700 uppercase tracking-wider"
                    >
                      State
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-medium text-primary-700 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    {/* <th
                      scope="col"
                      className="p-2 text-left text-xs font-medium text-primary-700 uppercase tracking-wider"
                    >
                      Resource Group
                    </th> */}
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-medium text-primary-700 uppercase tracking-wider"
                    >
                      Resource Tag
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-medium text-primary-700 uppercase tracking-wider"
                    >
                      Project Name
                    </th>
                    <th
                      scope="col"
                      className="p-2 text-left text-xs font-medium text-primary-700 uppercase tracking-wider"
                    >
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-primary-50 divide-y divide-gray-200">
                  {filteredData?.map((data) => (
                    <tr
                      key={data.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-2">
                        {/* <input
                        type="checkbox"
                        checked={selectedIds.includes(data.id)}
                        onChange={(e) => handleRowCheckboxChange(e, data.id)}
                      /> */}
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
                      <td className="p-1 whitespace-nowrap text-xs text-gray-900">
                        <div className="flex items-center gap-2">
                          <ServiceIcon cloud={selectedCloud} serviceType={data?.type} />
                          <span>{data?.name}</span>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap text-xs text-gray-900">
                        {getOrderStatus(data?.state)}
                      </td>
                      <td className="p-1 whitespace-nowrap text-xs text-gray-900">
                        {getResourceTypeLabel(data?.type, data?.kind)}
                      </td>
                      {/* <td className="p-1 whitespace-nowrap text-xs text-gray-900">
                        {data?.projectTags?.Name || "-"}
                      </td> */}
                      <td className="p-1 text-xs text-gray-900">
                        {data?.resourceTags?.Name || "-"}
                      </td>
                      <td className="p-1 text-xs text-gray-900">
                        {data?.projectName || "-"}
                      </td>
                      <td className="text-xs text-gray-800">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-blue-600" />
                          <span>{data?.location || "Unknown"}</span>
                        </div>
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
      <Pagination
        currentPage={currentPage}
        totalPages={paginationTokens.length}
        onNext={() => {
          if (currentPage + 1 < paginationTokens.length) {
            fetchPaginatedData(currentPage + 1);
          }
        }}
        onPrev={() =>  {
          if (currentPage > 0) {
            fetchPaginatedData(currentPage - 1);
          }
        }}
      />
      </div>
    </div>
  );
}
