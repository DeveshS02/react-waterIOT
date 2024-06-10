import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NodeGraph = ({ data, attributes, nodeType, allData, nodeName, analogOrDigital }) => {
  const hasMultipleAttributes = attributes.length > 1;
  const [viewMode, setViewMode] = useState(hasMultipleAttributes ? 'all' : 'single');
  const [selectedAttribute, setSelectedAttribute] = useState(attributes[0]);
  const [selectedNodes, setSelectedNodes] = useState([nodeName]);
  const nodeNames = Object.keys(allData[nodeType]);

  const getDistinctColor = (index, total) => {
    const hue = (index / total) * 360 + (Math.random() - 0.5) * 20; // Slight random variation in hue
    const saturation = 70 + (Math.random() - 0.5) * 10; // Slight random variation in saturation
    const lightness = 50 + (Math.random() - 0.5) * 10; // Slight random variation in lightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  
  const chartDataSingle = useMemo(() => {
    const colors = {};
    const totalNodes = selectedNodes.length;
    const datasets = selectedNodes.map((node, index) => {
      const color = getDistinctColor(index, totalNodes);
      colors[node] = color;
      return {
        label: node,
        data: allData[nodeType][node].map(entry => entry[selectedAttribute]),
        borderColor: color,
        fill: false
      };
    });
    return {
      labels: data.map(entry => new Date(entry.Last_Updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      datasets,
      colors
    };
  }, [data, selectedNodes, selectedAttribute, allData, nodeType]);

  const chartDataAll = useMemo(() => (attr, index, total) => ({
    labels: data.map(entry => new Date(entry.Last_Updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [{
      label: attr,
      data: data.map(entry => entry[attr]),
      borderColor: getDistinctColor(index, total),
      fill: false
    }]
  }), [data]);

  const chartOptions = (title, yAxisUnit) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${title} (${yAxisUnit})`,
        color: '#97266d',
        font: {
          size: 18
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const reading = context[0].raw; // Get the reading value
            return `${reading} ${yAxisUnit}`; // Set as title
          },
          label: (context) => {
            const date = new Date(data[context.dataIndex].Last_Updated);
            return date.toLocaleString(); // Set as body
          }
        },
        bodyFont: {
          size: 15 // Adjust the tooltip body font size here
        },
        titleFont: {
          size: 15 // Adjust the title font size here if needed
        },
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          color: '#97266d',
          font: {
            size: 20
          },
          text: 'Time'
        },
        ticks: {
          color: '#97266d',
          maxRotation: 45,
          font: {
            size: 13
          },
          minRotation: 45,
          padding: 10
        }
      },
      y: {
        title: {
          display: true,
          color: '#97266d',
          font: {
            size: 20
          },
          text: `${title} (${yAxisUnit})`
        },
        ticks: {
          color: '#97266d',
          font: {
            size: 13
          },
        }
      }
    }
  });
  
  

  const getTotalFLowWaterNode = (nodeType, nodeName) => {
    const data = allData[nodeType][nodeName];

    if (!data || data.length === 0) {
      console.error('No data available for the given node.');
      return null;
    }
  
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  
    const latestEntry = data[data.length - 1];
    const latestEntryDate = new Date(latestEntry.Last_Updated);
  
    if (latestEntryDate < startOfDay || latestEntryDate >= new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)) {
      console.error('Latest entry is not from the current day.');
      return null;
    }
  
    let closestToMidnight = null;
  
    for (let i = data.length - 1; i >= 0; i--) {
      const entryDate = new Date(data[i].Last_Updated);
  
      if (entryDate < startOfDay) {
        break;
      }
  
      closestToMidnight = data[i];
    }
  
    if (!closestToMidnight) {
      closestToMidnight = data[0];
    }
  
    return (latestEntry["Total Flow"] - closestToMidnight["Total Flow"]).toFixed(2);
  };

  const getTotalConsumptionTankNode = (nodeType, nodeName) => {
    const data = allData[nodeType][nodeName];

    if (!data || data.length === 0) {
      console.error('No data available for the given node.');
      return null;
    }

    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  
    const latestEntry = data[data.length - 1];
    const latestEntryDate = new Date(latestEntry.Last_Updated);
  
    if (latestEntryDate < startOfDay || latestEntryDate >= new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)) {
      console.error('Latest entry is not from the current day.');
      return null;
    }

    let totalConsumption = 0;
    let previousEntryValue = null;

    for (let i = data.length - 1; i >= 0; i--) {
      const entry = data[i];
      const entryDate = new Date(entry.Last_Updated);

      if (entryDate < startOfDay) {
        break;
      }

      if (previousEntryValue !== null && entry["Total Volume"] > previousEntryValue) {
        totalConsumption += entry["Total Volume"] - previousEntryValue;
      }

      previousEntryValue = entry["Total Volume"];
    }

    return totalConsumption.toFixed(2);
};


  const handleNodeSelection = (event) => {
    const selectedNode = event.target.value;
    if (!selectedNodes.includes(selectedNode)) {
      setSelectedNodes([...selectedNodes, selectedNode]);
    }
  };

  const handleNodeRemoval = (node) => {
    if (node !== nodeName) {
      setSelectedNodes(selectedNodes.filter(n => n !== node));
    }
  };

  const getUnit = (key) => {
    
    const unitMapping = {
      "Water Level": "cm",
      "Temperature": "°C",
      "Total Volume": "kL",
      "Flow Rate": "kL/hr",
      "Pressure": "cbar",
      "Pressure Voltage": "cbar",
      "Total Flow": "kL"
    };
    return unitMapping[key] || "";
  };

  const ControlButtons = ({
    viewMode,
    setViewMode,
    hasMultipleAttributes,
    handleNodeSelection,
    nodeNames,
    nodeName,
    setSelectedNodes
  }) => {
    return (
      <div className="controls">
        {viewMode !== 'compare' && hasMultipleAttributes && (
          <div className="tabs">
            <h4>Graph Mode</h4>
            <div className="tab-buttons">
              <button
                className={`tab single ${viewMode === 'single' ? 'active' : ''}`}
                onClick={() => setViewMode('single')}
              >
                Single View
              </button>
              <button
                className={`tab multi ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => setViewMode('all')}
              >
                Summary View
              </button>
            </div>
          </div>
        )}
        <div className={`right-controls ${viewMode === 'compare' ? 'flex-1' : ''}`}>
          {viewMode !== 'compare' && (
            <button
              className="btn btn-secondary"
              onClick={() => setViewMode('compare')}
            >
              Compare Nodes
            </button>
          )}
          {viewMode === 'compare' && (
            <>
              <div className="flex gap-4 drops">
                <select
                  className="transparent-dropdown"
                  onChange={handleNodeSelection}
                >
                  {nodeNames.map(node => (
                    <option key={node} value={node}>
                      {node}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-secondary exit-comparison-btn"
                onClick={() => {
                  setViewMode('single');
                  setSelectedNodes([nodeName]);
                }}
              >
                Exit Comparison
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const latestData = allData[nodeType][nodeName][allData[nodeType][nodeName].length - 1];

  return (
    <div className="graph-container">
      <ControlButtons
        viewMode={viewMode}
        setViewMode={setViewMode}
        hasMultipleAttributes={hasMultipleAttributes}
        handleNodeSelection={handleNodeSelection}
        nodeNames={nodeNames}
        nodeName={nodeName}
        setSelectedNodes={setSelectedNodes}
      />
      {(viewMode === 'single' || viewMode === 'all') && (
        <>
          <div className='centered-title'>{nodeName}</div>
          <div className='centered-title flex justify-between align-middle'>
            {(
              <span className="latest-data opacity-0">
                this is how to scam bruh 
              </span>
            )}
            {(() => {
              switch (nodeType) {
                case 'water':
                  return `Water Node: ${analogOrDigital === 'analog' ? 'Prawah' : 'Shenitech'}`;
                case 'borewell':
                  return 'Borewell Node';
                case 'tank':
                  return 'Tank Node';
                default:
                  return nodeType;
              }
            })()}
            {viewMode === 'single' && (
              <div className='latest-data'>
                <span>
                {` (Latest Reading ${latestData[selectedAttribute]} ${getUnit(selectedAttribute)})`}
              </span>
              <span>
                {latestData['Last_Updated']}
              </span>
              </div>
            )}
            {viewMode === 'all' && nodeType === 'tank' &&(
              <span className="latest-data">
                {` (Today's Usage ${getTotalConsumptionTankNode('tank', nodeName)} kL)`}
              </span>
            )}
            {viewMode === 'all' && nodeType === 'water' &&(
              <span className="latest-data">
                {` (Today's Usage ${getTotalFLowWaterNode('water', nodeName )} kL)`}
              </span>
            )}
          </div>
          {viewMode === 'single' && hasMultipleAttributes && (
            <div className="attribute-dropdown-container">
              <select
                className="transparent-dropdown"
                value={selectedAttribute}
                onChange={e => setSelectedAttribute(e.target.value)}
              >
                {attributes.map(attr => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
      {viewMode === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attr, index) => (
          <div key={attr} className="graph-item all-mode-item">
            <Line data={chartDataAll(attr, index, attributes.length)} options={chartOptions(attr, getUnit(attr))} height={400} />
            <div className="latest-data">
              <span>
              {`Latest Reading: ${latestData[attr]} ${getUnit(attr)}`}
              </span>
              <span>
              {latestData['Last_Updated']}
              </span>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <>
          {viewMode === 'single' && (
            <Line
              className='graph-item'
              data={chartDataSingle}
              options={chartOptions(selectedAttribute, getUnit(selectedAttribute))}
              height={400}
            />
          )}
          {viewMode === 'compare' && (
            <div className="compare-view-container flex h-full">
              <div className="selected-nodes">
                <h3>Selected Nodes:</h3>
                <ul>
                  {selectedNodes.map(node => (
                    <li key={node} className="node-item">
                      {node}
                      <div className="node-color-line" style={{ backgroundColor: chartDataSingle.colors[node] }} />
                      {node !== nodeName && (
                        <button onClick={() => handleNodeRemoval(node)} className="remove-btn">
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='grow'>
                <h3 className="centered-title">
                  {(() => {
                    switch (nodeType) {
                      case 'water':
                        return 'Water Node';
                      case 'borewell':
                        return 'Borewell Node';
                      case 'tank':
                        return 'Tank Node';
                      default:
                        return nodeType;
                    }
                  })()}
                </h3>
                <div className="compare-dropdown-container">
                  <select
                    className="transparent-dropdown"
                    value={selectedAttribute}
                    onChange={e => setSelectedAttribute(e.target.value)}
                  >
                    {attributes.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </select>
                </div>
                <Line
                  className='graph-item'
                  data={chartDataSingle}
                  options={chartOptions(selectedAttribute, getUnit(selectedAttribute))}
                  height={400}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NodeGraph;
