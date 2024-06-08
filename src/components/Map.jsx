import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import createCustomIcon from '../utils/createCustomIcon';
import NodeGraph from './Nodegraph';  
import Modal from './Modal';  
import icon_bore from '../images/borewell.png';
import icon_waternode from '../images/water-meter-new.png';
import icon_tanker from '../images/water_tank.png';
import icon_bore_inactive from '../images/not_borewell.png';
import icon_waternode_inactive from '../images/not-water-meter-new.png';
import icon_tanker_inactive from '../images/not_watertank.png';
import icon_waternode_digital from '../images/sheni-new.png';
import icon_waternode_digital_inactive from '../images/not-sheni-new.png';
import image2 from "../images/hydrowfinal.png";

const MapComponent = ({ selectedOptions, nodes, latestData, data, bounds, loading, setNavClosing, setNavOpening, filteredNames }) => {
  const [selectedNode, setSelectedNode] = useState({ data: null, type: null, attributes: [], isAnalog: false, name: null, analogOrDigital: null });
  const [filteredData, setFilteredData] = useState({tank: [], borewell: [], water: []})
  const iconConfig = {
    tank: [createCustomIcon(icon_tanker), createCustomIcon(icon_tanker_inactive)],
    borewell: [createCustomIcon(icon_bore), createCustomIcon(icon_bore_inactive)],
    water: [createCustomIcon(icon_waternode), createCustomIcon(icon_waternode_inactive)],
    water_digital: [createCustomIcon(icon_waternode_digital), createCustomIcon(icon_waternode_digital_inactive)]
  };

  const isActive = (createdAt) => (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 2;

  const shouldDisplayNode = (node, type) => {
    if (selectedOptions.length === 0) return true;
    const optionMap = { tank: 1, borewell: 5, water: node.parameters.includes('isanalog') ? 2 : 3 };
    return selectedOptions.includes(optionMap[type]);
  };

  const developWalls = () => (
    <Polyline positions={[[17.44431215246116, 78.34421333959695], [17.448959007851123, 78.3484512379919], [17.444986217014176, 78.35261351452294], [17.444150848626073, 78.35110228147538], [17.441949414491706, 78.34974490029627], [17.44431215246116, 78.34421333959695]]} color="black" weight={3} opacity={0.8}>
      <Tooltip sticky><b>IIIT Hyderabad Bounds</b></Tooltip>
    </Polyline>
  );

  const handleNodeClick = (nodeType, nodeName) => {
    const nodeData = data[nodeType][nodeName];
    if (nodeType === 'water') {
      const node = nodes.water.find(node => node.name === nodeName);
      const isAnalog = node?.parameters.includes('isanalog');
      const analogOrDigital = isAnalog ? 'analog' : 'digital';
      const attributes = !isAnalog
        ? Object.keys(nodeData[0]).filter(key => key !== 'Last_Updated')
        : Object.keys(nodeData[0]).filter(key => key !== 'Last_Updated' && key !== 'Pressure' && key !== 'Pressure Voltage');
      
      setSelectedNode({
        data: nodeData,
        type: nodeType,
        attributes: attributes,
        isAnalog: isAnalog,
        name: nodeName,
        analogOrDigital: analogOrDigital
      });
    } else {
      setSelectedNode({
        data: nodeData,
        type: nodeType,
        attributes: Object.keys(nodeData[0]).filter(key => key !== 'Last_Updated'),
        isAnalog: false,
        name: nodeName,
        analogOrDigital: null
      });
    }
    setNavClosing(true);
    setNavOpening(false);
  };

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

  const handleModalClose = () => {
    setSelectedNode({ data: null, type: null, attributes: [], isAnalog: false, name: null, analogOrDigital: null });
    setNavOpening(true);
    setNavClosing(false);
  };

  const getUnit = (key) => {
    const unitMapping = {
      "Water Level": "cm",
      "Temperature": "°C",
      "Total Volume": "m³",
      "Flow Rate": "kL/hr",
      "Pressure": "cbar",
      "Pressure Voltage": "cbar",
      "Total Flow": "Litres"
    };
    return unitMapping[key] || "";
  };

  const NodeMarker = ({ node, icon, icon_inactive, data, nodeType }) => {
    const coordinates = Array.isArray(node.coordinates) ? node.coordinates : [node.coordinates.lat, node.coordinates.lng];
    const isActiveNode = isActive(data?.Last_Updated);
    return (
      <Marker
        position={coordinates}
        icon={isActiveNode ? icon : icon_inactive}
        eventHandlers={{ click: () => handleNodeClick(nodeType, node.name) }}
      >
        <Tooltip direction="bottom" offset={[0, -10]} opacity={1}>
          <div className="bg-white text-black-300">
            <strong className="font-bold text-md italic">{node.name}</strong><br />
            {data ? Object.entries(data).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span>{key}: </span>
                <span>{value} {getUnit(key)}</span> {/* Add units */}
              </div>
            )) : (
              <span className="text-sm">No data available</span>
            )}
          </div>
        </Tooltip>
      </Marker>
    );
  };

  return (
    <div className="w-[100vw] h-[100vh]">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col justify-center items-center">
            <img src={image2} alt="hydrow Logo" className="h-28  mb-14" />
            <div className="loader"></div>
          </div>
        </div>
      ) : (
        <MapContainer
          className="w-full h-full z-10"
          bounds={bounds} // Set bounds dynamically
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {developWalls()}
          {nodes.tank.filter(node => shouldDisplayNode(node, 'tank')).map((node, index) => (
            <NodeMarker key={index} node={node} icon={iconConfig.tank[0]} icon_inactive={iconConfig.tank[1]} data={latestData.tank[node.name]} nodeType="tank" />
          ))}
          {nodes.borewell.filter(node => shouldDisplayNode(node, 'borewell')).map((node, index) => (
            <NodeMarker key={index} node={node} icon={iconConfig.borewell[0]} icon_inactive={iconConfig.borewell[1]} data={latestData.borewell[node.name]} nodeType="borewell" />
          ))}
          {nodes.water.filter(node => shouldDisplayNode(node, 'water')).map((node, index) => (
            <NodeMarker key={index} node={node} icon={node.parameters.includes('isanalog') ? iconConfig.water[0] : iconConfig.water_digital[0]} icon_inactive={node.parameters.includes('isanalog') ? iconConfig.water[1] : iconConfig.water_digital[1]} data={latestData.water[node.name]} nodeType="water" />
          ))}
        </MapContainer>
      )}

      {selectedNode.data && (
        <Modal onClose={handleModalClose}>
          <NodeGraph 
            data={selectedNode.data} 
            attributes={selectedNode.attributes} 
            nodeType={selectedNode.type} 
            analogOrDigital={selectedNode.analogOrDigital} 
            allData={filteredData} 
            nodeName={selectedNode.name} />
        </Modal>
      )}
    </div>
  );
};

export default MapComponent;
