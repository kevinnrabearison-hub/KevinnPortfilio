import React from 'react';
import { FaTimesCircle, FaExclamationTriangle, FaBroadcastTower, FaBell } from "react-icons/fa";

const StatusBar = () => {
  return (
    <div className="w-full h-6 bg-vscode-statusbar text-white text-xs flex items-center justify-between px-2 border-t border-vscode-border">
      <div className="flex items-center">
        <div className="px-2 py-[1px] rounded-sm cursor-pointer hover:bg-vscode-statusbarHover">🢐</div>
        <div className="flex items-center space-x-1 px-2 py-[1px] rounded-sm hover:bg-vscode-statusbarHover cursor-pointer">
          <FaTimesCircle className="text-red-400" />
          <span>0</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-[1px] rounded-sm hover:bg-vscode-statusbarHover cursor-pointer">
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

      <div className="flex items-center">
        <span className="flex items-center space-x-1 px-2 py-[1px] rounded-sm hover:bg-vscode-statusbarHover cursor-pointer">
          <FaBroadcastTower />
          <span>Go Live</span>
        </span>
        <span className="px-2 py-[1px] rounded-sm hover:bg-vscode-statusbarHover cursor-pointer">Prettier</span>
        <span className="px-2 py-[1px] rounded-sm hover:bg-vscode-statusbarHover cursor-pointer">
          <FaBell />
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
