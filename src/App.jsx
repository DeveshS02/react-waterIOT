import React, { useState, useEffect, useCallback, useRef } from "react";
import { parse, isBefore, format } from 'date-fns';
import Navbar from "./components/Navbar";
import IndexButton from "./components/IndexButton";
import IndexPanel from "./components/IndexPanel";
import MapComponent from "./components/Map"; // Ensure the import is correct
import waterTankImage from "./images/water_tank.png";
import prawahImage from "./images/water-meter-new.png";
import shenitechImage from "./images/sheni-new.png";
import sumpImage from "./images/sump.png";
import boreWellImage from "./images/borewell.png";
import pipelineImage from "./images/pipeline.png";
import fetch_data from "./utils/fetch_data";
import WelcomeContainer from "./components/Welcommodal";
import TooltipContainer from "./components/tooltipstatus";
import Tooltipindex from "./components/tooltipindex";

const options = [
  { id: 1, label: "Water Tank", image: waterTankImage },
  { id: 2, label: "Prawah", image: prawahImage },
  { id: 3, label: "Shenitech Water Meter", image: shenitechImage },
  { id: 4, label: "Sump", image: sumpImage },
  { id: 5, label: "Bore Well", image: boreWellImage },
  { id: 6, label: "Pipeline", image: pipelineImage },
];

const App = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isNavClosing, setNavClosing]= useState(false);
  const [isNavOpening, setNavOpening]= useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const statusButtonRef = useRef(null);
  const indexButtonRef = useRef(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  const [nodes, setNodes] = useState({ tank: [], borewell: [], water: [] });
  const [data, setData] = useState({ tank: [], borewell: [], water: [] });
  const [hoverData, setHoverData] = useState({ tank: [], borewell: [], water: [] });
  const [filteredNames, setFilteredNames] = useState({ tank: [], borewell: [], water: [] });
  const [filteredData, setFilteredData] = useState({ tank: [], borewell: [], water: [] });
  const [mergedData, setMergedData] = useState({});

  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null); // Default bounds

  const fetchNodesData = useCallback(async () => {
    setLoading(true);
    try {
      const [tankNodes, borewellNodes, waterNodes] = await Promise.all([
        fetch_data("https://backtest-ds7q.onrender.com/water/staticnodesC"),
        fetch_data("https://backtest-ds7q.onrender.com/water/borewellnodesC"),
        fetch_data("https://backtest-ds7q.onrender.com/water/waterC"),
      ]);

      const [tankHoverData, borewellHoverData, waterHoverData] = await Promise.all([
        fetch_data("https://backtest-ds7q.onrender.com/water/tankerdata"),
        fetch_data("https://backtest-ds7q.onrender.com/water/borewelldata"),
        fetch_data("https://backtest-ds7q.onrender.com/water/waterminutesdatas"),
      ]);

      let temp= { tank: tankHoverData, borewell: borewellHoverData, water: waterHoverData,}
      temp= cleanData(temp);

      setHoverData({
        tank: temp.tank,
        borewell: temp.borewell,
        water: temp.water,
      });

      const filterNodesByLocation = (nodes) =>
        nodes.filter((node) => node.location === 'IIITH');

      const filteredTankNodes = filterNodesByLocation(tankNodes);
      const filteredBorewellNodes = filterNodesByLocation(borewellNodes);
      const filteredWaterNodes = filterNodesByLocation(waterNodes);
      setNodes({
        tank: filteredTankNodes,
        borewell: filteredBorewellNodes,
        water: filteredWaterNodes,
      });

      // Store names of filtered nodes
      const filteredTankNames = filteredTankNodes.map(node => node.name);
      const filteredBorewellNames = filteredBorewellNodes.map(node => node.name);
      const filteredWaterNames = filteredWaterNodes.map(node => node.name);

      setFilteredNames({
        tank: filteredTankNames,
        borewell: filteredBorewellNames,
        water: filteredWaterNames,
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
        fetch_data("https://backtest-ds7q.onrender.com/water/tankdata"),
        fetch_data("https://backtest-ds7q.onrender.com/water/borewellgraphC"),
        fetch_data("https://backtest-ds7q.onrender.com/water/latestwaterC"),
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
  }, []);

  function cleanData(data) {
    const propertyMapping = {
      created_at: "Last_Updated",
      water_level: "Water Level",
      temp: "Temperature",
      curr_volume: "Total Volume",
      flowrate: "Flow Rate",
      pressure: "Pressure",
      pressurevoltage: "Pressure Voltage",
      totalflow: "Total Flow",
    };
  
    function cleanNode(node) {
      let cleanedNode = {};
  
      for (let key in node) {
        if (propertyMapping.hasOwnProperty(key)) {
          cleanedNode[propertyMapping[key]] = node[key];
        }
      }
  
      return cleanedNode;
    }
  
    function cleanCategory(category) {
      let cleanedCategory = {};
  
      for (let key in category) {
        cleanedCategory[key] = cleanNode(category[key]);
      }
  
      return cleanedCategory;
    }
  
    let cleanedData = {};
  
    for (let category in data) {
      cleanedData[category] = cleanCategory(data[category]);
    }
  
    return cleanedData;
  }

  const merger = (data1, data2) => {
    for (const nodeType in data1) {
      for (const node in data1[nodeType]) {
        const latestEntryData1 = data1[nodeType][node][data1[nodeType][node].length - 1];
        const entryData2 = data2[nodeType][node];
  
        // Define the date formats
        const formatData1 = 'MM/dd/yyyy, HH:mm:ss';
        const formatData2 = 'dd-MM-yyyy HH:mm:ss';
        
        if(latestEntryData1 && entryData2){
          
          const latestCreatedAtData1 = parse(latestEntryData1.Last_Updated, formatData1, new Date());
          const createdAtData2 = parse(entryData2.Last_Updated, formatData2, new Date());
          
          if (isBefore(latestCreatedAtData1, createdAtData2)) {
            entryData2.Last_Updated = format(createdAtData2, formatData1);
            data1[nodeType][node].push(entryData2);
          }
        }
        
      }
    }
  
    return data1;
  }

  useEffect(() => {
    setMergedData(merger(data, hoverData));
  }, [data, hoverData]);

  const filterDataByNames = (data, names) =>
    Object.keys(data)
      .filter((key) => names.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  
  const filteredTankData = filterDataByNames(data['tank'], filteredNames['tank']);
  const filteredBorewellData = filterDataByNames(data['borewell'], filteredNames['borewell']);
  const filteredWaterData = filterDataByNames(data['water'], filteredNames['water']);
  
  useEffect(() => {
    setFilteredData({
      tank: filteredTankData,
      borewell: filteredBorewellData,
      water: filteredWaterData,
    });
  }, [nodes, data]);


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
  const handleCloseContainers = useCallback(() => {
    setShowTooltip(false);
    setIsWelcomeOpen(false);
  }, []);

  return (
    <div>
        
        <>
          <Navbar
          dropdownLabel={getDropdownLabel()}
          options={options}
          selectedOptions={selectedOptions}
          toggleOption={toggleOption}
          data={filteredData}
          nodes={nodes}
          isNavClosing={isNavClosing}
          isNavOpening={isNavOpening}
          setNavClosing={setNavClosing}
          setNavOpening={setNavOpening}
          statusButtonRef={statusButtonRef}
        />
      

      <MapComponent
        selectedOptions={selectedOptions}
        nodes={nodes}
        data={filteredData}
        bounds={bounds}
        loading={loading}
        setNavClosing={setNavClosing}
        setNavOpening={setNavOpening}
        hoverData={hoverData}
      />

      <div className="fixed bottom-4 left-4 p-2 z-50">
        {!isOpen && !isClosing && (
          <IndexButton handleButtonClick={handleButtonClick} indexButtonRef={indexButtonRef}/>
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
          <WelcomeContainer
            isOpen={isWelcomeOpen}
            onClose={handleCloseContainers}
          />
          <TooltipContainer
            isVisible={showTooltip}
            targetRef={statusButtonRef}
            onClose={handleCloseContainers}
          />
          <Tooltipindex
            isVisible={showTooltip}
            targetRef={indexButtonRef}
            onClose={handleCloseContainers}
          />
       </div>
        )}
        </>
      
    </div>
  );
};

export default App;