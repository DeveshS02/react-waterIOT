import React, { useRef, useEffect, useState } from "react";

const ContentDisplay = ({
  activeTab,
  filter,
  tankData,
  WaterMeterData,
  borewellData,
  nodes,
  data,
  setSelectedDetail,
  setNavClosing,
  setNavOpening,
}) => {
  const containerRef = useRef(null);
  const [allNodesData, setAllNodesData] = useState([]);
  useEffect(() => {
    const combinedData = [...WaterMeterData, ...tankData, ...borewellData];
    setAllNodesData(combinedData);
  }, [WaterMeterData, tankData, borewellData]);

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleWheel = (event) => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: event.deltaY < 0 ? -200 : 200,
          behavior: "smooth",
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel);
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  const handleNodeClick = (nodeType, nodeName) => {
    const nodeData = data[nodeType][nodeName];
    if (nodeType === "water") {
      const node = nodes.water.find((node) => node.name === nodeName);
      const isAnalog = node?.parameters.includes("isanalog");
      const analogOrDigital = isAnalog ? "analog" : "digital";

      const attributes = !isAnalog
        ? Object.keys(nodeData[0]).filter((key) => key !== "Last_Updated")
        : Object.keys(nodeData[0]).filter(
            (key) =>
              key !== "Last_Updated" &&
              key !== "pressure" &&
              key !== "pressurevoltage"
          );

      setSelectedDetail({
        data: nodeData,
        type: nodeType,
        attributes: attributes,
        isAnalog: isAnalog,
        name: nodeName,
        analogOrDigital: analogOrDigital,
      });
    } else {
      setSelectedDetail({
        data: nodeData,
        type: nodeType,
        attributes: Object.keys(nodeData[0]).filter(
          (key) => key !== "Last_Updated"
        ),
        isAnalog: false,
        name: nodeName,
        analogOrDigital: null,
      });
    }
    setNavClosing(true);
    setNavOpening(false);
  };
  const renderNode = (item, type) => (
    <div className="flex flex-col justify-center pb-3">
      <div className="flex flex-col headingnode items-center justify-center mb-4">
        <div className="p-2 text-pretty flex items-center justify-center bg-transparent w-[99%]">
          <span className="heading text-pretty text-xl font-semibold whitespace-normal">
            {item.name}
          </span>
        </div>
      </div>
      {type === "WaterMeter" && (
        <>
          <div className="flex flex-col space-y-4 justify-center items-center">
            <div>
              <span className="key">Total Flow: </span>
              {(() => {
                let x = item.totalflow;
                if (x === "-") {
                  return <span className="value"> {x} </span>;
                } else {
                  return <span className="value">{x} L</span>;
                }
              })()}
            </div>
            <div>
              <span className="key">Flow Rate: </span>
              {(() => {
                let x = item.flowrate;
                if (x === "-") {
                  return <span className="value"> {x} </span>;
                } else {
                  return <span className="value">{x} kl/hr</span>;
                }
              })()}
            </div>
            <div>
              <span className="key">Pressure: </span>
              {(() => {
                let x = item.pressure;
                if (x === "-") {
                  return <span className="value"> {x} </span>;
                } else {
                  return <span className="value">{x} cbar</span>;
                }
              })()}
            </div>
            <div>
              <button
                className="text-white details  rounded-lg border-2 bg-white bg-opacity-70 backdrop-filter backdrop-blur-md h-10 w-20"
                onClick={() => {
                  handleNodeClick("water", item.name);
                }}
              >
                Details
              </button>
            </div>
          </div>
        </>
      )}
      {type === "WaterTank" && (
        <>
          <div className="flex flex-col space-y-4 justify-center items-center">
            <div>
              <span className="key">Temperature: </span>
              {(() => {
                let x = item.temperature;
                if (x === "-") {
                  return <span className="value"> {x} </span>;
                } else {
                  return <span className="value">{x} &deg;C</span>;
                }
              })()}
            </div>
            <div>
              <span className="key">Total Volume: </span>
              {(() => {
                let x = item.totalvolume;
                if (x === "-") {
                  return <span className="value"> {x} </span>;
                } else {
                  <span className="value">
                    {x} m<sup>3</sup>
                  </span>;
                }
              })()}
            </div>
            <div>
              <span className="key">Water Level: </span>
              {(() => {
                let x = item.waterlevel;
                if (x === "-") {
                  return <span className="value"> {x} </span>;
                } else {
                  return <span className="value">{x} cm</span>;
                }
              })()}
            </div>
            <div>
              <button
                className="text-white details rounded-lg border-2 bg-white bg-opacity-70 backdrop-filter backdrop-blur-md h-10 w-20"
                onClick={() => {
                  handleNodeClick("tank", item.name);
                }}
              >
                Details
              </button>
            </div>
          </div>
        </>
      )}
      {type === "Borewell" && (
        <div className="flex flex-col space-y-4 items-center justify-center">
          <div>
            <span className="key">Water Level: </span>
            {(() => {
              let x = item.waterlevel;
              if (x === "-") {
                return <span className="value"> {x} </span>;
              } else {
                return <span className="value">{x} cm</span>;
              }
            })()}
          </div>
          <div>
            <button
              className="text-white details rounded-lg border-2 bg-white bg-opacity-70 backdrop-filter backdrop-blur-md h-10 w-20"
              onClick={() => {
                handleNodeClick("borewell", item.name);
              }}
            >
              Details
            </button>
          </div>
        </div>
      )}
      <div className="hidden  flex-row justify-center">
        <span className="text-zinc-700 font-semibold">Last Updated</span>
        &nbsp;
        <span className="text-zinc-700 font-semibold">{item.created_at}</span>
        <span className="hidden">
          status: <span>{item.stat}</span>
        </span>
      </div>
    </div>
  );

  const contentData = {
    AllNodes: allNodesData.map((item) => {
      let type = "";
      if (WaterMeterData.includes(item)) type = "WaterMeter";
      if (tankData.includes(item)) type = "WaterTank";
      if (borewellData.includes(item)) type = "Borewell";
      return renderNode(item, type);
    }),
    WaterMeter: WaterMeterData.map((item) => renderNode(item, "WaterMeter")),
    WaterTank: tankData.map((item) => renderNode(item, "WaterTank")),
    Borewell: borewellData.map((item) => renderNode(item, "Borewell")),
  };

  const determineClassName = (item) => {
    const v =
      item.props.children[item.props.children.length - 1].props.children[3]
        .props.children[1].props.children;
    const className = v === "true" ? "acardcss" : "icardcss";
    return { className, v };
  };

  const filteredContent = contentData[activeTab]
    .map((item) => {
      const { className, v } = determineClassName(item);
      if (filter === "Active" && v !== "true") return null;
      if (filter === "Inactive" && v !== "false") return null;
      return (
        <div
          key={item.key}
          className={`${className} cursor-pointer transform transition-transform duration-300 ease-in-out  hover:!scale-90 rounded-lg flex-shrink-0`}
        >
          {item}
        </div>
      );
    })
    .filter(Boolean);

  return (
    <div className="h-[70%]">
      <div className="flex items-center h-[100%]">
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-800 p-2 rounded-full z-10 hover:text-blue-500"
          onClick={() => scrollContainer("left")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div
          ref={containerRef}
          className="w-[100%] h-[100%] flex overflow-x-auto space-x-4 px-8 hide-scrollbar group justify-between"
          style={{ scrollBehavior: "smooth" }}
        >
          {filteredContent}
        </div>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-800 p-2 rounded-full z-10 hover:text-blue-500"
          onClick={() => scrollContainer("right")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div className="mt-8 flex justify-center text-cyan-950 text-lg font-semibold">
        <h3>Total number of nodes: {filteredContent.length}</h3>
      </div>
    </div>
  );
};

export default ContentDisplay;