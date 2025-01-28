import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
// 1) Import ikon lucide sesuai request
import { ChartNoAxesCombined, TrendingUp, ChartLine, TrendingDown } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Data dummy
  const data = {
    globalGrowth: 3.7,
    revenueMetrics: {
      highest: 14.8,
      average: 3.3,
      lowest: -4.0,
    },
    leadMeasure: {
      total: 60,
      progress: 56.67,
      notStarted: 7,
      inProgress: 19,
      completed: 34,
    },
    wigStatus: {
      total: 29,
      progress: 41.38,
      notStarted: 2,
      inProgress: 15,
      completed: 12,
    },
    revenueGrowth: [3.5, 12.5, 14.8, -4.0, 5.7, 3.0, 2.3, 0.6, -2.3, -2.8],
    divisionProgress: [
      {
        name: 'ACCOUNTING',
        progress: 33.33,
        lmProgress: 45,
        wigProgress: 55,
        details: [
          {
            wigName: 'WIG 1',
            leadMeasure: 'Lead Measure A',
            totalTarget: 100,
            totalActual: 55,
            achievement: 55,
          },
          {
            wigName: 'WIG 2',
            leadMeasure: 'Lead Measure B',
            totalTarget: 80,
            totalActual: 40,
            achievement: 50,
          },
        ],
      },
      {
        name: 'ADMIN',
        progress: 25.93,
        lmProgress: 30,
        wigProgress: 40,
        details: [
          {
            wigName: 'WIG 1',
            leadMeasure: 'Lead Measure X',
            totalTarget: 90,
            totalActual: 45,
            achievement: 50,
          },
        ],
      },
      {
        name: 'AUDIT',
        progress: 100,
        lmProgress: 90,
        wigProgress: 100,
        details: [
          {
            wigName: 'WIG 1',
            leadMeasure: 'Lead Measure Y',
            totalTarget: 70,
            totalActual: 70,
            achievement: 100,
          },
          {
            wigName: 'WIG 2',
            leadMeasure: 'Lead Measure Z',
            totalTarget: 50,
            totalActual: 50,
            achievement: 100,
          },
        ],
      },
      {
        name: 'BUYER',
        progress: 96.3,
        lmProgress: 80,
        wigProgress: 85,
        details: [
          {
            wigName: 'WIG Pembelian',
            leadMeasure: 'Lead Measure Pembelian',
            totalTarget: 120,
            totalActual: 100,
            achievement: 83.3,
          },
        ],
      },
      {
        name: 'DC',
        progress: 100,
        lmProgress: 95,
        wigProgress: 100,
        details: [
          {
            wigName: 'WIG Distribusi',
            leadMeasure: 'Lead Measure Distribusi',
            totalTarget: 100,
            totalActual: 95,
            achievement: 95,
          },
        ],
      },
    ],
  };

  // Chart data & options (Revenue Growth)
  const revenueGrowthChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Revenue Growth (%)',
        data: data.revenueGrowth,
        backgroundColor: data.revenueGrowth.map((value) =>
          value < 0 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)'
        ),
        borderColor: data.revenueGrowth.map((value) =>
          value < 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Revenue Growth (%)' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Lead Measure chart
  const leadMeasureChartData = {
    labels: ['Lead Measure'],
    datasets: [
      {
        label: 'Not Started',
        data: [data.leadMeasure.notStarted],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'In Progress',
        data: [data.leadMeasure.inProgress],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Completed',
        data: [data.leadMeasure.completed],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  const leadMeasureChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Lead Measure Progress' },
    },
    indexAxis: 'y',
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { stacked: true },
    },
  };

  // WIG Status chart
  const wigStatusChartData = {
    labels: ['WIG Status'],
    datasets: [
      {
        label: 'Not Started',
        data: [data.wigStatus.notStarted],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'In Progress',
        data: [data.wigStatus.inProgress],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Completed',
        data: [data.wigStatus.completed],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  const wigStatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'WIG Status Progress' },
    },
    indexAxis: 'y',
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { stacked: true },
    },
  };

  // Handlers
  const handleDivisionClick = (division) => {
    setSelectedDivision(division);
  };
  const closePopup = () => {
    setSelectedDivision(null);
  };

  return (
    <div
      className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-slate-800 p-4 sm:p-6 transition-colors duration-300`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-slate-700 shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">
              Dashboard Workshop 2024
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-gray-500 dark:text-gray-200">26/01/2025</p>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">

        {/* GLOBAL GROWTH */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Global Growth</h2>
          {/* Icon + Percentage in one line with gold color */}
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400 mt-2">
          <ChartNoAxesCombined />
          <span>{data.globalGrowth}%</span>
           </div>
        </div>


        {/* HIGHEST MONTHLY REVENUE */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Highest Monthly Revenue</h2>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            <TrendingUp />
            <span>{data.revenueMetrics.highest}%</span>
          </div>
        </div>

        {/* AVERAGE MONTHLY REVENUE */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Average Monthly Revenue</h2>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            <ChartLine />
            <span>{data.revenueMetrics.average}%</span>
          </div>
        </div>

        {/* LOWEST MONTHLY REVENUE */}
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold">Lowest Monthly Revenue</h2>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
            <TrendingDown />
            <span>{data.revenueMetrics.lowest}%</span>
          </div>
        </div>
      </div>

      {/* Lead Measure & WIG Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md flex flex-col transition-colors">
          <h2 className="text-lg font-semibold">Leadmeasure Status</h2>
          <p className="text-xl sm:text-2xl font-bold mb-4">
            Progress: {data.leadMeasure.progress}%
          </p>
          <div className="flex-1" style={{ minHeight: '250px' }}>
            <Bar data={leadMeasureChartData} options={leadMeasureChartOptions} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <p className="text-sm font-semibold">Not Started</p>
              <p className="text-lg font-bold text-red-500">{data.leadMeasure.notStarted}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">In Progress</p>
              <p className="text-lg font-bold text-yellow-500">{data.leadMeasure.inProgress}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Completed</p>
              <p className="text-lg font-bold text-green-500">{data.leadMeasure.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md flex flex-col transition-colors">
          <h2 className="text-lg font-semibold">WIG Status</h2>
          <p className="text-xl sm:text-2xl font-bold mb-4">
            Progress: {data.wigStatus.progress}%
          </p>
          <div className="flex-1" style={{ minHeight: '250px' }}>
            <Bar data={wigStatusChartData} options={wigStatusChartOptions} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <p className="text-sm font-semibold">Not Started</p>
              <p className="text-lg font-bold text-red-500">{data.wigStatus.notStarted}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">In Progress</p>
              <p className="text-lg font-bold text-yellow-500">{data.wigStatus.inProgress}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Completed</p>
              <p className="text-lg font-bold text-green-500">{data.wigStatus.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Growth & Division Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md flex flex-col transition-colors">
          <h2 className="text-lg font-semibold mb-4">Revenue Growth 2024</h2>
          <div className="flex-1" style={{ minHeight: '300px' }}>
            <Bar data={revenueGrowthChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-700 dark:text-gray-200 p-4 rounded-lg shadow-md transition-colors">
          <h2 className="text-lg font-semibold mb-4">Division Progress</h2>
          <div className="space-y-2">
            {data.divisionProgress.map((division, index) => (
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
                        backgroundColor: division.progress === 100 ? 'blue' : 'green',
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{division.progress}%</span>
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
            <div className="bg-white dark:bg-slate-700 dark:text-gray-200 rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-md max-h-[80vh] overflow-auto transition-colors">
              <h2 className="text-lg font-bold mb-4">{selectedDivision.name} Details</h2>
              <p className="mb-2">
                <strong>Lead Measure Progress:</strong> {selectedDivision.lmProgress}%
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
                    <th className="border px-2 py-1 text-center">Achievement (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDivision.details?.map((item, idx) => (
                    <tr key={idx} className="dark:border-slate-600">
                      <td className="border px-2 py-1 dark:border-slate-600">{item.wigName}</td>
                      <td className="border px-2 py-1 dark:border-slate-600">{item.leadMeasure}</td>
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
    </div>
  );
};

export default Dashboard;
