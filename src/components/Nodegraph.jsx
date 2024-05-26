import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome styles

const NodeGraph = ({ data, attributes, nodeType, allData, nodeName }) => {
  const hasMultipleAttributes = attributes.length > 1;
  const [viewMode, setViewMode] = useState(hasMultipleAttributes ? 'all' : 'single');
  const [selectedAttribute, setSelectedAttribute] = useState(attributes[0]);
  const [selectedNodes, setSelectedNodes] = useState([nodeName]);
  const nodeNames = Object.keys(allData[nodeType]);

  useEffect(() => {
    if (viewMode === 'all') {
      setSelectedAttribute(null);
    } else {
      setSelectedAttribute(attributes[0]);
    }
  }, [viewMode, attributes]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartDataSingle = () => ({
    labels: data.map(entry => new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: selectedNodes.map(node => ({
      label: node,
      data: allData[nodeType][node].map(entry => entry[selectedAttribute]),
      borderColor: getRandomColor(),
      fill: false
    }))
  });

  const chartDataAll = (attr) => ({
    labels: data.map(entry => new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [{
      label: attr,
      data: data.map(entry => entry[attr]),
      borderColor: getRandomColor(),
      fill: false
    }]
  });

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        color: '#97266d',
        font: {
          size: 25 // Increase font size for title
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const date = new Date(data[context[0].dataIndex].created_at);
            return date.toLocaleString(); // Show full date and time in tooltip
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
            size: 20 // Increase font size for title
          },
          text: 'Time'
        },
        ticks: {
          color: '#97266d',
          maxRotation: 45,
          font: {
            size: 13 // Increase font size for title
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
            size: 20 // Increase font size for title
          },
          text: 'Value'
        },
        ticks:{
          color: '#97266d',
          font: {
            size: 14 // Increase font size for title
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

  return (
    <div className="graph-container">
      {hasMultipleAttributes && (
        <div className="controls">
          {viewMode === 'single' && (
            <>
              <button onClick={() => setViewMode('all')} className="btn btn-primary">
                View All
              </button>
              <select
                className="transparent-dropdown"
                value={selectedAttribute}
                onChange={e => setSelectedAttribute(e.target.value)}
              >
                {attributes.map(attr => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
              <button className="btn btn-secondary" onClick={() => setViewMode('compare')}>
                Compare Nodes
              </button>
            </>
          )}
          {viewMode === 'all' && (
            <button onClick={() => setViewMode('single')} className="btn btn-primary">
              View Single
            </button>
          )}
          {viewMode === 'compare' && (
            <>
              <select className="transparent-dropdown" onChange={handleNodeSelection}>
                {nodeNames.map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
              <select
                className="transparent-dropdown"
                value={selectedAttribute}
                onChange={e => setSelectedAttribute(e.target.value)}
              >
                {attributes.map(attr => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
              <button className="btn btn-secondary" onClick={() => {
                setViewMode('single');
                setSelectedNodes([nodeName]);
              }}>
                Exit Comparison
              </button>
            </>
          )}
        </div>
      )}
      {viewMode === 'all' ? (
        <>
          <h3 className="centered-title">{nodeName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map(attr => (
              <div key={attr} className="graph-item">
                <Line data={chartDataAll(attr)} options={chartOptions(attr)} height={400} />
              </div>
            ))}
          </div>
        </>
      ) : (
        viewMode === 'single' && (
          <Line data={chartDataSingle()} options={chartOptions(`${nodeName} : ${selectedAttribute}`)} height={400} />
        )
      )}
      {viewMode === 'compare' && (
        <div className="compare-view-container flex h-full">
          <div className='grow'>
            <Line data={chartDataSingle()} options={chartOptions(`${nodeName} : ${selectedAttribute}`)} height={400} />
          </div>
          <div className="selected-nodes">
            <h3>Selected Nodes:</h3>
            <ul>
              {selectedNodes.map(node => (
                <li key={node} className="node-item">
                  {node} {node !== nodeName && (
                    <button onClick={() => handleNodeRemoval(node)} className="remove-btn">
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeGraph;
