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
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useRouter } from "next/router";
import CardMultiRingChart from "../components/CardMultiRingChart";
import CardStat from "../components/CardStat";
import CalendarWidget from "../components/CalendarWidget";

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
  ArcElement,
  ChartDataLabels
);

// Tambahkan palet warna tema utama
const THEME = {
  primary: "#377dff",
  secondary: "#23262F",
  accent: "#fbbf24",
  bgLight: "#f1efec",
  bgDark: "#23262F",
  cardLight: "#fff",
  cardDark: "#23262F",
  textLight: "#23262F",
  textDark: "#fff",
};

// Komponen grafik Division Progress Horizontal
const DivisionProgressChartHorizontal = ({ dataProgres, onDivisionClick, isDarkMode }) => {
  const labels = dataProgres.map((d) => d.name);
  const progressData = dataProgres.map((d) => d.progress || 0);
  const textColor = isDarkMode ? THEME.textDark : THEME.textLight;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Progress (%)",
        data: progressData,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "#2563eb";
          const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          gradient.addColorStop(0, "#2563eb");
          gradient.addColorStop(1, "#60a5fa");
          return gradient;
        },
        borderRadius: 12,
        borderSkipped: false,
        borderWidth: 0,
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
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-[#23262F] dark:text-white mb-2">Division Progress</h2>
      <div className="flex-1 flex">
        <Bar data={chartData} options={options} className="w-full h-full" />
      </div>
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

  const textColor = isDarkMode ? THEME.textDark : THEME.textLight;

  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("username");
    if (!storedData) {
      router.replace("/");
    }
  }, [router]);

  // State untuk jam digital
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { hour12: false });
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fungsi tombol
  const handleLeadMeasure = () => router.push("/leadmeasure");
  const handleDashboard = () => router.push("/dashboard");
  const handleLogout = () => {
    // Jika ada token di localStorage/sessionStorage, hapus di sini
    // localStorage.removeItem('token');
    router.push("/");
  };

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

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-gradient-to-r from-[#F14A00] to-[#FF8C00] dark:bg-[#23262F] p-4 sm:p-6 transition-colors`}>
      {/* Header */}
      <header className="bg-white dark:bg-[#23262F] shadow-lg rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/wig/logo.png" alt="logo" width={80} height={80} />
          <h1 className="text-xl sm:text-3xl font-bold text-[#23262F] dark:text-white">
            Dashboard Workshop 2024
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row items-center mt-4 sm:mt-0">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <button onClick={handleLeadMeasure} className="px-5 py-2 rounded-lg bg-[#377dff] text-white font-semibold shadow hover:bg-blue-700 transition">Lead Measure</button>
            <button onClick={handleDashboard} className="px-5 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-700 transition">Dashboard</button>
            <button onClick={handleLogout} className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-700 transition">Logout</button>
          </div>
          <div className="flex items-center gap-2">
            {isMounted && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 shadow text-white font-mono text-lg tracking-widest border border-blue-300 dark:border-blue-700 animate-pulse">
                <svg className="w-5 h-5 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4a.75.75 0 00-1.5 0v4.25c0 .414.336.75.75.75h3a.75.75 0 000-1.5h-2.25V6z" /></svg>
                {currentTime}
              </span>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-md transition transform hover:-translate-y-0.5"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Statistik Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardStat title="Total Growth" value={`${dataGrowth.globalGrowth || 0}%`} icon="dollar" className="bg-white dark:bg-[#23262F]" />
        <CardStat title="Highest Revenue" value={`${dataGrowth.revenueMetrics?.highest ?? "N/A"}%`} icon="up" className="bg-white dark:bg-[#23262F]" />
        <CardStat title="Avg Revenue" value={`${dataGrowth.revenueMetrics?.average ?? "N/A"}%`} icon="balance" className="bg-white dark:bg-[#23262F]" />
        <CardStat title="Lowest Revenue" value={`${dataGrowth.revenueMetrics?.lowest ?? "N/A"}%`} icon="down" className="bg-white dark:bg-[#23262F]" />
      </div>

      {/* Grid atas: Kalender & Revenue Growth sejajar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
        {/* Kalender di kiri */}
        <div className="flex flex-col h-full">
          <div className="bg-white dark:bg-[#23262F] rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
            <CalendarWidget />
          </div>
        </div>
        {/* Revenue Growth di kanan (span 2 kolom) */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white dark:bg-[#23262F] rounded-2xl p-6 shadow-lg h-full flex flex-col">
            <h2 className="text-lg font-semibold text-[#23262F] dark:text-white mb-2">Revenue Growth</h2>
            <div className="flex-1 min-h-[260px] flex items-center">
              <Line data={areaChartData} options={areaChartOptions} height={220} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid bawah: Division Progress & Status Overview sejajar, tinggi sama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
        {/* Division Progress */}
        <div className="flex flex-col h-full">
          <div className="bg-white dark:bg-[#23262F] rounded-2xl p-6 shadow-lg h-full flex flex-col">
            <DivisionProgressChartHorizontal
              dataProgres={dataProgres}
              onDivisionClick={setSelectedDivision}
              isDarkMode={isDarkMode}
              className="h-full"
            />
          </div>
        </div>
        {/* Status Overview */}
        <div className="flex flex-col h-full">
          <div className="bg-white dark:bg-[#23262F] rounded-2xl shadow-lg p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-[#23262F] dark:text-white mb-2 text-center">Status Overview</h2>
            <div className="flex flex-col gap-2 flex-1 justify-center">
              <CardMultiRingChart
                title="Lead Measure Status"
                series={[
                  dataLeadMeasureG.notStarted || 0,
                  dataLeadMeasureG.inProgress || 0,
                  dataLeadMeasureG.completed || 0,
                ]}
                labels={["Not Started", "In Progress", "Completed"]}
                colors={["#f87171", "#fbbf24", "#34d399"]}
                className="mb-2"
              />
              <CardMultiRingChart
                title="WIG Status"
                series={[
                  dataWigStatus.notStarted || 0,
                  dataWigStatus.inProgress || 0,
                  dataWigStatus.completed || 0,
                ]}
                labels={["Not Started", "In Progress", "Completed"]}
                colors={["#f87171", "#fbbf24", "#34d399"]}
                className="mt-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel recent updates */}
      <div className="bg-white dark:bg-[#23262F] rounded-2xl p-4 shadow-lg mb-8">
        <h2 className="text-sm font-medium text-[#23262F] dark:text-white mb-2">Recent Updates</h2>
        <div className="mb-2">
          <select
            value={selectedDivisionFilter}
            onChange={e => { setSelectedDivisionFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-1 border rounded focus:outline-none focus:ring bg-white dark:bg-[#23262F] text-[#23262F] dark:text-white border-gray-300 dark:border-gray-700"
          >
            {divisionOptions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white dark:bg-[#23262F]">
              <tr>
                <th className="px-2 py-1 text-left text-[#23262F] dark:text-white">Division</th>
                <th className="px-2 py-1 text-left text-[#23262F] dark:text-white">WIG</th>
                <th className="px-2 py-1 text-left text-[#23262F] dark:text-white">Lead Measure</th>
                <th className="px-2 py-1 text-center text-[#23262F] dark:text-white">Input Progress</th>
                <th className="px-2 py-1 text-center text-[#23262F] dark:text-white">Tanggal Pelaksanaan</th>
                <th className="px-2 py-1 text-center text-[#23262F] dark:text-white">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="px-2 py-1 text-[#23262F] dark:text-white">{item.division}</td>
                  <td className="px-2 py-1 text-[#23262F] dark:text-white">{item.wig}</td>
                  <td className="px-2 py-1 text-[#23262F] dark:text-white">{item.leadMeasure}</td>
                  <td className="px-2 py-1 text-center text-[#23262F] dark:text-white">{item.input}</td>
                  <td className="px-2 py-1 text-center text-[#23262F] dark:text-white">{item.tanggal_pelaksanaan}</td>
                  <td className="px-2 py-1 text-center text-[#23262F] dark:text-white">{item.timestamp}</td>
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
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-[#23262F] dark:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >Previous</button>
            <span className="text-[#23262F] dark:text-white">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-[#23262F] dark:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >Next</button>
          </div>
        )}
      </div>

      {/* Modal detail division tetap ada */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-white dark:bg-[#23262F] text-[#23262F] dark:text-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">{selectedDivision.name} Details</h2>
              <p className="mb-2">
                <strong>Lead Measure Progress:</strong> {selectedDivision.lmProgress}%
              </p>
              <p className="mb-4">
                <strong>WIG Progress:</strong> {selectedDivision.wigProgress}%
              </p>
              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="bg-white dark:bg-[#23262F]">
                    <th className="border px-2 py-1 text-left text-[#23262F] dark:text-white">WIG</th>
                    <th className="border px-2 py-1 text-left text-[#23262F] dark:text-white">Lead Measure</th>
                    <th className="border px-2 py-1 text-center text-[#23262F] dark:text-white">Target</th>
                    <th className="border px-2 py-1 text-center text-[#23262F] dark:text-white">Actual</th>
                    <th className="border px-2 py-1 text-center text-[#23262F] dark:text-white">Achievement (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDivision.details?.map((item, idx) => (
                    <tr key={idx} className="border dark:border-[#23262F]">
                      <td className="border px-2 py-1 text-[#23262F] dark:text-white">{item.wigName}</td>
                      <td className="border px-2 py-1 text-[#23262F] dark:text-white">{item.leadMeasure}</td>
                      <td className="border px-2 py-1 text-center text-[#23262F] dark:text-white">{item.totalTarget}</td>
                      <td className="border px-2 py-1 text-center text-[#23262F] dark:text-white">{item.totalActual}</td>
                      <td className="border px-2 py-1 text-center text-[#23262F] dark:text-white">{item.achievement}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setSelectedDivision(null)}
                className="w-full sm:w-auto px-4 py-2 bg-[#377dff] text-white rounded hover:bg-blue-600 transition"
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
