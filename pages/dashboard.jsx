import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// Impor ApexCharts secara dinamis
const ApexChart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false }
);

// Komponen grafik Division Progress Horizontal dengan tinggi dinamis dan data label di dalam bar
const DivisionProgressChartHorizontal = ({ dataProgres, onDivisionClick }) => {
  // Hitung tinggi kontainer minimal: 40px per divisi (minimal 400px)
  const containerHeight = Math.max(400, dataProgres.length * 40);
  const labels = dataProgres.map((d) => d.name);
  const progressData = dataProgres.map((d) => d.progress || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Progress (%)",
        data: progressData,
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        display: false,
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => value + "%",
        color: "#000",
        font: {
          weight: "bold",
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        if (onDivisionClick) onDivisionClick(dataProgres[index]);
      }
    },
  };

  return (
    <div
      className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg"
      style={{ height: containerHeight }}
    >
      <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        Division Progress (Horizontal)
      </h2>
      {/* Sisakan ruang sekitar 50px untuk judul dan padding */}
      <Bar data={chartData} options={options} height={containerHeight - 50} />
    </div>
  );
};

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [dataGrowth, setDataGrowth] = useState({});
  const [dataRevenueGrowth, setDataRevenueGrowth] = useState({});
  const [dataProgres, setDataProgres] = useState([]);
  const [dataLeadMeasureInput, setDataLeadMeasureInput] = useState([]);
  const [dataWigStatus, setDataWigStatus] = useState({});
  const [dataLeadMeasureG, setDataLeadMeasureG] = useState({});

  // Format tanggal realtime (DD/MM/YYYY)
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${currentDate.getFullYear()}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Global Growth
        const growthRes = await fetch(
          "http://202.58.199.194:8080/api-appit/public/wig/growth"
        );
        setDataGrowth(await growthRes.json());

        // Fetch Revenue Growth
        const revenueRes = await fetch(
          "http://202.58.199.194:8080/api-appit/public/wig/getRevenueGrowth"
        );
        if (!revenueRes.ok)
          throw new Error(`HTTP error! status: ${revenueRes.status}`);
        setDataRevenueGrowth(await revenueRes.json());

        // Fetch Division Progress
        const progresRes = await fetch(
          "http://202.58.199.194:8080/api-appit/public/wig/getDivisionProgress"
        );
        if (!progresRes.ok)
          throw new Error(`HTTP error! status: ${progresRes.status}`);
        setDataProgres(await progresRes.json());

        // Fetch Lead Measure Input
        const leadMeasureInputRes = await fetch(
          "http://202.58.199.194:8080/api-appit/public/wig/getLeadMeasureInput"
        );
        if (!leadMeasureInputRes.ok)
          throw new Error(`HTTP error! status: ${leadMeasureInputRes.status}`);
        setDataLeadMeasureInput(await leadMeasureInputRes.json());

        // Fetch WIG Status
        const wigStatusRes = await fetch(
          "http://202.58.199.194:8080/api-appit/public/wig/getWigStatus"
        );
        if (!wigStatusRes.ok)
          throw new Error(`HTTP error! status: ${wigStatusRes.status}`);
        setDataWigStatus(await wigStatusRes.json());

        // Fetch Lead Measure G (untuk chart Lead Measure)
        const leadMeasureGRes = await fetch(
          "http://202.58.199.194:8080/api-appit/public/wig/getLeadMeasureG"
        );
        if (!leadMeasureGRes.ok)
          throw new Error(Melakukan Analisa data berdasarkan hasil sampling 100 item`HTTP error! status: ${leadMeasureGRes.status}`);
        setDataLeadMeasureG(await leadMeasureGRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Konfigurasi ApexCharts untuk Revenue Growth
  const revenueOptions = {
    chart: {
      type: "area",
      height: 350,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      toolbar: { show: true },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: dataRevenueGrowth.months || [],
      labels: { style: { fontSize: "12px", fontFamily: "Arial, sans-serif" } },
    },
    yaxis: { labels: { style: { fontSize: "12px", fontFamily: "Arial, sans-serif" } } },
    tooltip: { theme: "dark", x: { format: "MMM" } },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.2, stops: [0, 90, 100] },
    },
    legend: { position: "top", horizontalAlign: "center", labels: { useSeriesColors: true } },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: "#FF0000",
          label: {
            borderColor: "#FF0000",
            style: { color: "#fff", background: "#FF0000" },
            text: "0",
          },
        },
      ],
    },
    title: { text: "", align: "center" },
  };

  const revenueSeries = [
    {
      name: "2024 Revenue Growth (%)",
      data: dataRevenueGrowth.growth2024 || [],
    },
    {
      name: "2025 Revenue Growth (%)",
      data: dataRevenueGrowth.growth2025 || [],
    },
  ];

  // Konfigurasi chart Lead Measure (versi kecil)
  const leadMeasureChartData = {
    labels: ["Lead Measure"],
    datasets: [
      {
        label: "Not Started",
        data: [dataLeadMeasureG.notStarted],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "In Progress",
        data: [dataLeadMeasureG.inProgress],
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Completed",
        data: [dataLeadMeasureG.completed],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const leadMeasureChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Lead Measure" } },
    indexAxis: "y",
    scales: { x: { stacked: true, beginAtZero: true }, y: { stacked: true } },
  };

  // Konfigurasi chart WIG Status (versi kecil)
  const wigStatusChartData = {
    labels: ["WIG Status"],
    datasets: [
      {
        label: "Not Started",
        data: [dataWigStatus.notStarted],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "In Progress",
        data: [dataWigStatus.inProgress],
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Completed",
        data: [dataWigStatus.completed],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const wigStatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" }, title: { display: true, text: "WIG Status" } },
    indexAxis: "y",
    scales: { x: { stacked: true, beginAtZero: true }, y: { stacked: true } },
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-gradient-to-r from-[#F14A00] to-[#FF8C00] dark:bg-slate-900 p-4 sm:p-6 transition-colors`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-700 shadow-lg rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/wig/logo.png" alt="Logo" width={80} height={80} />
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard Workshop 2024
          </h1>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <p className="text-gray-500 dark:text-gray-300">{formattedDate}</p>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg">
          <div className="space-y-4">
            {/* Metric Cards */}
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue Growth</h2>
              <p className="text-2xl font-bold text-orange-500">{dataGrowth.globalGrowth || 0}%</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Highest Monthly Revenue</h2>
              <p className="text-2xl font-bold text-green-500">{dataGrowth.revenueMetrics?.highest ?? "N/A"}%</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Monthly Revenue</h2>
              <p className="text-2xl font-bold text-blue-500">{dataGrowth.revenueMetrics?.average ?? "N/A"}%</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Lowest Monthly Revenue</h2>
              <p className="text-2xl font-bold text-red-500">{dataGrowth.revenueMetrics?.lowest ?? "N/A"}%</p>
            </div>
          </div>

          {/* Small Charts */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Lead Measure</h3>
            <div className="min-h-[150px] pb-2">
              <Bar data={leadMeasureChartData} options={leadMeasureChartOptions} />
            </div>
            <p className="text-sm mt-2">Progress: {dataLeadMeasureG.progress || 0}%</p>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">WIG Status</h3>
            <div className="min-h-[150px] pb-2">
              <Bar data={wigStatusChartData} options={wigStatusChartOptions} />
            </div>
            <p className="text-sm mt-2">Progress: {dataWigStatus.progress || 0}%</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 space-y-6">
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Monthly Growth 2024 vs 2025
            </h2>
            <div className="min-h-[300px]">
              {Object.keys(dataRevenueGrowth).length > 0 ? (
                <ApexChart
                  options={revenueOptions}
                  series={revenueSeries}
                  type="area"
                  height={350}
                />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>

          {/* Grafik Division Progress Horizontal dengan klik untuk popup */}
          <DivisionProgressChartHorizontal
            dataProgres={dataProgres}
            onDivisionClick={setSelectedDivision}
          />
        </main>
      </div>

      {/* Recent Updates Full Width */}
      <div className="mt-6">
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Recent Updates
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="px-2 py-1 text-left">Division</th>
                  <th className="px-2 py-1 text-left">WIG</th>
                  <th className="px-2 py-1 text-left">Lead Measure</th>
                  <th className="px-2 py-1 text-center">Input Progress</th>
                  <th className="px-2 py-1 text-center">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {dataLeadMeasureInput.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-t dark:border-slate-600">
                    <td className="px-2 py-1">{item.division}</td>
                    <td className="px-2 py-1">{item.wig}</td>
                    <td className="px-2 py-1">{item.leadMeasure}</td>
                    <td className="px-2 py-1 text-center">{item.input}</td>
                    <td className="px-2 py-1 text-center">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup Detail Division */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-white dark:bg-slate-700 dark:text-gray-200 rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{selectedDivision.name} Details</h2>
              <p className="mb-2">
                <strong>Lead Measure Progress:</strong> {selectedDivision.lmProgress}%
              </p>
              <p className="mb-4">
                <strong>WIG Progress:</strong> {selectedDivision.wigProgress}%
              </p>
              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-600">
                    <th className="border px-2 py-1 text-left">WIG</th>
                    <th className="border px-2 py-1 text-left">Lead Measure</th>
                    <th className="border px-2 py-1 text-center">Target</th>
                    <th className="border px-2 py-1 text-center">Actual</th>
                    <th className="border px-2 py-1 text-center">Achievement (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDivision.details?.map((item, idx) => (
                    <tr key={idx} className="dark:border-slate-600">
                      <td className="border px-2 py-1 dark:border-slate-600">{item.wigName}</td>
                      <td className="border px-2 py-1 dark:border-slate-600">{item.leadMeasure}</td>
                      <td className="border px-2 py-1 text-center dark:border-slate-600">{item.totalTarget}</td>
                      <td className="border px-2 py-1 text-center dark:border-slate-600">{item.totalActual}</td>
                      <td className="border px-2 py-1 text-center dark:border-slate-600">{item.achievement}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setSelectedDivision(null)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
