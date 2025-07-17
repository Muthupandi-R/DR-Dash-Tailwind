import React, { useState, useContext } from 'react';
import TableLayout from './TableLayout';
import DrHeader from './DrHeader';
import { fetchInitiateDrResources, getDrSuffix } from '../../lib/helpers/index';
import SkeletonTable from '../Loaders/SkeletonTable';
import ContextApi from '../../context/ContextApi';

// Table configuration for different clouds
const getTableConfigs = (cloud) => {
    const configs = {
        azure: [
            { key: 'dbServer', label: 'SQL', color: 'from-blue-500 via-blue-400 to-blue-600', border: 'border-blue-400', type: 'SQL Server' },
            { key: 'serverlessComputing', label: 'Function App', color: 'from-purple-500 via-purple-400 to-purple-600', border: 'border-purple-400', type: 'Function App' },
            { key: 'appHosting', label: 'Web App', color: 'from-pink-500 via-pink-400 to-pink-600', border: 'border-pink-400', type: 'Web App' },
            { key: 'computeService', label: 'Virtual Machine', color: 'from-orange-500 via-orange-400 to-orange-600', border: 'border-orange-400', type: 'Virtual Machine' },
            { key: 'kubernetesService', label: 'Kubernetes', color: 'from-green-500 via-green-400 to-green-600', border: 'border-green-400', type: 'AKS' }
        ],
        aws: [
            { key: 'dbServer', label: 'RDS', color: 'from-blue-500 via-blue-400 to-blue-600', border: 'border-blue-400', type: 'RDS' },
            { key: 'serverlessComputing', label: 'Lambda', color: 'from-purple-500 via-purple-400 to-purple-600', border: 'border-purple-400', type: 'Lambda' },
            { key: 'computeService', label: 'EC2', color: 'from-orange-500 via-orange-400 to-orange-600', border: 'border-orange-400', type: 'EC2' },
            { key: 'kubernetesService', label: 'Kubernetes', color: 'from-green-500 via-green-400 to-green-600', border: 'border-green-400', type: 'EKS' }
        ],
        gcp: [
            { key: 'dbServer', label: 'SQL', color: 'from-blue-500 via-blue-400 to-blue-600', border: 'border-blue-400', type: 'Cloud SQL' },
            { key: 'serverlessComputing', label: 'Cloud Function', color: 'from-purple-500 via-purple-400 to-purple-600', border: 'border-purple-400', type: 'Cloud Function' },
            { key: 'computeService', label: 'Compute Engine', color: 'from-orange-500 via-orange-400 to-orange-600', border: 'border-orange-400', type: 'Compute Engine' },
            { key: 'kubernetesService', label: 'Kubernetes', color: 'from-green-500 via-green-400 to-green-600', border: 'border-green-400', type: 'GKE' }
        ]
    };
    return configs[cloud] || configs.azure;
};

const TableData = () => {
    const [leftTables, setLeftTables] = useState([]);
    const [rightTables, setRightTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableConfigs, setTableConfigs] = useState([]);
    const [selectedLeftRows, setSelectedLeftRows] = useState([]);
    const [progressData, setProgressData] = useState({}); // Store progress per row

    const { selectedCloud } = useContext(ContextApi);

    // Function to transform API data to table format
    const transformApiDataToTable = (apiData, tableConfig) => {
        const keyMapping = {
            'dbServer': 'dbServer',
            'serverlessComputing': 'serverlessComputing',
            'appHosting': 'appHosting',
            'computeService': 'computeService',
            'kubernetesService': 'kubernetesService'
        };
        const apiKey = keyMapping[tableConfig.key];
        const categoryData = apiData[apiKey] || [];
        return {
            ...tableConfig,
            data: categoryData.map(item => ({
                id: item.id,
                resourceName: item.name,
                location: item.location,
                status: item.state,
                type: item.type
            }))
        };
    };

    // Function to match right side data with left side based on name suffix
    const matchRightSideData = (leftData, rightData, suffix) => {
        return leftData.map(leftItem => {
            const expectedRightName = leftItem.resourceName + suffix;
            let matchingRightItem = null;
            Object.values(rightData).forEach(category => {
                if (Array.isArray(category)) {
                    const found = category.find(rightItem => rightItem.name === expectedRightName);
                    if (found) matchingRightItem = found;
                }
            });
            if (matchingRightItem) {
                return {
                    ...leftItem,
                    resourceName: matchingRightItem.name,
                    location: matchingRightItem.location,
                    status: matchingRightItem.state,
                    type: matchingRightItem.type
                };
            } else {
                return {
                    ...leftItem,
                    id: leftItem.id + '-dr', // ← unique ID for DR progress mapping
                    resourceName: leftItem.resourceName + suffix,
                    location: 'Central us',
                    status: "",
                };
            }
        });
    };

    // Function to fetch and process data
    const fetchData = async (projectName) => {
        if (!projectName) return;
        setLoading(true);
        try {

            const suffix = getDrSuffix(selectedCloud);
            const drProjectName = projectName + suffix;
            const currentTableConfigs = getTableConfigs(selectedCloud);
            setTableConfigs(currentTableConfigs);
            const leftData = await fetchInitiateDrResources(projectName, selectedCloud);
            const rightData = await fetchInitiateDrResources(drProjectName, selectedCloud);
            const processedLeftTables = currentTableConfigs.map(config => transformApiDataToTable(leftData, config));
            const processedRightTables = currentTableConfigs.map(config => {
                const leftTable = processedLeftTables.find(table => table.key === config.key);
                return {
                    ...config,
                    data: matchRightSideData(leftTable.data, rightData, suffix)
                };
            });
            setLeftTables(processedLeftTables);
            setRightTables(processedRightTables);
        } catch (error) {
            const emptyTables = tableConfigs.map(config => ({ ...config, data: [] }));
            setLeftTables(emptyTables);
            setRightTables(emptyTables);
        } finally {
            setLoading(false);
        }
    };

    // Handle project selection
    const handleProjectSelect = (projectName) => {
        fetchData(projectName);
    };

    const handleInitiateDr = () => {
        const updatedProgress = {};

        // Initialize progress for selected rows
        selectedLeftRows.forEach(id => {
            updatedProgress[id] = 100; // Left side starts at 100
            updatedProgress[id + '-dr'] = 0; // Right side starts at 0
        });

        setProgressData(updatedProgress);

        // Animate progress every 300ms
        const interval = setInterval(() => {
            setProgressData(prev => {
                const next = { ...prev };
                let done = true;

                selectedLeftRows.forEach(id => {
                    const leftId = id;
                    const rightId = id + '-dr';

                    if (next[leftId] > 0) {
                        next[leftId] = Math.max(0, next[leftId] - 10);
                        done = false;
                    }

                    if (next[rightId] < 100) {
                        next[rightId] = Math.min(100, next[rightId] + 10);
                        done = false;
                    }
                });

                if (done) clearInterval(interval);
                return next;
            });
        }, 300);
    };


    // Determine how many skeletons to show per side based on current tableConfigs
    const leftSkeletons = tableConfigs.slice(0, Math.ceil(tableConfigs.length / 2));
    const rightSkeletons = tableConfigs.slice(Math.ceil(tableConfigs.length / 2));

    return (
        <>
            <DrHeader onProjectSelect={handleProjectSelect} onInitiateDr={handleInitiateDr} />
            {loading ? (
                <div className="flex gap-8 mt-10">
                    <div className="flex-1 flex flex-col gap-8">
                        {leftSkeletons.map((_, idx) => (
                            <SkeletonTable key={idx} />
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col gap-8">
                        {rightSkeletons.map((_, idx) => (
                            <SkeletonTable key={idx} />
                        ))}
                    </div>
                </div>
            ) : (
                <TableLayout
                    leftTables={leftTables.map(table => ({
                        ...table,
                        onSelectResource: (selectedIds) => {
                            // You can extend this logic to track selected IDs by table if needed
                            setSelectedLeftRows(selectedIds);
                        },
                        progressData
                    }))}
                    rightTables={rightTables.map(table => ({
                        ...table,
                        progressData
                    }))}
                    progressData={progressData}
                    onSelectResource={(selectedIds) => {
                        setSelectedLeftRows(selectedIds);
                    }}
                />
            )}
        </>
    );
};

export default TableData;