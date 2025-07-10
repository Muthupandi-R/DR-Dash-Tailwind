import React from 'react'
import TableComponent from './TableComponent'

const thColors = {
  SQL: 'bg-gradient-to-r from-blue-100 via-blue-50 to-white text-blue-700',
  'Function App': 'bg-gradient-to-r from-purple-100 via-purple-50 to-white text-purple-700',
  'Web App': 'bg-gradient-to-r from-pink-100 via-pink-50 to-white text-pink-700',
  Kubernetes: 'bg-gradient-to-r from-green-100 via-green-50 to-white text-green-700',
};

const TableLayout = ({ leftTables, rightTables }) => {
  return (
    <div className="flex gap-8 mt-16">
      <div className="flex-1 flex flex-col gap-8">
        {leftTables.map((table, idx) => (
          <div key={table.key}>
            <div className={`inline-block rounded-t-lg bg-gradient-to-r ${table.color} text-white text-base font-semibold px-6 py-2 mb-0 shadow-sm ml-4 mt-[-1.5rem] border ${table.border}`}>
              {table.label}
            </div>
            <TableComponent data={table.data} bannerColor={table.color} borderColor={table.border} thColor={thColors[table.label]} />
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-8">
        {rightTables.map((table, idx) => (
          <div key={table.key} className='mt-8'>
            {/* No banner for right side tables */}
            <TableComponent data={table.data} bannerColor={table.color} borderColor={table.border} thColor={thColors[table.label]} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableLayout