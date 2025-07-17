import React, { useState, useEffect, useContext } from 'react';
import { fetchProjects } from '../../lib/helpers/index'
import ContextApi from '../../context/ContextApi';

// DrHeader component (select, stepper, Initiate DR button)
const defaultProjectOption = { value: '', label: 'Select Project' };

const stepLabels = [
    'Capacity',
    'Initiate DR',
    'Deployments',
    'Verified',
];

const DrHeader = ({ onProjectSelect, onInitiateDr }) => {
    const [projectOptions, setProjectOptions] = useState([defaultProjectOption]);
    const [selected, setSelected] = useState(defaultProjectOption);
    const [search, setSearch] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const step = 2;
    const { selectedCloud } = useContext(ContextApi);

    // Fetch projects only once on mount
    useEffect(() => {
        let isMounted = true;
        const loadProjects = async () => {
            try {
                setLoading(true);
                const response = await fetchProjects(selectedCloud);
                if (isMounted && response) {
                    const options = response.map(project => ({
                        value: project.name,
                        label: project.tags_Name || project.name
                    }));
                    const allOptions = [defaultProjectOption, ...options];
                    setProjectOptions(allOptions);
                    setSelected(allOptions[1]);
                    onProjectSelect(allOptions[1]?.value)
                }
            } catch (error) {
                if (isMounted) setProjectOptions([defaultProjectOption]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadProjects();
        return () => { isMounted = false; };
    }, []);

    const filteredOptions = projectOptions.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex items-center justify-between mt-5">
            {/* Custom Searchable Dropdown */}
            <div className="relative w-56">
                <button
                    type="button"
                    className="w-full bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 text-white font-semibold rounded px-4 py-2 flex items-center justify-between shadow focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    onClick={() => setDropdownOpen((open) => !open)}
                    disabled={loading}
                >
                    <span className='text-xs'>{loading ? 'Loading...' : selected.label}</span>
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
                            {loading ? (
                                <li className="px-4 py-2 text-gray-400">Loading projects...</li>
                            ) : (
                                <>
                                    {filteredOptions.map(opt => (
                                        <li
                                            key={opt.value}
                                            className={`px-4 py-2 cursor-pointer text-xs hover:bg-primary-100 ${selected.value === opt.value ? 'bg-primary-50 font-semibold' : ''}`}
                                            onClick={() => {
                                                setSelected(opt);
                                                setDropdownOpen(false);
                                                setSearch('');
                                                // Only call onProjectSelect if a real project is selected
                                                if (onProjectSelect && opt.value) {
                                                    onProjectSelect(opt.value);
                                                }
                                            }}
                                        >
                                            {opt.label}
                                        </li>
                                    ))}
                                    {filteredOptions.length === 0 && (
                                        <li className="px-4 py-2 text-gray-400">No results</li>
                                    )}
                                </>
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
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white ${borderClass}`} style={{ boxSizing: 'border-box' }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </span>
                        );
                        circleClass = '';
                        labelClass = 'text-xs mt-2 text-center text-green-600 font-semibold';
                    } else if (idx === 1) {
                        circle = (
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-lg border-4 border-primary-200 animate-pulse ${borderClass}`} style={{ boxSizing: 'border-box' }}>{idx + 1}</span>
                        );
                        circleClass = '';
                        labelClass = 'text-xs mt-2 text-center text-primary-600 font-semibold';
                    } else {
                        circle = (
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white font-bold text-lg opacity-50 border-2 border-dotted border-gray-300`} style={{ boxSizing: 'border-box' }}>{idx + 1}</span>
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
                                <div className={`flex items-center`} style={{ height: '2.5rem' }}>
                                    <div className={`h-1 w-10 rounded ${connectorClass}`}></div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            {/* Initiate DR Button */}
            <button
                className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white text-xs px-6 py-2 rounded-2xl font-semibold shadow hover:scale-105 transition-transform duration-200 focus:outline-none flex items-center gap-2"
                onClick={() => onInitiateDr?.()}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5" /></svg>
                Initiate DR
            </button>
        </div>
    );
};

export default DrHeader; 