import React, {useContext} from 'react'
import ContextApi from '../../context/ContextApi';
import TableComponent from './TableComponent'
import { InformationCircleIcon } from "@heroicons/react/24/outline";


const thColors = {
  // Database services (SQL, RDS, Cloud SQL)
  SQL: 'bg-gradient-to-r from-blue-100 via-blue-50 to-white text-blue-700',
  RDS: 'bg-gradient-to-r from-blue-100 via-blue-50 to-white text-blue-700',
  'Cloud SQL': 'bg-gradient-to-r from-blue-100 via-blue-50 to-white text-blue-700',
  
  // Serverless services (Function App, Lambda, Cloud Function)
  'Function App': 'bg-gradient-to-r from-purple-100 via-purple-50 to-white text-purple-700',
  Lambda: 'bg-gradient-to-r from-purple-100 via-purple-50 to-white text-purple-700',
  'Cloud Function': 'bg-gradient-to-r from-purple-100 via-purple-50 to-white text-purple-700',
  
  // Web hosting services (Web App)
  'Web App': 'bg-gradient-to-r from-pink-100 via-pink-50 to-white text-pink-700',
  
  // Compute services (Virtual Machine, EC2, Compute Engine)
  'Virtual Machine': 'bg-gradient-to-r from-orange-100 via-orange-50 to-white text-orange-700',
  EC2: 'bg-gradient-to-r from-orange-100 via-orange-50 to-white text-orange-700',
  'Compute Engine': 'bg-gradient-to-r from-orange-100 via-orange-50 to-white text-orange-700',
  
  // Kubernetes services (AKS, EKS, GKE)
  Kubernetes: 'bg-gradient-to-r from-green-100 via-green-50 to-white text-green-700',
};

const TableLayout = ({ leftTables, rightTables, progressData = {}, selectedRows, setSelectedRows, onSelectResource }) => {
  const leftNonEmpty = leftTables.filter(table => table.data && table.data.length > 0);
  const rightNonEmpty = rightTables.filter(table => table.data && table.data.length > 0);
  const showFullBanner = leftNonEmpty.length === 0 && rightNonEmpty.length === 0;
  const { selectedCloud } = useContext(ContextApi)
  return (
    <div className="flex flex-col w-full">
      {showFullBanner && (
        <div className="bg-red-100 text-red-700 text-xs font-semibold px-4 py-2 rounded-lg mb-2 text-center w-full mt-10 flex items-center justify-center gap-2">
          <InformationCircleIcon className="w-4 h-4 mr-1" />
          <span>There is no resources available on this project</span>
        </div>
      )}
      <div className="flex gap-8 mt-10">
        <div className="flex-1 flex flex-col gap-8">
          {!showFullBanner && leftNonEmpty.map((table, idx) => (
            <div key={table.key}>
              <div className={`inline-block rounded-t-lg bg-gradient-to-r ${table.color} text-white text-xs font-semibold px-4 py-2 mb-0 shadow-sm ml-4 mt-[-1.5rem] border ${table.border}`}>
                {table.label}
              </div>
              <TableComponent data={table.data} bannerColor={table.color} borderColor={table.border} thColor={thColors[table.label]} showCheckbox={true} selectedCloud={selectedCloud} onSelectResource={onSelectResource}  
             progressData={progressData} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-8">
          {!showFullBanner && rightNonEmpty.map((table, idx) => (
            <div key={table.key} className='mt-[28px]'>
              {/* No banner for right side tables */}
              <TableComponent data={table.data} bannerColor={table.color} borderColor={table.border} thColor={thColors[table.label]} showCheckbox={false} selectedCloud={selectedCloud} progressData={progressData}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableLayout