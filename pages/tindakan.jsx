import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaSun, FaMoon } from "react-icons/fa";

const Tindakan = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Fungsi tombol navigasi
  const handleLeadMeasure = () => router.push("/leadmeasure");
  const handleDashboard = () => router.push("/dashboard");
  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Format tanggal realtime (DD/MM/YYYY)
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`;

  useEffect(() => {
    const storedData = localStorage.getItem("username");
    if (!storedData) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-gradient-to-r from-[#F14A00] to-[#FF8C00] dark:bg-slate-900 p-4 sm:p-6 transition-colors`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-700 shadow-lg rounded-lg p-4 mb-6 w-full flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/wig/logo.png" alt="logo" width={80} height={80} />
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Tindakan
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row items-center mt-4 sm:mt-0">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <button onClick={handleLeadMeasure} className="px-5 py-2 rounded-lg bg-[#377dff] text-white font-semibold shadow hover:bg-blue-700 transition">Lead Measure</button>
            <button onClick={handleDashboard} className="px-5 py-2 rounded-lg bg-[#22c55e] text-white font-semibold shadow hover:bg-green-700 transition">Dashboard</button>
            <button onClick={handleLogout} className="px-5 py-2 rounded-lg bg-[#ef4444] text-white font-semibold shadow hover:bg-red-700 transition">Logout</button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 dark:text-gray-300">{formattedDate}</p>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-md transition transform hover:-translate-y-0.5"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="bg-white dark:bg-slate-700 p-4 md:p-8 rounded shadow-md w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 underline mb-4">
          Halaman Tindakan
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
            Halaman ini sedang dalam pengembangan
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Fitur tindakan akan segera tersedia
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tindakan;
