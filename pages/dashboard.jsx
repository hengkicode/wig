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

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [selectedDivision, setSelectedDivision] = useState(null);

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

  // Contoh data chart untuk Revenue Growth
  const revenueGrowthChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Revenue Growth (%)',
        data: data.revenueGrowth,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Growth (%)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Lead Measure Chart
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
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Lead Measure Progress',
      },
    },
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  // WIG Status Chart
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
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'WIG Status Progress',
      },
    },
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  // Event saat klik divisi
  const handleDivisionClick = (division) => {
    setSelectedDivision(division);
  };

  const closePopup = () => {
    setSelectedDivision(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-full" />
            <h1 className="text-3xl font-bold">Dashboard Workshop 2024</h1>
          </div>
          <p className="text-gray-500">26/01/2025</p>
        </div>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Global Growth</h2>
          <p className="text-2xl font-bold text-blue-600">{data.globalGrowth}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Highest Monthly Revenue</h2>
          <p className="text-2xl font-bold text-green-600">{data.revenueMetrics.highest}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Average Monthly Revenue</h2>
          <p className="text-2xl font-bold text-blue-600">{data.revenueMetrics.average}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Lowest Monthly Revenue</h2>
          <p className="text-2xl font-bold text-red-600">{data.revenueMetrics.lowest}%</p>
        </div>
      </div>

      {/* Lead Measure and WIG Status */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Leadmeasure Status</h2>
          <p className="text-2xl font-bold mb-4">Progress: {data.leadMeasure.progress}%</p>
          <div style={{ height: '300px' }}>
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
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">WIG Status</h2>
          <p className="text-2xl font-bold mb-4">Progress: {data.wigStatus.progress}%</p>
          <div style={{ height: '300px' }}>
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

      {/* Revenue Growth and Division Progress */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Revenue Growth 2024</h2>
          <div style={{ height: '400px' }}>
            <Bar data={revenueGrowthChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
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
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                    style={{ width: `${division.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup for Division Details */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-6 shadow-lg w-96 max-h-[80vh] overflow-auto">
              <h2 className="text-lg font-bold mb-4">{selectedDivision.name} Details</h2>
              
              {/* Bisa juga tampilkan ringkasan progress di sini */}
              <p className="mb-2">
                <strong>Lead Measure Progress:</strong> {selectedDivision.lmProgress}%
              </p>
              <p className="mb-4">
                <strong>WIG Progress:</strong> {selectedDivision.wigProgress}%
              </p>

              {/* Tabel detail */}
              <table className="min-w-full border text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">WIG</th>
                    <th className="border px-2 py-1 text-left">Lead Measure</th>
                    <th className="border px-2 py-1 text-center">Target</th>
                    <th className="border px-2 py-1 text-center">Actual</th>
                    <th className="border px-2 py-1 text-center">Achievement (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDivision.details?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.wigName}</td>
                      <td className="border px-2 py-1">{item.leadMeasure}</td>
                      <td className="border px-2 py-1 text-center">{item.totalTarget}</td>
                      <td className="border px-2 py-1 text-center">{item.totalActual}</td>
                      <td className="border px-2 py-1 text-center">{item.achievement}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={closePopup}
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
