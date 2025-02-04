import React, { useEffect, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
// 1) Import ikon lucide sesuai request
import {
  ChartNoAxesCombined,
  TrendingUp,
  ChartLine,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {
  // [1] STATE
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [dataGrowth, setdataGrowth] = useState([]);
  const [dataRevenueGrowth, setDataRevenueGrowth] = useState([]);
  const [dataProgres, setDataProgres] = useState([]);
  const [dataLeadMeasureInput, setDataLeadMeasureInput] = useState([]);
  const [dataWigStatus, setDataWigStatus] = useState([]);
  const [dataLeadMeasureG, setDataLeadMeasureG] = useState([]);

  // [2] TANGGAL REAL-TIME DENGAN FORMAT DD/MM/YYYY
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // [3] HANDLER UNTUK DARK MODE
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // [4] USEEFFECT UNTUK MEMANGGIL DATA API
  useEffect(() => {
    const fetchGrowth = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/growth`
        );
        const data = await response.json();
        setdataGrowth(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    fetchGrowth();

    const fetchRevenueGrowth = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/getRevenueGrowth`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDataRevenueGrowth(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    fetchRevenueGrowth();

    const fetchProgres = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/getDivisionProgress`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDataProgres(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    fetchProgres();

    const fetchLeadMeasureInput = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/getLeadMeasureInput`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDataLeadMeasureInput(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    fetchLeadMeasureInput();

    const fetchWigStatus = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/getWigStatus`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDataWigStatus(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    fetchWigStatus();

    const fetchLeadMeasure = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/getLeadMeasureG`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDataLeadMeasureG(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    fetchLeadMeasure();
  }, []);

  // [5] CHART DATA & OPTIONS
  const revenueGrowthChartData = {
    labels: dataRevenueGrowth.months ?? [],
    datasets: [
      {
        label: "Revenue Growth (%)",
        data: dataRevenueGrowth.growth ?? [],
        backgroundColor: (dataRevenueGrowth.growth ?? []).map((value) =>
          value < 0 ? "rgba(255, 99, 132, 0.2)" : "rgba(75, 192, 192, 0.2)"
        ),
        borderColor: (dataRevenueGrowth.growth ?? []).map((value) =>
          value < 0 ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Revenue Growth (%)" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // LEAD MEASURE CHART
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
      legend: { position: "top" },
      title: { display: true, text: "Lead Measure Progress" },
    },
    indexAxis: "y",
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { stacked: true },
    },
  };

  // WIG STATUS CHART
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
      legend: { position: "top" },
      title: { display: true, text: "WIG Status Progress" },
    },
    indexAxis: "y",
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { stacked: true },
    },
  };

  // [6] HANDLER POPUP DIVISION
  const handleDivisionClick = (division) => {
    setSelectedDivision(division);
  };
  const closePopup = () => {
    setSelectedDivision(null);
  };

  // [7] RETURN JSX
  return (
    <div
      className={`${
        isDarkMode ? "dark" : ""
      } min-h-screen bg-gradient-to-r from-[#F14A00] to-[#FF8C00] dark:bg-slate-900 p-4 sm:p-6 transition-colors duration-300`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-slate-700 shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/wig/logo.png" // Pastikan logo berada di folder public/wig/
              alt="Deskripsi Gambar"
              width={100}
              height={100}
            />
            {/* Shimmer pada judul */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 shimmer-text">
              Dashboard Workshop 2024
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Tanggal dengan animasi motion + shimmer (opsional di shimmer) */}
            <motion.p
              className="text-gray-500 dark:text-gray-200"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {formattedDate}
            </motion.p>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
            {/* <div   onClick={tindakan} className="cursor-pointer font-xs mx-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">BACK</div> */}
          </div>
        </div>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* GLOBAL GROWTH */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Global Growth</h2>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400 mt-2">
            <ChartNoAxesCombined />
            {/* Efek cahaya pada persentase */}
            <span className="shimmer-text">
              {dataGrowth.globalGrowth}%
            </span>
          </div>
        </div>

        {/* HIGHEST MONTHLY REVENUE */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Highest Monthly Revenue</h2>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            <TrendingUp />
            <span className="shimmer-text">
              {dataGrowth.revenueMetrics?.highest ?? "N/A"}%
            </span>
          </div>
        </div>

        {/* AVERAGE MONTHLY REVENUE */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Average Monthly Revenue</h2>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            <ChartLine />
            <span className="shimmer-text">
              {dataGrowth.revenueMetrics?.average ?? "N/A"}%
            </span>
          </div>
        </div>

        {/* LOWEST MONTHLY REVENUE */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Lowest Monthly Revenue</h2>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
            <TrendingDown />
            <span className="shimmer-text">
              {dataGrowth.revenueMetrics?.lowest ?? "N/A"}%
            </span>
          </div>
        </div>
      </div>

      {/* Lead Measure & WIG Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* LEAD MEASURE */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md flex flex-col transition-colors">
          <h2 className="text-lg font-semibold">Leadmeasure Status</h2>
          <p className="text-xl sm:text-2xl font-bold mb-4">
            Progress: {dataLeadMeasureG.progress}%
          </p>
          <div className="flex-1" style={{ minHeight: "250px" }}>
            <Bar data={leadMeasureChartData} options={leadMeasureChartOptions} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <p className="text-sm font-semibold">Not Started</p>
              <p className="text-lg font-bold text-red-500">
                {dataLeadMeasureG.notStarted}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">In Progress</p>
              <p className="text-lg font-bold text-yellow-500">
                {dataLeadMeasureG.inProgress}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Completed</p>
              <p className="text-lg font-bold text-green-500">
                {dataLeadMeasureG.completed}
              </p>
            </div>
          </div>
        </div>

        {/* WIG STATUS */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md flex flex-col transition-colors">
          <h2 className="text-lg font-semibold">WIG Status</h2>
          <p className="text-xl sm:text-2xl font-bold mb-4">
            Progress: {(dataWigStatus.progress || 0).toString()}%
          </p>
          <div className="flex-1" style={{ minHeight: "250px" }}>
            <Bar data={wigStatusChartData} options={wigStatusChartOptions} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <p className="text-sm font-semibold">Not Started</p>
              <p className="text-lg font-bold text-red-500">
                {dataWigStatus.notStarted}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">In Progress</p>
              <p className="text-lg font-bold text-yellow-500">
                {dataWigStatus.inProgress}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Completed</p>
              <p className="text-lg font-bold text-green-500">
                {dataWigStatus.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Growth & Division Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md flex flex-col transition-colors">
          <h2 className="text-lg font-semibold mb-4">Revenue Growth 2024</h2>
          <div className="flex-1" style={{ minHeight: "300px" }}>
            <Bar data={revenueGrowthChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold mb-4">Division Progress</h2>
          <div className="space-y-2">
            {dataProgres.map((division, index) => (
              <div key={index}>
                <p
                  className="text-sm font-semibold cursor-pointer hover:text-blue-500"
                  onClick={() => handleDivisionClick(division)}
                >
                  {division.name}
                </p>
                <div className="flex items-center">
                  <div className="relative flex-1 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${division.progress}%`,
                        backgroundColor:
                          division.progress === 100 ? "blue" : "green",
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {division.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Division */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            {/* Modal container dengan max height dan overflow-y untuk scroll */}
            <div className="bg-white dark:bg-slate-700 dark:text-gray-200 rounded-lg p-4 sm:p-6 shadow-lg transition-colors max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">
                {selectedDivision.name} Details
              </h2>
              <p className="mb-2">
                <strong>Lead Measure Progress:</strong>{" "}
                {selectedDivision.lmProgress}%
              </p>
              <p className="mb-4">
                <strong>WIG Progress:</strong> {selectedDivision.wigProgress}%
              </p>

              <table className="min-w-full border text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-600">
                    <th className="border px-2 py-1 text-left">WIG</th>
                    <th className="border px-2 py-1 text-left">Lead Measure</th>
                    <th className="border px-2 py-1 text-center">Target</th>
                    <th className="border px-2 py-1 text-center">Actual</th>
                    <th className="border px-2 py-1 text-center">
                      Achievement (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDivision.details?.map((item, idx) => (
                    <tr key={idx} className="dark:border-slate-600">
                      <td className="border px-2 py-1 dark:border-slate-600">
                        {item.wigName}
                      </td>
                      <td className="border px-2 py-1 dark:border-slate-600">
                        {item.leadMeasure}
                      </td>
                      <td className="border px-2 py-1 text-center dark:border-slate-600">
                        {item.totalTarget}
                      </td>
                      <td className="border px-2 py-1 text-center dark:border-slate-600">
                        {item.totalActual}
                      </td>
                      <td className="border px-2 py-1 text-center dark:border-slate-600">
                        {item.achievement}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={closePopup}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* [BARU] Tabel History Update (hanya 10 data) */}
      <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
        <h2 className="text-lg font-semibold mb-4">
          Divisi ini baru saja update:
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-600">
                <th className="border px-2 py-1 text-left">Divisi</th>
                <th className="border px-2 py-1 text-left">WIG</th>
                <th className="border px-2 py-1 text-left">Lead Measure</th>
                <th className="border px-2 py-1 text-center">Input Progress</th>
                <th className="border px-2 py-1 text-center">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dataLeadMeasureInput
                .slice(0, 10) // <-- hanya 10 baris data teratas
                .map((item, idx) => (
                  <tr key={idx} className="dark:border-slate-600">
                    <td className="border px-2 py-1 dark:border-slate-600">
                      {item.division}
                    </td>
                    <td className="border px-2 py-1 dark:border-slate-600">
                      {item.wig}
                    </td>
                    <td className="border px-2 py-1 dark:border-slate-600">
                      {item.leadMeasure}
                    </td>
                    <td className="border px-2 py-1 text-center dark:border-slate-600">
                      {item.input}
                    </td>
                    <td className="border px-2 py-1 text-center dark:border-slate-600">
                      {item.timestamp}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS Shimmer Effect */}
      <style jsx>{`
        .shimmer-text {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }
        .shimmer-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: -200%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% {
            left: -200%;
          }
          100% {
            left: 200%;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
