import React, { useState, useEffect } from 'react';
import TableLayout from './TableLayout';
import axios from 'axios';

const resourceData = {
  dbServer: [
    {
      id: "/subscriptions/d6240a3c-34a4-4a5c-955b-06228bf34ca8/resourceGroups/az-fb-rg-DRD/providers/Microsoft.Sql/servers/drdprimaryserver",
      name: "drdprimaryserver",
      serverName: "drdprimaryserver.database.windows.net",
      location: "eastus",
      state: "Ready",
      type: "SQL Server"
    }
  ],
  serverlessComputing: [
    {
      id: "/subscriptions/d6240a3c-34a4-4a5c-955b-06228bf34ca8/resourceGroups/az-fb-rg-drd/providers/Microsoft.Web/sites/drdfunction",
      name: "drdfunction",
      hostNames: ["drdfunction.azurewebsites.net"],
      location: "eastus",
      state: "Stopped",
      type: "Function App"
    }
  ],
  appHosting: [
    {
      id: "/subscriptions/d6240a3c-34a4-4a5c-955b-06228bf34ca8/resourceGroups/az-fb-rg-DRD/providers/Microsoft.Web/sites/drdwebapp5",
      name: "drdwebapp5",
      hostNames: ["drdwebapp5.azurewebsites.net"],
      location: "eastus",
      state: "Stopped",
      type: "Web App"
    }
  ],
  kubernetesService: [
    {
      id: "/subscriptions/d6240a3c-34a4-4a5c-955b-06228bf34ca8/resourceGroups/az-fb-rg-DRD/providers/Microsoft.ContainerService/managedClusters/drd-cluster-az",
      name: "drd-cluster-az",
      location: "eastus",
      state: "Running",
      type: "AKS"
    }
  ]
};

const leftTables = [
  {
    key: 'dbServer',
    label: 'SQL',
    color: 'from-blue-500 via-blue-400 to-blue-600',
    border: 'border-blue-400',
    data: resourceData.dbServer.map((item, i) => ({
      id: item.id,
      resourceName: item.name,
      location: item.location,
      status: item.state,
      type: item.type
    }))
  },
  {
    key: 'serverlessComputing',
    label: 'Function App',
    color: 'from-purple-500 via-purple-400 to-purple-600',
    border: 'border-purple-400',
    data: resourceData.serverlessComputing.map((item, i) => ({
      id: item.id,
      resourceName: item.name,
      location: item.location,
      status: item.state,
      type: item.type
    }))
  },
  {
    key: 'appHosting',
    label: 'Web App',
    color: 'from-pink-500 via-pink-400 to-pink-600',
    border: 'border-pink-400',
    data: resourceData.appHosting.map((item, i) => ({
      id: item.id,
      resourceName: item.name,
      location: item.location,
      status: item.state,
      type: item.type
    }))
  },
  {
    key: 'kubernetesService',
    label: 'Kubernetes',
    color: 'from-green-500 via-green-400 to-green-600',
    border: 'border-green-400',
    data: resourceData.kubernetesService.map((item, i) => ({
      id: item.id,
      resourceName: item.name,
      location: item.location,
      status: item.state,
      type: item.type
    }))
  }
];

const rightTables = leftTables.map(table => ({
  ...table,
  data: table.data.map(item => ({
    ...item,
    resourceName: item.resourceName + '-CUS-dr',
    location: 'Central us'
  }))
}));

// DrHeader component (select, stepper, Initiate DR button)
const projectOptions = [
  { value: 'option1', label: 'Select Project' },
  { value: 'option2', label: 'Project Alpha' },
  { value: 'option3', label: 'Project Beta' },
];
const stepLabels = [
  'Capacity',
  'Initiate DR',
  'Deployments',
  'Verified',
];
const DrHeader = () => {
  const [selected, setSelected] = useState(projectOptions[0]);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const step = 2;

  const filteredOptions = projectOptions.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Custom Searchable Dropdown */}
      <div className="relative w-56">
        <button
          type="button"
          className="w-full bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 text-white font-semibold rounded px-4 py-2 flex items-center justify-between shadow focus:outline-none focus:ring-2 focus:ring-cyan-300"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <span>{selected.label}</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded shadow-lg border border-gray-200">
            <input
              type="text"
              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
              placeholder="Search project..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            <ul className="max-h-40 overflow-y-auto">
              {filteredOptions.map(opt => (
                <li
                  key={opt.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-primary-100 ${selected.value === opt.value ? 'bg-primary-50 font-semibold' : ''}`}
                  onClick={() => {
                    setSelected(opt);
                    setDropdownOpen(false);
                    setSearch('');
                  }}
                >
                  {opt.label}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-gray-400">No results</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {/* Stepper */}
      <div className="flex items-end gap-0">
        {stepLabels.map((label, idx) => {
          let circle, circleClass, labelClass, connectorClass;
          const borderClass = 'border-2 border-dotted border-gray-300';
          if (idx === 0) {
            circle = (
              <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white ${borderClass}`} style={{boxSizing:'border-box'}}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
            );
            circleClass = '';
            labelClass = 'text-xs mt-2 text-center text-green-600 font-semibold';
          } else if (idx === 1) {
            circle = (
              <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-lg border-4 border-primary-200 animate-pulse ${borderClass}`} style={{boxSizing:'border-box'}}>{idx + 1}</span>
            );
            circleClass = '';
            labelClass = 'text-xs mt-2 text-center text-primary-600 font-semibold';
          } else {
            circle = (
              <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white font-bold text-lg opacity-50 border-2 border-dotted border-gray-300`} style={{boxSizing:'border-box'}}>{idx + 1}</span>
            );
            circleClass = '';
            labelClass = 'text-xs mt-2 text-center text-gray-400 font-semibold opacity-50';
          }
          if (idx < stepLabels.length - 1) {
            connectorClass = idx < step - 1 ? 'bg-green-500' : idx === step - 1 ? 'bg-primary-400' : 'bg-gray-200 opacity-50';
          }
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center justify-center">
                <div className={circleClass}>{circle}</div>
                <div className={labelClass} style={{ width: '5.5rem' }}>{label}</div>
              </div>
              {idx < stepLabels.length - 1 && (
                <div className={`flex items-center`} style={{height:'2.5rem'}}>
                  <div className={`h-1 w-10 rounded ${connectorClass}`}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Initiate DR Button */}
      <button
        className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-6 py-2 rounded-2xl font-semibold shadow hover:scale-105 transition-transform duration-200 focus:outline-none flex items-center gap-2"
        onClick={() => alert('Initiate DR!')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5" /></svg>
        Initiate DR
      </button>
    </div>
  );
};

const TableData = () => {
  return (
    <>
      <DrHeader />
      <TableLayout leftTables={leftTables} rightTables={rightTables} />
    </>
  );
};

export default TableData;