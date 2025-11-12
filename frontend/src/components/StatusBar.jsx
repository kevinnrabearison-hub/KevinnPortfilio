import React from 'react';
import { FaTimesCircle, FaExclamationTriangle, FaBroadcastTower, FaBell } from "react-icons/fa";

const StatusBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-3 z-50 border-t-2 border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="bg-[#094771] px-2 py-[1px] rounded-sm cursor-pointer">🢐</div>
        <div className="flex items-center space-x-1">
          <FaTimesCircle className="text-red-400" />
          <span>0</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaExclamationTriangle className="text-yellow-300" />
          <span>0</span>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <span>Ln 26, Col 86</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="flex items-center space-x-1">{`{ }`} JavaScript JSX</span>
      </div>

      <div className="flex items-center space-x-3">
        <span className="flex items-center space-x-1">
          <FaBroadcastTower />
          <span>Go Live</span>
        </span>
        <span>Prettier</span>
        <FaBell />
      </div>
    </div>
  );
};

export default StatusBar;
