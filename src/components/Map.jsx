import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import createCustomIcon from '../utils/createCustomIcon';
import fetch_data from '../utils/fetch_data';
import extractData from '../utils/extract_last_array';
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

const MapComponent = ({ selectedOptions }) => {
  const [nodes, setNodes] = useState({ tank: [], borewell: [], water: [] });
  const [data, setData] = useState({ tank: [], borewell: [], water: [] });
  const [latestData, setLatestData] = useState({ tank: [], borewell: [], water: [] });

  const [selectedNode, setSelectedNode] = useState({ data: null, type: null, attributes: [], isAnalog: false });
  const [loading, setLoading] = useState(true);

  const fetchNodesData = useCallback(async () => {
    setLoading(true);
    try {
      const [tankNodes, borewellNodes, waterNodes] = await Promise.all([
        fetch_data('https://api-gateway-green.vercel.app/water/staticnodesC'),
        fetch_data('https://api-gateway-green.vercel.app/water/borewellnodesC'),
        fetch_data('https://api-gateway-green.vercel.app/water/waterC')
      ]);
      setNodes({ tank: tankNodes, borewell: borewellNodes, water: waterNodes });
    } catch (error) {
      console.error("Error fetching nodes: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [tankData, borewellData, waterData] = await Promise.all([
        fetch_data('https://api-gateway-green.vercel.app/water/tankdata'),
        fetch_data('https://api-gateway-green.vercel.app/water/borewellgraphC'),
        fetch_data('https://api-gateway-green.vercel.app/water/latestwaterC')
      ]);
      setData({ tank: tankData, borewell: borewellData, water: waterData });
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
      water: extractData(data.water)
    });
  }, [data]);

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
      
      const attributes = !isAnalog
        ? Object.keys(nodeData[0]).filter(key => key !== 'created_at')
        : Object.keys(nodeData[0]).filter(key => key !== 'created_at' && key !== 'pressure' && key !== 'pressurevoltage');
      
      setSelectedNode({
        data: nodeData,
        type: nodeType,
        attributes: attributes,
        isAnalog: isAnalog
      });
    } else {
      setSelectedNode({
        data: nodeData,
        type: nodeType,
        attributes: Object.keys(nodeData[0]).filter(key => key !== 'created_at'),
        isAnalog: false
      });
    }
  };
  

  const closeModal = () => setSelectedNode({ data: null, type: null, attributes: [], isAnalog: false });

  const NodeMarker = ({ node, icon, icon_inactive, data, nodeType }) => {
    const coordinates = Array.isArray(node.coordinates) ? node.coordinates : [node.coordinates.lat, node.coordinates.lng];
    const isActiveNode = isActive(data?.created_at);
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
                <span>{`${key.charAt(0).toUpperCase()}${key.slice(1)}`}: </span>
                <span>{value}</span>
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
        <div className="flex justify-center items-center h-full"><div className="loader"></div></div>
      ) : (
        <MapContainer
          className="w-full h-full z-10"
          center={[17.445678, 78.3477]}
          zoom={17}
          maxZoom={19}
          minZoom={17}
          maxBounds={[[17.439458106, 78.33680439], [17.4504764568, 78.35945215954]]}
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
        <Modal onClose={closeModal}>
          <NodeGraph data={selectedNode.data} attributes={selectedNode.attributes} nodeType={selectedNode.type} />
        </Modal>
      )}




    </div>
  );
};

export default MapComponent;
