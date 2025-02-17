import { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import LeadMeasure from "./leadmeasure";
import Index from "./index";

export default function Tindakan() {
  const [activeComponent, setActiveComponent] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Ambil data username dari localStorage
    const storedData = localStorage.getItem("username");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData); // Parse JSON yang disimpan
        if (parsedData?.value) {
          setUsername(parsedData.value);

          // Jika username adalah "gm", langsung ke Dashboard
          if (parsedData.value == "gm") {
            setActiveComponent("dashboard");
          }
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  const logout = () => {
    localStorage.clear('username');
    localStorage.clear('nama_devisi');
    localStorage.clear('divisi');
    localStorage.clear('id')
    window.location.reload();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {username !== "gm" ? (
        <div className="text-center flex flex-col items-center justify-center p-4">
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

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}

      <div className="w-full">
        {activeComponent === "leadmeasure" && <LeadMeasure />}
        {activeComponent === "dashboard" && <Dashboard />}
      </div>
    </div>
  );
}
