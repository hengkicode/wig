import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaSun, FaMoon } from "react-icons/fa";

const Leadmeasure = () => {
  const [wigOptions, setWigOptions] = useState([]);
  const [selectedWig, setSelectedWig] = useState(null);
  const [divisi, setDivisi] = useState(null);
  const [id_devisi, setid_devisi] = useState(null);
  const [leadmeasure, setLeadMeasure] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [dateValues, setDateValues] = useState({});
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fungsi tombol navigasi
  const handleLeadMeasure = () => router.push("/leadmeasure");
  const handleDashboard = () => router.push("/dashboard");
  const handleLogout = () => {
    // Bersihkan localStorage jika perlu
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

  useEffect(() => {
    const storedDivisi = localStorage.getItem("nama_divisi");
    if (storedDivisi) {
      const parsedDivisi = JSON.parse(storedDivisi);
      if (parsedDivisi.expiry > Date.now()) {
        setDivisi(parsedDivisi.value);
      }
    }

    const div = localStorage.getItem("divisi");
    if (div) {
      const parsedDiv = JSON.parse(div);
      if (parsedDiv.expiry > Date.now()) {
        setid_devisi(parsedDiv.value);
      }
    }

    const fetchWigOptions = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/getwig/${id_devisi}`
        );
        const data = await response.json();

        const options = Array.isArray(data.data)
          ? data.data.map((item) => ({
              value: item.id_wig,
              label: item.wig,
            }))
          : [];

        setWigOptions(options);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    if (id_devisi) {
      fetchWigOptions();
    }
  }, [id_devisi]);

  useEffect(() => {
    if (selectedWig) {
      getLeadMeasure();
    }
  }, [selectedWig]);

  const getLeadMeasure = async () => {
    if (!selectedWig) {
      console.error("Selected WIG is not set.");
      return;
    }

    try {
      const response = await fetch(
        `http://202.58.199.194:8080/api-appit/public/wig/getLeadMeasure`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wig: selectedWig.value,
          }),
        }
      );
      const data = await response.json();

      const initialInputValues = {};
      const initialDateValues = {};
      (data.data || []).forEach((item) => {
        initialInputValues[item.id_leadmeasure] = item.actual_input || "";
        initialDateValues[item.id_leadmeasure] = item.tanggal_pelaksanaan || "";
      });

      setLeadMeasure(data.data || []);
      setInputValues(initialInputValues);
      setDateValues(initialDateValues);
    } catch (error) {
      console.error("Error fetching lead measure:", error);
      setLeadMeasure([]);
      setInputValues({});
      setDateValues({});
    }
  };

  const updateLeadmeasure = async (id_leadmeasure) => {
    if (!selectedWig) {
      console.error("Selected WIG is not set.");
      return;
    }

    const tanggalPelaksanaan = dateValues[id_leadmeasure];
    const actualInput = inputValues[id_leadmeasure];

    if (!actualInput || !tanggalPelaksanaan) {
      alert("Actual dan Tanggal Pelaksanaan harus diisi.");
      return;
    }

    try {
      const response = await fetch(
        `http://202.58.199.194:8080/api-appit/public/wig/updateLeadMeasure`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_wig: selectedWig.value,
            id_leadmeasure: id_leadmeasure,
            actual_input: actualInput,
            tanggal_pelaksanaan: tanggalPelaksanaan,
          }),
        }
      );
      const data = await response.json();
      alert(data.message);
      getLeadMeasure();
    } catch (error) {
      console.error("Error updating lead measure:", error);
    }
  };

  const hapusLeadmeasure = async (id_leadmeasure) => {
    if (!selectedWig) {
      console.error("Selected WIG is not set.");
      return;
    }

    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus leadmeasure ini?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://202.58.199.194:8080/api-appit/public/wig/hapusLeadMeasure`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_leadmeasure: id_leadmeasure,
          }),
        }
      );
      const data = await response.json();
      alert(data.message);
      getLeadMeasure();
    } catch (error) {
      console.error("Error deleting lead measure:", error);
    }
  };

  const tambahBaris = () => {
    const newRowData = {
      id_leadmeasure: `new-${Date.now()}`,
      leadmeasure: "",
      sisa_target: 0,
      rill_target: 0,
      actual_input: 0,
      tanggal_pelaksanaan: "",
      isNew: true,
    };

    setLeadMeasure((prev) => [...prev, newRowData]);
    setInputValues((prev) => ({
      ...prev,
      [newRowData.id_leadmeasure]: "",
    }));
  };

  const saveBarisBaru = async () => {
    if (!selectedWig) {
      console.error("Selected WIG is not set.");
      return;
    }

    try {
      const newRows = leadmeasure.filter((item) => item.isNew);
      for (const row of newRows) {
        if (!row.leadmeasure || !row.rill_target || !row.tanggal_pelaksanaan) {
          alert(
            "Lead Measure, Rill Target, dan Tanggal Pelaksanaan tidak boleh kosong."
          );
          return;
        }

        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/tambahLeadMeasure`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_devisi: id_devisi,
              id_wig: selectedWig.value,
              leadmeasure: row.leadmeasure,
              sisa_target: row.sisa_target,
              rill_target: row.rill_target,
              tanggal_pelaksanaan: row.tanggal_pelaksanaan,
            }),
          }
        );
        const data = await response.json();
        alert(data.message);
      }
      getLeadMeasure();
    } catch (error) {
      console.error("Error saving new lead measure:", error);
    }
  };

  const handleInputChange = (id_leadmeasure, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id_leadmeasure]: value,
    }));
  };

  const handleDateChange = (id_leadmeasure, value) => {
    setDateValues((prevValues) => ({
      ...prevValues,
      [id_leadmeasure]: value,
    }));
  };

  const handleNewRowChange = (index, field, value) => {
    const updatedLeadmeasure = [...leadmeasure];
    updatedLeadmeasure[index][field] = value;
    if (field === "rill_target") {
      updatedLeadmeasure[index].sisa_target = value;
    }
    setLeadMeasure(updatedLeadmeasure);
  };

  const tindakan = () => {
    navigate("/tindakan");
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-gradient-to-r from-[#F14A00] to-[#FF8C00] dark:bg-slate-900 p-4 sm:p-6 transition-colors`}>
      {/* Header profesional */}
      <header className="bg-white dark:bg-slate-700 shadow-lg rounded-lg p-4 mb-6 w-full flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/wig/logo.png" alt="logo" width={80} height={80} />
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Lead Measure Input
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

      <div className="bg-white p-4 md:p-8 rounded shadow-md w-full">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 underline">
            Input Lead Measure
          </h2>
          {divisi && (
            <p className="text-gray-700 font-bold ml-4">Divisi: {divisi}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="wig"
          >
            Pilih WIG
          </label>
          <Select
            id="wig"
            options={wigOptions}
            value={selectedWig}
            onChange={(option) => setSelectedWig(option)}
            placeholder="Pilih WIG"
            className="shadow appearance-none border rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            List Lead Measure <br />
            {selectedWig ? `(${selectedWig.label})` : ""}
          </label>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-2 md:px-4 py-2">No</th>
                  <th className="px-2 md:px-4 py-2">Lead Measure</th>
                  <th className="px-2 md:px-4 py-2">Gap</th>
                  <th className="px-2 md:px-4 py-2">Target</th>
                  <th className="px-2 md:px-4 py-2">Tanggal Pelaksanaan</th>
                  <th className="px-2 md:px-4 py-2">Actual</th>
                  <th className="px-2 md:px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {leadmeasure.map((item, index) => (
                  <tr key={item.id_leadmeasure || index}>
                    <td className="border px-2 md:px-4 py-2">{index + 1}</td>
                    <td className="border px-2 md:px-4 py-2">
                      {item.isNew ? (
                        <input
                          type="text"
                          className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={item.leadmeasure}
                          onChange={(e) =>
                            handleNewRowChange(index, "leadmeasure", e.target.value)
                          }
                        />
                      ) : (
                        item.leadmeasure
                      )}
                    </td>
                    <td className="border px-2 md:px-4 py-2">
                      {item.isNew ? (
                        <input
                          type="number"
                          className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                          value={item.sisa_target}
                          readOnly
                        />
                      ) : (
                        item.sisa_target
                      )}
                    </td>
                    <td className="border px-2 md:px-4 py-2">
                      {item.isNew ? (
                        <input
                          type="number"
                          className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={item.rill_target}
                          onChange={(e) =>
                            handleNewRowChange(index, "rill_target", e.target.value)
                          }
                        />
                      ) : (
                        item.rill_target
                      )}
                    </td>
                    <td className="border px-2 md:px-4 py-2">
                      {item.isNew ? (
                        <input
                          type="date"
                          className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={item.tanggal_pelaksanaan || ""}
                          onChange={(e) =>
                            handleNewRowChange(
                              index,
                              "tanggal_pelaksanaan",
                              e.target.value
                            )
                          }
                          required
                        />
                      ) : (
                        <input
                          type="date"
                          className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={dateValues[item.id_leadmeasure] || ""}
                          onChange={(e) =>
                            handleDateChange(item.id_leadmeasure, e.target.value)
                          }
                          required
                        />
                      )}
                    </td>
                    <td className="border px-2 md:px-4 py-2">
                      {item.isNew ? (
                        <span>-</span>
                      ) : (
                        <input
                          type="number"
                          className="shadow appearance-none border rounded w-full py-1 md:py-2 px-2 md:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={inputValues[item.id_leadmeasure] || ""}
                          onChange={(e) =>
                            handleInputChange(item.id_leadmeasure, e.target.value)
                          }
                          required
                        />
                      )}
                    </td>
                    <td className="border px-2 md:px-4 py-2">
                      {item.isNew ? (
                        <button
                          onClick={saveBarisBaru}
                          className="bg-blue-500 text-xs hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => updateLeadmeasure(item.id_leadmeasure)}
                          className="bg-green-500 text-xs hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leadmeasure;
