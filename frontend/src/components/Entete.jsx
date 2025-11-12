import React from 'react';
import {
  FaThLarge,
  FaColumns,
  FaGripLines,
  FaBorderAll,
} from 'react-icons/fa';
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeClose,
} from 'react-icons/vsc';

const Entete = () => {
  return (
    <header className="flex items-center justify-between bg-background h-12 px-2 text-white border-b border-gray-700 w-full overflow-x-auto">
      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
        <img src="/logo/vscode.svg" alt="Logo VSCode" className="w-5 h-5" />
        <span className="cursor-pointer hover:underline hidden sm:inline">File</span>
        <span className="cursor-pointer hover:underline hidden sm:inline">Edit</span>
        <span className="cursor-pointer hover:underline hidden sm:inline">Selection</span>
        <span className="cursor-pointer hover:underline hidden sm:inline">View</span>
        <span className="cursor-pointer hover:underline hidden sm:inline">…</span>
      </div>

      <div className="flex-grow max-w-[200px] sm:max-w-md mx-2 sm:mx-4">
        <input
          type="text"
          placeholder="🔍 Portfolio(vscode)"
          className="w-full px-3 py-1 rounded-md bg-[#2c2c2c] text-white placeholder-gray-400 text-sm text-center outline-none focus:border-blue-500 border border-gray-700"
        />
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden md:flex items-center space-x-2 sm:space-x-3 text-text">
          <FaThLarge className="cursor-pointer hover:bg-gray-500 p-1 rounded" />
          <FaColumns className="cursor-pointer hover:bg-gray-500 p-1 rounded" />
          <FaGripLines className="cursor-pointer hover:bg-gray-500 p-1 rounded" />
          <FaBorderAll className="cursor-pointer hover:bg-gray-500 p-1 rounded" />
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 text-lg sm:text-2xl">
          <VscChromeMinimize className="hover:bg-gray-600 p-1 rounded cursor-pointer" />
          <VscChromeMaximize className="hover:bg-gray-600 p-1 rounded cursor-pointer" />
          <VscChromeClose className="hover:bg-red-600 p-1 rounded cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Entete;
