import React, { useState } from "react";

const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
// Hari libur nasional Indonesia 2025 (sesuai SKB resmi)
const liburNasional = {
  "2025-01-01": "Tahun Baru Masehi",
  "2025-01-29": "Isra Miraj Nabi Muhammad SAW",
  "2025-01-31": "Tahun Baru Imlek 2576 Kongzili",
  "2025-03-29": "Hari Raya Idul Fitri 1446 H",
  "2025-03-30": "Hari Raya Idul Fitri 1446 H",
  "2025-03-31": "Cuti Bersama Idul Fitri",
  "2025-04-01": "Cuti Bersama Idul Fitri",
  "2025-04-17": "Wafat Isa Almasih",
  "2025-05-01": "Hari Buruh Internasional",
  "2025-05-08": "Kenaikan Isa Almasih",
  "2025-05-19": "Hari Raya Waisak 2569 BE",
  "2025-05-29": "Kenaikan Isa Almasih (Kedua)",
  "2025-06-01": "Hari Lahir Pancasila",
  "2025-06-06": "Hari Raya Idul Adha 1446 H",
  "2025-06-26": "Tahun Baru Islam 1447 H",
  "2025-07-17": "Maulid Nabi Muhammad SAW",
  "2025-08-17": "Hari Kemerdekaan RI",
  "2025-09-25": "Hari Raya Galungan",
  "2025-10-02": "Hari Raya Kuningan",
  "2025-12-25": "Hari Raya Natal"
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthName(month) {
  return [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ][month];
}

export default function CalendarWidget() {
  const today = new Date();
  const [showYear, setShowYear] = useState(today.getFullYear());
  const [showMonth, setShowMonth] = useState(today.getMonth());
  const tanggalHariIni = today.getDate();
  const isThisMonth = showYear === today.getFullYear() && showMonth === today.getMonth();

  const daysInMonth = getDaysInMonth(showYear, showMonth);
  const firstDay = new Date(showYear, showMonth, 1).getDay();

  // Buat array tanggal untuk grid kalender
  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) dates.push(d);

  // Navigasi bulan
  const handlePrev = () => {
    if (showMonth === 0) {
      setShowMonth(11);
      setShowYear(showYear - 1);
    } else {
      setShowMonth(showMonth - 1);
    }
  };
  const handleNext = () => {
    if (showMonth === 11) {
      setShowMonth(0);
      setShowYear(showYear + 1);
    } else {
      setShowMonth(showMonth + 1);
    }
  };

  return (
    <div className="w-full max-w-xs bg-white dark:bg-[#181A20] rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={handlePrev} className="px-2 py-1 text-[#F14A00] dark:text-[#fbbf24] font-bold text-lg">&#8592;</button>
        <span className="font-bold text-[#F14A00] dark:text-[#fbbf24] text-lg">
          {getMonthName(showMonth)} {showYear}
        </span>
        <button onClick={handleNext} className="px-2 py-1 text-[#F14A00] dark:text-[#fbbf24] font-bold text-lg">&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs mb-1">
        {hari.map((h, idx) => (
          <div key={h} className={`text-center font-semibold ${idx === 0 ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-300"}`}>{h}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((d, i) => {
          const dateStr = d ? `${showYear}-${String(showMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` : "";
          const isLibur = !!liburNasional[dateStr];
          const isToday = isThisMonth && d === tanggalHariIni;
          const dayOfWeek = (i % 7);
          const isSunday = dayOfWeek === 0 && d !== null;
          return (
            <div
              key={i}
              title={isLibur ? liburNasional[dateStr] : undefined}
              className={`text-center rounded-full py-1 transition
                ${d === null ? "" :
                  isToday ? "bg-[#F14A00] text-white font-bold" :
                  isLibur ? "bg-red-100 text-red-600 font-bold dark:bg-red-900 dark:text-red-200" :
                  isSunday ? "text-red-500 dark:text-red-400 font-bold" :
                  "text-[#23262F] dark:text-white hover:bg-orange-100 dark:hover:bg-[#23262F] cursor-pointer"}
              `}
            >
              {d || ""}
            </div>
          );
        })}
      </div>
      {/* Keterangan hari libur */}
      <div className="mt-2 text-xs text-red-600 dark:text-red-300">
        <span className="font-semibold">Hari Libur Nasional:</span>
        <ul className="list-disc ml-4">
          {Object.entries(liburNasional)
            .filter(([key]) => key.startsWith(`${showYear}-${String(showMonth + 1).padStart(2, "0")}`))
            .map(([key, val]) => (
              <li key={key}>{key.split("-")[2]}: {val}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}
