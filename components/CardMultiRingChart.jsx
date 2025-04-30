import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CardMultiRingChart({ title, series, labels, colors, className = "" }) {
  // Cek jika semua value 0
  const isAllZero = series.every((v) => v === 0);
  const total = series.reduce((a, b) => a + b, 0);
  const completedIdx = labels.findIndex(l => l.toLowerCase().includes("completed"));
  const completed = completedIdx !== -1 ? series[completedIdx] : 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const options = {
    chart: {
      type: "donut",
      sparkline: { enabled: true },
    },
    labels,
    colors,
    legend: { show: false },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        // Tampilkan persen hanya di tengah (total)
        if (opts.w.globals.seriesIndex === 0) {
          const total = series.reduce((a, b) => a + b, 0);
          const completedIdx = labels.findIndex(l => l.toLowerCase().includes("completed"));
          const completed = completedIdx !== -1 ? series[completedIdx] : 0;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          return percent + "%";
        }
        return "";
      },
      dropShadow: { enabled: false },
      style: {
        fontSize: '28px',
        fontWeight: 700,
        colors: ['#23262F'],
      },
      background: { enabled: false },
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: false },
            value: { show: false },
            total: {
              show: false,
            },
          },
        },
        expandOnClick: false,
        customScale: 1,
        offsetY: 0,
        offsetX: 0,
        dataLabels: {
          offset: 0,
        },
      },
    },
    stroke: {
      show: true,
      width: 6,
      colors: ["#fff"], // gap antar segmen
    },
    tooltip: {
      enabled: true,
      y: { formatter: (val) => val },
    },
    grid: { padding: { right: 0 } },
  };

  return (
    <div className={`bg-white dark:bg-slate-700 rounded-lg shadow-lg flex flex-col p-6 h-full ${className}`}>
      <h2 className="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-row items-center w-full">
        <div className="flex-1 flex justify-center items-center min-w-[180px]">
          {isAllZero ? (
            <span className="text-gray-400 dark:text-gray-500 text-lg font-semibold">No Data</span>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={220}
            />
          )}
        </div>
        {/* Custom legend di kanan chart */}
        <div className="flex flex-col gap-3 ml-6 min-w-[120px]">
          {labels.map((label, idx) => (
            <div key={label} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: colors[idx] }}></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
              <span className="ml-auto text-sm font-bold text-gray-900 dark:text-white">{series[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
