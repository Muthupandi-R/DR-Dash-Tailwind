import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import { fetchResourceStats } from "../../services/apiService";
import { useState, useMemo, useEffect } from "react";
import SkeletonPieChart from "../Loaders/SkeletonPieChart";
import ContextApi from "../../context/ContextApi";
import { useContext } from "react";

const pieTitles = [
  "Service Total Count",
  "Running vs Stopped",
];

function getPieData(apiData, filter) {
  let services = Object.values(apiData).filter(
    (item) => item && item.label && typeof item.totalCount === "number"
  );

  if (filter && filter.type === "service") {
    services = services.filter((item) => item.label === filter.value);
  }

  let pieData1 = services.map((item) => ({
    label: item.label,
    value: item.totalCount,
  }));

  let running = 0,
    stopped = 0;
  services.forEach((item) => {
    if (typeof item.running === "number") running += item.running;
    if (typeof item.stopped === "number") stopped += item.stopped;
  });
  let pieData2 = [
    { label: "Running", value: running },
    { label: "Stopped", value: stopped },
  ];

  if (filter && filter.type === "status") {
    const statusKey = filter.value === "Running" ? "running" : "stopped";
    const statusServices = services.filter((item) => item[statusKey] > 0);
    pieData1 = statusServices.map((item) => ({
      label: item.label,
      value: item[statusKey],
    }));
    let statusSum = statusServices.reduce((sum, item) => sum + item[statusKey], 0);
    pieData2 = [{ label: filter.value, value: statusSum }];
  }

  return [pieData1, pieData2];
}

const pieColors = [
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

function PieChart({ data, title, colors, onSegmentClick, legendPosition }) {
  const labels = data.map((item) => item.label);
  const series = data.map((item) => item.value);

  // Modern, professional color palette
  const defaultColors = [
    "#34A853", // green
    "#EA4335", // red
    "#FBBC05", // yellow
    "#4285F4", // blue
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
    height: 200,
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
          dataPointMouseEnter: (event, chartContext, config) => {
            // Add hover effect - segment gets bigger
            const chart = chartContext.chart;
            if (chart && typeof config.dataPointIndex === "number") {
              chart.updateOptions({
                plotOptions: {
                  pie: {
                    customScale: 1.15,
                  }
                }
              }, false, true);
            }
          },
          dataPointMouseLeave: (event, chartContext, config) => {
            // Reset hover effect
            const chart = chartContext.chart;
            if (chart) {
              chart.updateOptions({
                plotOptions: {
                  pie: {
                    customScale: 1.1,
                  }
                }
              }, false, true);
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
        show: false, // Hide the chart title
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
          expandOnClick: true,
          customScale: 1.1,
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
    <div className="relative flex items-center justify-center text-center ">
      {/* Animated gradient blob behind the card */}
      <div className="absolute -z-10 w-60 h-60 bg-gradient-to-tr from-blue-400 via-purple-300 to-pink-300 rounded-full blur-3xl opacity-30 animate-pulse scale-110" />
      <Card className="h-full bg-primary-50 backdrop-blur-md border-2 border-transparent bg-clip-padding shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_8px_rgba(80,80,255,0.15)] hover:border-blue-200/60 hover:ring-4 hover:ring-blue-200/30">
        <CardBody className="h-full grid place-items-center px-2 py-4">
          <div className="w-full h-full flex flex-col justify-center items-left">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 px-2 py-1  text-primary-800 ">{title}</h3>
            <div className="w-full h-full flex justify-center items-center mt-4">
              <Chart
                key={labels.join('-') + series.join('-')}
                {...chartConfig}
              />
            </div>
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

const StatsPieCharts = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState([null, null, null]);
  const { selectedCloud } = useContext(ContextApi);

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchData() {
      try {
        const data = await fetchResourceStats(selectedCloud);
        if (data) {
          setApiData(data);
        } else {
          setError('No data found');
        }
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pieDatas = useMemo(() => (apiData ? getPieData(apiData, filter) : [[], []]), [apiData, filter]);
  const pieDatasOriginal = useMemo(() => (apiData ? getPieData(apiData, null) : [[], []]), [apiData]);

  useEffect(() => {
    setSelected((prev) =>
      prev.map((sel, idx) =>
        sel !== null && (!pieDatas[idx] || !pieDatas[idx][sel]) ? null : sel
      )
    );
  }, [pieDatas]);

  const handleSegmentClick = (chartIdx, segmentIdx) => {
    if (selected[chartIdx] === segmentIdx) {
      setFilter(null);
      setSelected([null, null, null]);
      return;
    }

    let newFilter = null;
    if (chartIdx === 0 || chartIdx === 2) {
      newFilter = { type: "service", value: pieDatas[chartIdx][segmentIdx].label };
    } else if (chartIdx === 1) {
      newFilter = { type: "status", value: pieDatas[1][segmentIdx].label };
    }
    
    setFilter(newFilter);
    const newSelected = [null, null, null];
    newSelected[chartIdx] = segmentIdx;
    setSelected(newSelected);
    console.log(newSelected, "newSelected");
  };

  return (
        <div className="flex flex-row gap-x-8 w-full justify-end">
          {pieDatas.map((data, idx) => {
            const originalData = pieDatasOriginal[idx];
            let filteredData = data;

            let filteredColors;
            if (idx === 1 && filteredData.length > 0) {
              // Status chart: Running/Stopped color logic (already correct)
              filteredColors = filteredData.map(item => {
                if (item.label === "Running") return "#34A853";
                if (item.label === "Stopped") return "#EA4335";
                return "#A0AEC0";
              });
            } else {
              // Service Total Count and other charts
              if (
                selected[idx] !== null &&
                originalData[selected[idx]]
              ) {
                // When filtered to a single segment, use the original color for that segment
                filteredColors = [pieColors[selected[idx]]];
              } else {
                filteredColors = pieColors.slice(0, filteredData.length);
              }
            }

            return (
              <div key={idx} className="flex-1 flex justify-center mb-10">
                {loading ? (
                  <SkeletonPieChart />
                ) : data && data.length > 0 ? (
                  <PieChart
                    data={filteredData}
                    title={pieTitles[idx]}
                    onSegmentClick={(segmentIdx) => {
                      // Map the clicked index in filteredData back to the originalData index
                      let realIdx = segmentIdx;
                      if (filteredData.length === 1) {
                        // If filtered, realIdx is the selected[idx] (original index)
                        realIdx = selected[idx];
                      }
                      handleSegmentClick(idx, realIdx);
                    }}
                    legendPosition={idx === 1 ? 'bottom' : 'right'}
                    colors={filteredColors}
                  />
                ) : (
                  <div className="text-center text-gray-500">No data</div>
                )}
              </div>
            );
          })}
        </div>
  );
};
export default StatsPieCharts;