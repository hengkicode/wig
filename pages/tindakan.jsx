import React from 'react';
import { useRouter } from 'next/router';

const Tindakan = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Selamat Datang</h1>
            <div className="flex space-x-4">
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => router.push('/leadmeasure')}
                >
                    Lead Measure
                </button>
                <button 
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    onClick={() => router.push('/dashboard')}
                >
                    Dashboard
                </button>
            </div>
        </div>
    );
};

export default Tindakan;