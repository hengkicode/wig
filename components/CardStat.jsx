import React from "react";
import { FaArrowUp, FaArrowDown, FaBalanceScale, FaChartPie } from "react-icons/fa";

const iconMap = {
  up: <FaArrowUp className="text-green-400" style={{ fontSize: 48 }} />,
  down: <FaArrowDown className="text-red-400" style={{ fontSize: 48 }} />,
  balance: <FaBalanceScale className="text-blue-400" style={{ fontSize: 48 }} />,
  pie: <FaChartPie className="text-orange-400" style={{ fontSize: 48 }} />,
};

export default function CardStat({
  title,
  value,
  icon = null,
  color = "",
  className = "",
}) {
  return (
    <div
      className={`bg-white dark:bg-[#23262F] rounded-2xl p-6 flex flex-col justify-between shadow-lg min-h-[120px] ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#23262F] dark:text-gray-300 text-sm font-medium">{title}</span>
        {icon && <span className="text-4xl flex items-center justify-center">{iconMap[icon]}</span>}
      </div>
      <div className="flex items-end justify-between mt-2">
        <span className="text-3xl font-bold text-[#23262F] dark:text-white tracking-tight">{value}</span>
      </div>
    </div>
  );
}
