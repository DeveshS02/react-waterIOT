import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import createCustomIcon from '../utils/createCustomIcon';
import icon_bore from '../images/borewell.png';
import icon_waternode from '../images/water-meter-new.png';
import icon_tanker from '../images/water_tank.png';
import icon_bore_inactive from '../images/not_borewell.png';
import icon_waternode_inactive from '../images/not-water-meter-new.png';
import icon_tanker_inactive from '../images/not_watertank.png';
import icon_waternode_digital from '../images/sheni-new.png';
import icon_waternode_digital_inactive from '../images/not-sheni-new.png';
import fetch_data from '../utils/fetch_data';
import extractData from '../utils/extract_last_array';

const MapComponent = ({ selectedOptions }) => {
  const [Tank_nodes, setTank_nodes] = useState([]);
  const [Borewell_nodes, setBorewell_nodes] = useState([]);
  const [Water_nodes, setWater_nodes] = useState([]);

  const [Tank_data, setTank_data] = useState([]);
  const [Borewell_data, setBorewell_data] = useState([]);
  const [Water_data, setWater_data] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [data1, data2, data3] = await Promise.all([
        fetch_data('https://spcrc.iiit.ac.in/water/staticnodesC/'),
        fetch_data('http://localhost:3000/borewell/coordinates'),
        fetch_data('http://localhost:3000/watermeter/coordinates')
      ]);

      setTank_nodes(data1);
      setBorewell_nodes(data2);
      setWater_nodes(data3);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [data1, data2, data3] = await Promise.all([
        fetch_data('http://localhost:3000/tank/graph'),
        fetch_data('http://localhost:3000/borewell/graph'),
        fetch_data('http://localhost:3000/watermeter/graph')
      ]);

      setTank_data(data1);
      setBorewell_data(data2);
      setWater_data(data3);
    };

    fetchData();
  }, []);

  const Tank_latest_data = extractData(Tank_data);
  const Borewell_latest_data = extractData(Borewell_data);
  const Water_latest_data = extractData(Water_data);

  const icon_tank = createCustomIcon(icon_tanker);
  const icon_borewell = createCustomIcon(icon_bore);
  const icon_water = createCustomIcon(icon_waternode);
  const icon_water_digital = createCustomIcon(icon_waternode_digital);

  const icon_tank_inactive = createCustomIcon(icon_tanker_inactive);
  const icon_borewell_inactive = createCustomIcon(icon_bore_inactive);
  const icon_water_inactive = createCustomIcon(icon_waternode_inactive);
  const icon_water_digital_inactive = createCustomIcon(icon_waternode_digital_inactive);

  // Determine the active state of each node
  const isActive = (createdAt) => {
    const currTime = new Date();
    const diff = (currTime - new Date(createdAt)) / (1000 * 60 * 60 * 24);
    return diff <= 2;
  };

  // Function to check if a node should be displayed based on selected options
  const shouldDisplayNode = (node, type) => {
    if (selectedOptions.length === 0) return true; // Show all nodes if no filter is applied
    if (type === 'tank' && selectedOptions.includes(1)) return true;
    if (type === 'borewell' && selectedOptions.includes(5)) return true;
    if (type === 'water' && selectedOptions.includes(node.parameters.includes('isanalog') ? 2 : 3)) return true;
    return false;
  };

  //Function to display walls of IIIT-H
  const developWalls = () => {
    const wall1 = [
      [17.44431215246116, 78.34421333959695],
      [17.448959007851123, 78.3484512379919],
      [17.444986217014176, 78.35261351452294],
      [17.444150848626073, 78.35110228147538],
      [17.441949414491706, 78.34974490029627],
      [17.44431215246116, 78.34421333959695]
    ];
    return (
      <Polyline positions={wall1} color="black" weight={3} opacity={0.8}>
        <Tooltip sticky>
          <b>IIIT Hyderabad Bounds</b>
        </Tooltip>
      </Polyline>
    );
  };

  return (
    <div className="w-[100vw] h-[100vh]">
      <MapContainer
        className="w-full h-full z-10"
        center={[17.445678, 78.3477]}
        zoom={17}
        maxZoom={19}
        minZoom={17}
        maxBounds={[
          [17.439458106, 78.33680439],
          [17.4504764568, 78.35945215954]
        ]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {developWalls()}

        {Tank_nodes.filter(node => shouldDisplayNode(node, 'tank')).map((node, index) => {
          const coordinates = Array.isArray(node.coordinates)
            ? node.coordinates
            : [node.coordinates.lat, node.coordinates.lng];
          const tankData = Tank_latest_data[node.name];
          const isActiveNode = isActive(tankData?.created_at);
          return (
            <Marker key={index} position={coordinates} icon={isActiveNode ? icon_tank : icon_tank_inactive}>
              <Tooltip direction="bottom" offset={[0, -10]} opacity={1}>
                <div className="bg-white text-black-300">
                  <strong className="font-bold text-md italic">{node.name}</strong><br />
                  {tankData ? (
                    Object.entries(tankData).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span>{`${key.charAt(0).toUpperCase()}${key.slice(1)}`}: </span>
                        <span>{value}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm">No data available</span>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {Borewell_nodes.filter(node => shouldDisplayNode(node, 'borewell')).map((node, index) => {
          const coordinates = Array.isArray(node.coordinates)
            ? node.coordinates
            : [node.coordinates.lat, node.coordinates.lng];
          const borewellData = Borewell_latest_data[node.name];
          const isActiveNode = isActive(borewellData?.created_at);
          return (
            <Marker key={index} position={coordinates} icon={isActiveNode ? icon_borewell : icon_borewell_inactive}>
              <Tooltip direction="bottom" offset={[0, -10]} opacity={1}>
                <div className="bg-white text-black-300">
                  <strong className="font-bold text-md italic">{node.name}</strong><br />
                  {borewellData ? (
                    Object.entries(borewellData).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span>{`${key.charAt(0).toUpperCase()}${key.slice(1)}`}: </span>
                        <span>{value}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm">No data available</span>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {Water_nodes.filter(node => shouldDisplayNode(node, 'water')).map((node, index) => {
          const coordinates = Array.isArray(node.coordinates)
            ? node.coordinates
            : [node.coordinates.lat, node.coordinates.lng];
          const waterData = Water_latest_data[node.name];
          const isActiveNode = isActive(waterData?.created_at);
          const icon = node.parameters.includes('isanalog') ? (isActiveNode ? icon_water : icon_water_inactive) : (isActiveNode ? icon_water_digital : icon_water_digital_inactive);
          return (
            <Marker key={index} position={coordinates} icon={icon}>
              <Tooltip direction="bottom" offset={[0, -10]} opacity={1}>
                <div className="bg-white text-black-300">
                  <strong className="font-bold text-md italic">{node.name}</strong><br />
                  {waterData ? (
                    Object.entries(waterData).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span>{`${key.charAt(0).toUpperCase()}${key.slice(1)}`}: </span>
                        <span>{value}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm">No data available</span>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
