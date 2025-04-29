import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Import icon dari react-icons
import { FaDollarSign, FaArrowUp, FaBalanceScale, FaArrowDown, FaSun, FaMoon } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

// Komponen grafik Division Progress Horizontal
const DivisionProgressChartHorizontal = ({ dataProgres, onDivisionClick, isDarkMode }) => {
  const containerHeight = Math.max(400, dataProgres.length * 40);
  const labels = dataProgres.map((d) => d.name);
  const progressData = dataProgres.map((d) => d.progress || 0);
  const textColor = isDarkMode ? "#fff" : "#000";

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
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        display: false,
      },
      y: {
        ticks: {
          color: textColor,
        },
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        offset: 0,
        formatter: (value) => value + "%",
        color: textColor,
        font: { weight: "bold" },
      },
      legend: {
        labels: {
          color: textColor,
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
      className={`bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg ${
        dataProgres.length * 40 > 400 ? "overflow-y-auto" : ""
      }`}
      style={{ height: containerHeight }}
    >
      <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
        Division Progress
      </h2>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState('All');
  const itemsPerPage = 10;

  const textColor = isDarkMode ? "#fff" : "#000";

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
          throw new Error(`HTTP error! status: ${leadMeasureGRes.status}`);
        setDataLeadMeasureG(await leadMeasureGRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // derive division options
  const divisionOptions = ['All', ...new Set(dataLeadMeasureInput.map(item => item.division))];

  // Filter data berdasarkan division saja
  const filteredData = dataLeadMeasureInput.filter(item =>
    selectedDivisionFilter === 'All' || item.division === selectedDivisionFilter
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // Konfigurasi area chart untuk Revenue Growth dengan gradient fill dan data label di top
  const areaChartData = {
    labels: dataRevenueGrowth.months || [],
    datasets: [
      {
        label: "2024 Revenue Growth (%)",
        data: dataRevenueGrowth.growth2024 || [],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return "rgba(75,192,192,0.2)";
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(75,192,192,0.4)");
          gradient.addColorStop(1, "rgba(75,192,192,0)");
          return gradient;
        },
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "2025 Revenue Growth (%)",
        data: dataRevenueGrowth.growth2025 || [],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return "rgba(255,165,0,0.2)";
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(255,165,0,0.4)");
          gradient.addColorStop(1, "rgba(255,165,0,0)");
          return gradient;
        },
        borderColor: "rgba(255,165,0,1)",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: textColor },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => value + "%",
        color: textColor,
        font: { weight: "bold" },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        display: true, // Jika x-axis perlu tetap muncul, sesuaikan jika ingin disembunyikan
        ticks: {
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
          color: textColor,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
          color: textColor,
        },
      },
    },
  };

  // Konfigurasi chart Lead Measure (versi kecil) dengan data label di tengah
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
    plugins: {
      legend: { 
        position: "top",
        labels: { color: textColor }
      },
      title: { display: true, text: "Lead Measure", color: textColor },
      datalabels: {
        anchor: "center",
        align: "center",
        offset: 0,
        formatter: (value) => value,
        color: textColor,
        font: { weight: "bold" },
      },
    },
    indexAxis: "y",
    scales: {
      x: { 
        stacked: true, 
        beginAtZero: true,
        ticks: { color: textColor }
      },
      y: { 
        stacked: true,
        ticks: { color: textColor }
      },
    },
  };

  // Konfigurasi chart WIG Status (versi kecil) dengan data label di tengah
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
    plugins: {
      legend: { 
        position: "top",
        labels: { color: textColor }
      },
      title: { display: true, text: "WIG Status", color: textColor },
      datalabels: {
        anchor: "center",
        align: "center",
        offset: 0,
        formatter: (value) => value,
        color: textColor,
        font: { weight: "bold" },
      },
    },
    indexAxis: "y",
    scales: {
      x: { 
        stacked: true, 
        beginAtZero: true,
        ticks: { color: textColor }
      },
      y: { 
        stacked: true,
        ticks: { color: textColor }
      },
    },
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-gradient-to-r from-[#F14A00] to-[#FF8C00] dark:bg-slate-900 p-4 sm:p-6 transition-colors`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-700 shadow-lg rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/wig/logo.png" alt="logo" width={80} height={80} />
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard Workshop 2024
          </h1>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <p className="text-gray-500 dark:text-gray-300">{formattedDate}</p>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-md transition transform hover:-translate-y-0.5"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg">
          <div className="space-y-4">
            {/* Revenue Growth Card */}
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow flex items-center">
              <FaDollarSign className="text-orange-500 mr-2" size={24} />
              <div>
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue Growth</h2>
                <p className="text-2xl font-bold text-orange-500">{dataGrowth.globalGrowth || 0}%</p>
              </div>
            </div>
            {/* Highest Monthly Revenue Card */}
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow flex items-center">
              <FaArrowUp className="text-green-500 mr-2" size={24} />
              <div>
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Highest Monthly Revenue</h2>
                <p className="text-2xl font-bold text-green-500">{dataGrowth.revenueMetrics?.highest ?? "N/A"}%</p>
              </div>
            </div>
            {/* Average Monthly Revenue Card */}
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow flex items-center">
              <FaBalanceScale className="text-blue-500 mr-2" size={24} />
              <div>
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Monthly Revenue</h2>
                <p className="text-2xl font-bold text-blue-500">{dataGrowth.revenueMetrics?.average ?? "N/A"}%</p>
              </div>
            </div>
            {/* Lowest Monthly Revenue Card */}
            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg shadow flex items-center">
              <FaArrowDown className="text-red-500 mr-2" size={24} />
              <div>
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Lowest Monthly Revenue</h2>
                <p className="text-2xl font-bold text-red-500">{dataGrowth.revenueMetrics?.lowest ?? "N/A"}%</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Lead Measure</h3>
            <p className="text-xl mt-2 dark:text-white">Progress: {dataLeadMeasureG.progress || 0}%</p>
            <div className="min-h-[150px] pb-2">
              <Bar data={leadMeasureChartData} options={leadMeasureChartOptions} />
            </div>
            
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">WIG Status</h3>
            <p className="text-xl mt-2 dark:text-white">Progress: {dataWigStatus.progress || 0}%</p>
            <div className="min-h-[150px] pb-2">
              <Bar data={wigStatusChartData} options={wigStatusChartOptions} />
            </div>
            
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 space-y-6">
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
              Monthly Growth 2024 vs 2025
            </h2>
            <div className="min-h-[300px]">
              {Object.keys(dataRevenueGrowth).length > 0 ? (
                <Line data={areaChartData} options={areaChartOptions} height={350} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>

          <DivisionProgressChartHorizontal
            dataProgres={dataProgres}
            onDivisionClick={setSelectedDivision}
            isDarkMode={isDarkMode}
          />
        </main>
      </div>

      <div className="mt-6">
        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Recent Updates</h2>
          <div className="mb-2">
            <select
              value={selectedDivisionFilter}
              onChange={e => { setSelectedDivisionFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring bg-white"
            >
              {divisionOptions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="px-2 py-1 text-left dark:text-white">Division</th>
                  <th className="px-2 py-1 text-left dark:text-white">WIG</th>
                  <th className="px-2 py-1 text-left dark:text-white">Lead Measure</th>
                  <th className="px-2 py-1 text-center dark:text-white">Input Progress</th>
                  <th className="px-2 py-1 text-center dark:text-white">Tanggal Pelaksanaan</th>
                  <th className="px-2 py-1 text-center dark:text-white">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr key={idx} className="border-t dark:border-slate-600">
                    <td className="px-2 py-1 dark:text-white">{item.division}</td>
                    <td className="px-2 py-1 dark:text-white">{item.wig}</td>
                    <td className="px-2 py-1 dark:text-white">{item.leadMeasure}</td>
                    <td className="px-2 py-1 text-center dark:text-white">{item.input}</td>
                    <td className="px-2 py-1 text-center dark:text-white">{item.tanggal_pelaksanaan}</td>
                    <td className="px-2 py-1 text-center dark:text-white">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >Previous</button>
              <span className="dark:text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >Next</button>
            </div>
          )}
        </div>
      </div>

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
