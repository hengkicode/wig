import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    orange: 'border-orange-500',
    gray: 'border-gray-500',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

const LoadingOverlay = ({ message = 'Loading...', transparent = false }) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${transparent ? 'bg-white/50' : 'bg-white/80'} backdrop-blur-sm`}>
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" color="blue" />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

const LoadingButton = ({ loading, children, disabled, className = '', ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`flex items-center justify-center space-x-2 ${className} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading && <LoadingSpinner size="sm" color="white" />}
      <span>{children}</span>
    </button>
  );
};

const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export { LoadingSpinner, LoadingOverlay, LoadingButton, LoadingCard };
export default LoadingSpinner;