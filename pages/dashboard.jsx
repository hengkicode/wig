import React from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="mb-4">Welcome to the dashboard!</p>
                <button 
                    onClick={handleBack} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default Dashboard;