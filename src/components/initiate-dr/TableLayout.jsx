import React from 'react'
import TableComponent from './TableComponent'

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

const TableLayout = ({ leftTables, rightTables }) => {
  return (
    <div className="flex gap-8 mt-10">
      <div className="flex-1 flex flex-col gap-8">
        {leftTables.filter(table => table.data && table.data.length > 0).map((table, idx) => (
          <div key={table.key}>
            <div className={`inline-block rounded-t-lg bg-gradient-to-r ${table.color} text-white text-sm font-semibold px-4 py-2 mb-0 shadow-sm ml-4 mt-[-1.5rem] border ${table.border}`}>
              {table.label}
            </div>
            <TableComponent data={table.data} bannerColor={table.color} borderColor={table.border} thColor={thColors[table.label]} showCheckbox={true} />
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-8">
        {rightTables.filter(table => table.data && table.data.length > 0).map((table, idx) => (
          <div key={table.key} className='mt-8'>
            {/* No banner for right side tables */}
            <TableComponent data={table.data} bannerColor={table.color} borderColor={table.border} thColor={thColors[table.label]} showCheckbox={false} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableLayout