import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

const rawServiceData = {
  computeService: { label: "Virtual Machine", running: 2, stopped: 4 },
  dbServer: { label: "SQL Server", running: 14, stopped: 8 },
  serverlessComputing: { label: "Function App", running: 7, stopped: 20 },
  appHosting: { label: "App Service", running: 20, stopped: 10 },
  kubernetes: { label: "Kubernetes Service", running: 10, stopped: 10 },
};

// Extract labels and values
const serviceValues = Object.values(rawServiceData);
const labels = serviceValues.map((item) => item.label);
const series = serviceValues.map((item) => item.running + item.stopped);
const total = series.reduce((sum, value) => sum + value, 0);

// Compute exact percentages to display
const displayPercentages = series.map((value) =>
  ((value / total) * 100).toFixed(1)
);

// Define fixed colors
const colors = ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"];

const chartConfig = {
  type: "pie",
  width: 280,
  height: 280,
  series: series,
  options: {
    chart: {
      toolbar: { show: false },
      events: {
        dataPointSelection: () => {},
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
		console.log(val, "value");		
        return `${val.toFixed(0)}%`;
      },
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    colors: colors,
    labels: labels,
    legend: {
      show: false,
    },
    title: {
      text: "Service Resource Distribution",
      align: "center",
      style: { fontSize: "16px" },
    },
  },
};


export default function Example() {
  return (
    <Card>
      <CardBody className="mt-4 grid place-items-center px-2">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
