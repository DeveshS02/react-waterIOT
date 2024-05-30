import React, { useState } from "react";
import DataFetcher from "./DataFetcher";
import ContentDisplay from "./ContentDisplay";

const tabs = ["AllNodes", "WaterMeter", "WaterTank", "Borewell"];

const StatusNode = ({ onClose, data }) => {
  const [activeTab, setActiveTab] = useState("AllNodes");
  const [filter, setFilter] = useState("All");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="h-max maincss p-6 rounded-lg shadow-lg relative w-3/4 overflow-hidden">
        <button
          className="absolute top-7 right-5 text-cyan-950 hover:text-cyan-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg> 
        </button>
        <h1 className="text-cyan-950 text-3xl font-bold mb-5 text-center">
          Status of Nodes
        </h1>
        <div className="flex items-center mb-2 text-lg">
          <div className="flex justify-center flex-grow mb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-5 py-2 mx-2${
                  activeTab === tab
                    ? "border-pink-800 text-cyan-950 font-bold"
                    : "transition font-semibold duration-50 ease-in-out text-zinc-600 hover:border-b-2 hover:border-zinc-800  hover:text-black"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>
          <div className="ml-auto mr-4">
            <select
              className="font-semibold px-1 py-2 bg-white bg-opacity-50 backdrop-filter backdrop-blur-md rounded-md text-cyan-800 border-none focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="overflow-y-auto h-4/5 bg-transparent rounded p-4">
          <DataFetcher activeTab={activeTab} filter={filter} allNodes={data} />
        </div>
      </div>
    </div>
  );
};

export default StatusNode;