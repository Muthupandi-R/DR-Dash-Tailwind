import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

export default function PieChart({ data, title, colors, onSegmentClick, legendPosition }) {
  const labels = data.map((item) => item.label);
  const series = data.map((item) => item.value);

  // Modern, professional color palette
  const defaultColors = [
    "#4285F4", // blue
    "#34A853", // green
    "#FBBC05", // yellow
    "#EA4335", // red
    "#A142F4", // purple
    "#00B8D9", // cyan
    "#FF7043", // orange
    "#8E24AA", // deep purple
    "#43A047", // dark green
    "#F4511E", // deep orange
  ];

  const chartConfig = {
    type: "donut",
    width: 480,
    height: 230,
    series: series,
    options: {
      chart: {
        toolbar: { show: false },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            if (onSegmentClick && typeof config.dataPointIndex === "number") {
              onSegmentClick(config.dataPointIndex);
            }
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${value.toLocaleString()}`;
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          color: '#000',
          opacity: 0.2,
        },
      },
      colors: colors || defaultColors,
      labels: labels,
      legend: {
        show: true,
        position:  'right',
        fontSize: '12px',
        fontWeight: 500,
        formatter: function(seriesName, opts) {
          // Custom vertical bar marker
          const color = opts.w.globals.colors[opts.seriesIndex];
          return `<span style="display:inline-block;width:6px;height:18px;background:${color};border-radius:3px;margin-right:8px;vertical-align:middle;"></span>${seriesName}`;
        },
        itemMargin: { vertical: 8 },
        markers: {
          width: 0, // Hide default marker
          height: 0, // Hide default marker
          radius: 0,
        },
        containerMargin: {
          left: 0,
          top: 0
        },
        offsetY: 0,
        maxHeight: 340,
        onItemClick: { toggleDataSeries: true },
        onItemHover: { highlightDataSeries: true },
      },
      title: {
        text: title,
        align: "center",
        style: { fontSize: "14px", fontWeight: 600 },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            labels: {
              show: true,
              name: { show: false },
              value: { show: true },
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 700,
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return `${sum.toLocaleString()}`;
                },
              },
            },
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${val.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated gradient blob behind the card */}
      <div className="absolute -z-10 w-60 h-60 bg-gradient-to-tr from-blue-400 via-purple-300 to-pink-300 rounded-full blur-3xl opacity-30 animate-pulse scale-110" />
      <Card className="bg-white/40 backdrop-blur-md border-2 border-transparent bg-clip-padding shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_8px_rgba(80,80,255,0.15)] hover:border-blue-200/60 hover:ring-4 hover:ring-blue-200/30">
        <CardBody className="mt-4 grid place-items-center px-2 py-6">
          <div className="w-full h-full flex justify-center items-center">
            <Chart
              key={labels.join('-') + series.join('-')}
              {...chartConfig}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  colors: PropTypes.array,
  onSegmentClick: PropTypes.func,
  legendPosition: PropTypes.string,
};
