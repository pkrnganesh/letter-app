// src/components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="w-8 h-8 border-4 border-white border-t-orange-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
