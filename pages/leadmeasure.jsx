import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/router";

const Leadmeasure = () => {
  const router = useRouter();
  const [wigOptions, setWigOptions] = useState([]);
  const [selectedWig, setSelectedWig] = useState(null);
  const [divisi, setDivisi] = useState(null);
  const [id_devisi, setid_devisi] = useState(null);
  const [leadmeasure, setLeadMeasure] = useState([]);
  const [inputan, setInputan] = useState(null);

  // Fetch data from API
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

    console.log(id_devisi);

    const fetchWigOptions = async () => {
      try {
        const response = await fetch(
          `http://202.58.199.194:8080/api-appit/public/wig/getwig/${id_devisi}`
        );
        const data = await response.json();

        // Map data to options for React Select
        const options = Array.isArray(data.data)
          ? data.data.map((item) => ({
              value: item.id_wig, // Adjust based on API response field
              label: item.wig, // Adjust based on API response field
            }))
          : [];

        setWigOptions(options);
      } catch (error) {
        console.error("Error fetching WIG options:", error);
      }
    };

    fetchWigOptions();
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
      setLeadMeasure(data.data || []);
    } catch (error) {
      console.error("Error fetching lead measure:", error);
    }
  };

  const updateLeadmeasure = async () => {
    if (!selectedWig) {
      console.error("Selected WIG is not set.");
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
            actual_input: inputan,
          }),
        }
      );
      const data = await response.json();
      alert(data.message);
      getLeadMeasure();
    } catch (error) {
      console.error("Error fetching lead measure:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full lg:w-1/2 p-2 m-2">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 underline">
              Input Lead Measure
            </h2>
          </div>
          <div>
            {divisi && ( // Render divisi if available
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
            List Lead Measure <br></br>
            {selectedWig ? `(${selectedWig.label})` : ""}
          </label>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Lead Measure</th>
                <th className="px-4 py-2">Sisa Target</th>
                <th className="px-4 py-2">Rill Target</th>
                <th className="px-4 py-2">Input Actual</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {leadmeasure &&
                leadmeasure.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.leadmeasure}</td>
                    <td className="border px-4 py-2">{item.sisa_target}</td>
                    <td className="border px-4 py-2">{item.rill_target}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={inputan}
                        onChange={(e) => setInputan(e.target.value)}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2">
                        Hapus
                      </button>
                      <button
                        onClick={updateLeadmeasure}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Kirim
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            className="font-xs mx-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leadmeasure;
