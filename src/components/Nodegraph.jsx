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

  const getRandomColor = () => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;

  const chartDataSingle = useMemo(() => {
    const colors = {};
    const datasets = selectedNodes.map(node => {
      const color = getRandomColor();
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

  const chartDataAll = useMemo(() => (attr) => ({
    labels: data.map(entry => new Date(entry.Last_Updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [{
      label: attr,
      data: data.map(entry => entry[attr]),
      borderColor: getRandomColor(),
      fill: false
    }]
  }), [data]);

  const chartOptions = (title, yAxisUnit) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        color: '#97266d',
        font: {
          size: `${18}vw`
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const date = new Date(data[context[0].dataIndex].Last_Updated);
            return date.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          color: '#97266d',
          font: {
            size: `${20}vw`
          },
          text: 'Time'
        },
        ticks: {
          color: '#97266d',
          maxRotation: 45,
          font: {
            size: `${13}vw`
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
            size: `${20}vw`
          },
          text: `${title} (${yAxisUnit})`
        },
        ticks: {
          color: '#97266d',
          font: {
            size: `${13}vw`
          },
        }
      }
    }
  });

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
      "Total Volume": "m³",
      "Flow Rate": "kL/hr",
      "Pressure": "cbar",
      "Pressure Voltage": "cbar",
      "Total Flow": "Litres"
    };
    return unitMapping[key] || "";
  };

  const ControlButtons = ({
    viewMode,
    setViewMode,
    hasMultipleAttributes,
    selectedAttribute,
    setSelectedAttribute,
    attributes,
    handleNodeSelection,
    nodeNames,
    nodeName,
    setSelectedNodes
  }) => {
    return (
      <div className="controls">
        {viewMode !== 'compare' && (
          <div className="tabs">
            <h4>Graph Modes</h4>
            <div className="tab-buttons">
              <button
                className={`tab single ${viewMode === 'single' ? 'active' : ''}`}
                onClick={() => setViewMode('single')}
              >
                Single View
              </button>
              {hasMultipleAttributes && (
                <button
                  className={`tab multi ${viewMode === 'all' ? 'active' : ''}`}
                  onClick={() => setViewMode('all')}
                >
                  Multi View
                </button>
              )}
            </div>
          </div>
        )}
        <div className="right-controls">
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

  return (
    <div className="graph-container">
      <ControlButtons 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        hasMultipleAttributes={hasMultipleAttributes} 
        selectedAttribute={selectedAttribute} 
        setSelectedAttribute={setSelectedAttribute} 
        attributes={attributes} 
        handleNodeSelection={handleNodeSelection}
        nodeNames={nodeNames}
        nodeName={nodeName}
        setSelectedNodes={setSelectedNodes}
      />
      {(viewMode === 'single' || viewMode === 'all') && (
        <>
          <h3 className="centered-title">{nodeName}</h3>
          <div className="centered-title">
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
          {attributes.map(attr => (
            <div key={attr} className="graph-item">
              <Line data={chartDataAll(attr)} options={chartOptions(attr, getUnit(attr))} height={400} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {viewMode === 'single' && (
            <Line
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
