import { useState } from "react";
import Dashboard from "./dashboard";
import LeadMeasure from "./leadmeasure";

export default function Tindakan() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!activeComponent && (
        <div className="text-center flex flex-col items-center justify-center p-4"> 
          <h1 className="text-2xl font-bold mb-4">Selamat Datang</h1>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveComponent("leadmeasure")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Lead Measure
            </button>
            <button
              onClick={() => setActiveComponent("dashboard")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
      <div className="w-full">
        {activeComponent === "leadmeasure" && <LeadMeasure />}
        {activeComponent === "dashboard" && <Dashboard />}
      </div>
    </div>
  );
}
