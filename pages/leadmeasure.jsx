import React, { useState, useEffect } from "react";
import Select from "react-select";

const Leadmeasure = () => {
  const [wigOptions, setWigOptions] = useState([]);
  const [selectedWig, setSelectedWig] = useState(null);
  const [divisi, setDivisi] = useState(null);
  const [id_devisi, setid_devisi] = useState(null);
  const [leadmeasure, setLeadMeasure] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [dateValues, setDateValues] = useState({});

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-4 md:p-8 rounded shadow-md w-full lg:w-3/4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 underline">
              Input Lead Measure
            </h2>
          </div>
          <div>
            {divisi && (
              <p className="text-gray-700 mb-4 font-bold">Divisi: {divisi}</p>
            )}
          </div>
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
