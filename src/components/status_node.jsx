import React, { useState, useEffect } from "react";
import DataFetcher from "./DataFetcher";
import NodeGraph from "./Nodegraph";
import Modal from "./Modal";

const tabs = ["AllNodes", "WaterMeter", "WaterTank", "Borewell"];

const StatusNode = ({ onClose, data, nodes, setNavOpening, setNavClosing }) => {
  const [activeTab, setActiveTab] = useState("AllNodes");
  const [filter, setFilter] = useState("All");
  const [isClosing, setIsClosing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedDetail, setSelectedDetail] = useState({
    data: null,
    type: null,
    attributes: [],
    isAnalog: false,
    name: null,
    analogOrDigital: null,
  });
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isDataFetcherVisible, setIsDataFetcherVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !selectedDetail.data) {
        handleClose();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDetail.data]);

  useEffect(() => {
    if (!isClosing) {
      setIsAnimationComplete(false);
      const timer = setTimeout(() => {
        setIsAnimationComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleClose = () => {
    setIsDataFetcherVisible(false);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsDataFetcherVisible(true);
    }, 1200);
  };

  const handleModalClose = () => {
    setSelectedDetail({
      data: null,
      type: null,
      attributes: [],
      isAnalog: false,
      name: null,
      analogOrDigital: null,
    });
    setNavOpening(true);
    setNavClosing(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`h-max maincss p-6 rounded-lg shadow-lg relative w-3/4 overflow-hidden ${
          isClosing ? "genie-out" : "genie-in"
        }`}
      >
        <button
          className="absolute top-7 right-5 text-cyan-950 hover:text-cyan-700"
          onClick={handleClose}
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
          <div className="flex justify-center flex-grow ">
            {isMobile ? (
              <div className="relative">
                <button
                  className="px-2 flex items-center gap-2 py-2 font-semibold bg-white bg-opacity-50 backdrop-filter backdrop-blur-md rounded-md text-cyan-800 border-none focus:outline-none hover:bg-white hover-bg-opacity-10"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {activeTab.replace(/([A-Z])/g, " $1").trim()}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      stroke="rgb(0, 131, 143)"
                      strokeWidth="1"
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-auto bg-white border border-gray-300 rounded-md shadow-lg mt-2 z-10">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        className={`block w-full text-left px-5 py-2 whitespace-nowrap${
                          activeTab === tab
                            ? "text-cyan-900 font-bold  hover:bg-gray-200"
                            : "transition font-semibold duration-50 ease-in-out text-cyan-900 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          setActiveTab(tab);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {tab.replace(/([A-Z])/g, " $1").trim()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-5 py-2 mx-2${
                    activeTab === tab
                      ? "border-pink-800 text-cyan-950 font-bold"
                      : "transition font-semibold duration-50 ease-in-out text-zinc-600 hover:border-b-2 hover:border-zinc-800 hover:text-black"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.replace(/([A-Z])/g, " $1").trim()}
                </button>
              ))
            )}
          </div>
          <div className="ml-auto mr-4 hover:bg-white hover-bg-opacity-10 rounded-md">
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
        <div className="overflow-y-auto h-4/5 bg-transparent rounded p-4 datafetcher">
          {isAnimationComplete && isDataFetcherVisible && (
            <DataFetcher
              activeTab={activeTab}
              filter={filter}
              allNodes={data}
              nodes={nodes}
              setSelectedDetail={setSelectedDetail}
              setNavClosing={setNavClosing}
              setNavOpening={setNavOpening}
            />
          )}
        </div>
      </div>

      {selectedDetail.data && (
        <Modal onClose={handleModalClose}>
          <NodeGraph
            data={selectedDetail.data}
            attributes={selectedDetail.attributes}
            nodeType={selectedDetail.type}
            analogOrDigital={selectedDetail.analogOrDigital}
            allData={data}
            nodeName={selectedDetail.name}
          />
        </Modal>
      )}
    </div>
  );
};

export default StatusNode;