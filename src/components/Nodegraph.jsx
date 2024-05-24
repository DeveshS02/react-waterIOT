import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const NodeGraph = ({ data, attributes, nodeType }) => {
  const hasMultipleAttributes = attributes.length > 1;
  const [viewMode, setViewMode] = useState(hasMultipleAttributes ? 'all' : 'single');
  const [selectedAttribute, setSelectedAttribute] = useState(attributes[0]);

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

  const chartData = (attr) => ({
    labels: data.map(entry => new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [{
      label: attr,
      data: data.map(entry => entry[attr]),
      borderColor: getRandomColor(),
      fill: false
    }]
  });

  const chartOptions = (attr) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${nodeType} - ${attr}`,
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

  return (
    <div className="graph-container">
      {hasMultipleAttributes && (
        <div className="controls">
           {viewMode === 'single' && (
            <button onClick={() => setViewMode('all')} className="btn btn-primary">
              View All
            </button>
          )}
          {viewMode === 'all' && (
            <button onClick={() => setViewMode('single')} className="btn btn-primary">
              View Single
            </button>
          )}
          {viewMode === 'single' && (
            <select
              value={selectedAttribute}
              onChange={e => setSelectedAttribute(e.target.value)}
            >
              {attributes.map(attr => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
          )}
        </div>
      )}
      {viewMode === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attributes.map(attr => (
            <div key={attr} className="graph-item">
              <Line data={chartData(attr)} options={chartOptions(attr)} height={400} />
            </div>
          ))}
        </div>
      ) : (
        <Line data={chartData(selectedAttribute)} options={chartOptions(selectedAttribute)} height={400} />
      )}
    </div>
  );
};

export default NodeGraph;