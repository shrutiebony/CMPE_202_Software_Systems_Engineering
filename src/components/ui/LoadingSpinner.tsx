function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 animate-spin"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;