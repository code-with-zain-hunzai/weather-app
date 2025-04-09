export default function LoadingSpinner() {
    return (
      <div className="text-center py-8">
        <div className="spinner animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading weather data...</p>
      </div>
    );
  }