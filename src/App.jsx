import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import IndexButton from "./components/IndexButton";
import IndexPanel from "./components/IndexPanel";
import MapComponent from "./components/Map"; // Ensure the import is correct
import waterTankImage from "./images/water_tank.png";
import imagepath from "./images/Introfina.png";
import prawahImage from "./images/water-meter-new.png";
import shenitechImage from "./images/sheni-new.png";
import sumpImage from "./images/sump.png";
import boreWellImage from "./images/borewell.png";
import pipelineImage from "./images/pipeline.png";
import fetch_data from "./utils/fetch_data";
import extractData from "./utils/extract_last_array";
import ImageDisplay from "./components/ImageDisplay"; // Import the new component
import Login from "./components/Login";

const options = [
  { id: 1, label: "Water Tank", image: waterTankImage },
  { id: 2, label: "Prawah", image: prawahImage },
  { id: 3, label: "Shenitech Water Meter", image: shenitechImage },
  { id: 4, label: "Sump", image: sumpImage },
  { id: 5, label: "Bore Well", image: boreWellImage },
  { id: 6, label: "Pipeline", image: pipelineImage },
];

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = (isAuthenticated, userData) => {
    setAuthenticated(isAuthenticated);
    if (isAuthenticated) {
      console.log(userData)
    }
  };
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isNavClosing, setNavClosing]= useState(false);
  const [isNavOpening, setNavOpening]= useState(false);

  const [nodes, setNodes] = useState({ tank: [], borewell: [], water: [] });
  const [data, setData] = useState({ tank: [], borewell: [], water: [] });
  const [latestData, setLatestData] = useState({
    tank: [],
    borewell: [],
    water: [],
  });
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null); // Default bounds

  const fetchNodesData = useCallback(async () => {
    setLoading(true);
    try {
      const [tankNodes, borewellNodes, waterNodes] = await Promise.all([
        fetch_data("https://gateway-gamma-taupe.vercel.app/water/staticnodesC"),
        fetch_data("https://gateway-gamma-taupe.vercel.app/water/borewellnodesC"),
        fetch_data("https://gateway-gamma-taupe.vercel.app/water/waterC"),
      ]);

      const filterNodesByLocation = (nodes) =>
        nodes.filter((node) => node.location === "IIITH");

      const filteredTankNodes = filterNodesByLocation(tankNodes);
      const filteredBorewellNodes = filterNodesByLocation(borewellNodes);
      const filteredWaterNodes = filterNodesByLocation(waterNodes);
      setNodes({
        tank: filteredTankNodes,
        borewell: filteredBorewellNodes,
        water: filteredWaterNodes,
      });

      // Calculate extreme coordinates for setting bounds
      const allNodes = [
        ...filteredTankNodes,
        ...filteredBorewellNodes,
        ...filteredWaterNodes,
      ];
      if (allNodes.length > 0) {
        const latitudes = allNodes.map((node) =>
          Array.isArray(node.coordinates)
            ? node.coordinates[0]
            : node.coordinates.lat
        );
        const longitudes = allNodes.map((node) =>
          Array.isArray(node.coordinates)
            ? node.coordinates[1]
            : node.coordinates.lng
        );
        const maxLat = Math.max(...latitudes);
        const minLat = Math.min(...latitudes);
        const maxLng = Math.max(...longitudes);
        const minLng = Math.min(...longitudes);
        setBounds([
          [minLat, minLng],
          [maxLat, maxLng],
        ]);
      }
    } catch (error) {
      console.error("Error fetching nodes: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [tankData, borewellData, waterData] = await Promise.all([
        fetch_data("https://gateway-gamma-taupe.vercel.app/water/tankdata"),
        fetch_data("https://gateway-gamma-taupe.vercel.app/water/borewellgraphC"),
        fetch_data("https://gateway-gamma-taupe.vercel.app/water/latestwaterC"),
      ]);
      setData({
        tank: renameKeys(tankData),
        borewell: renameKeys(borewellData),
        water: renameKeys(waterData),
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }, []);

  useEffect(() => {
    fetchNodesData();
    fetchData();
  }, [fetchNodesData, fetchData]);

  useEffect(() => {
    setLatestData({
      tank: extractData(data.tank),
      borewell: extractData(data.borewell),
      water: extractData(data.water),
    });
  }, [data]);

  const renameKeys = (data) => {
    const keyMapping = {
      created_at: "Last_Updated",
      waterlevel: "Water Level", //cm
      temperature: "Temperature", //celcius
      totalvolume: "Total Volume", //m3
      flowrate: "Flow Rate", //kL/hr
      pressure: "Pressure", //centibar
      pressurevoltage: "Pressure Voltage", //centibar
      totalflow: "Total Flow", //Litres
    };

    for (const outerKey in data) {
      if (Object.hasOwnProperty.call(data, outerKey)) {
        const innerObjects = data[outerKey];
        for (const obj of innerObjects) {
          for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key) && keyMapping[key]) {
              // If the key exists in the mapping, rename it
              obj[keyMapping[key]] = obj[key];
              delete obj[key]; // Delete the old key
            }
          }
        }
      }
    }

    return data;
  };

  const toggleOption = (id) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((optionId) => optionId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleButtonClick = () => {
    setIsOpen(true);
    setIsClosing(false);
  };
  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
      setIsClosing(false);
    }
  };

  const getDropdownLabel = () => {
    if (selectedOptions.length === 0) return "All Nodes";
    if (selectedOptions.length > 1) return "Multi";
    const selectedOption = options.find(
      (option) => option.id === selectedOptions[0]
    );
    return selectedOption ? selectedOption.label : "All Nodes";
  };

  return (
    <div>
        
        <>
          <Navbar
          dropdownLabel={getDropdownLabel()}
          options={options}
          selectedOptions={selectedOptions}
          toggleOption={toggleOption}
          data={data}
          nodes={nodes}
          isNavClosing={isNavClosing}
          isNavOpening={isNavOpening}
          setNavClosing={setNavClosing}
          setNavOpening={setNavOpening}
        />
      

      <MapComponent
        selectedOptions={selectedOptions}
        location="IIITH"
        nodes={nodes}
        latestData={latestData}
        data={data}
        bounds={bounds}
        loading={loading}
        setNavClosing={setNavClosing}
        setNavOpening={setNavOpening}
      />

      <div className="fixed bottom-4 left-4 p-2 z-50">
        {!isOpen && !isClosing && (
          <IndexButton handleButtonClick={handleButtonClick} />
        )}
        <div
          className={`${
            isOpen ? (isClosing ? "closing" : "blockk") : "hiddenn"
          }`}
          onAnimationEnd={handleAnimationEnd}
        >
          {isOpen && (
            <IndexPanel
              isOpen={isOpen}
              handleClose={handleClose}
              options={options}
              selectedOptions={selectedOptions}
              toggleOption={toggleOption}
            />
          )}
        </div>
      </div>
      {!loading && (
        <div>
          <ImageDisplay imageSrc={imagepath} altText="Your Alt Text" />
        </div>
      )}
        </>
      
    </div>
  );
};

export default App;