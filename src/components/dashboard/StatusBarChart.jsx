import React from 'react'
import Chart from 'react-apexcharts'

const data = [
  {
    name: 'Virtual Machine',
    Running: 2,
    Stopped: 4
  },
  {
    name: 'SQL Server',
    Running: 14,
    Stopped: 8
  },
  {
    name: 'Function App',
    Running: 7,
    Stopped: 20
  },
  {
    name: 'App Service',
    Running: 20,
    Stopped: 10
  },
  {
    name: 'Kubernetes Service',
    Running: 10,
    Stopped: 10
  }
]

const categories = data.map(item => item.name)
const runningSeries = data.map(item => item.Running)
const stoppedSeries = data.map(item => item.Stopped)

export default function StatusBarChart() {
  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false
      }
    },
    xaxis: {
      categories
    },
    colors: ['#22c55e', '#ef4444'],
    legend: {
      position: 'top'
    },
    tooltip: {
      shared: true,
      intersect: false
    }
  }

  const chartSeries = [
    {
      name: 'Running',
      data: runningSeries
    },
    {
      name: 'Stopped',
      data: stoppedSeries
    }
  ]

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Service Status</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <Chart options={chartOptions} series={chartSeries} type="bar" height="100%" />
      </div>
    </div>
  )
}
