import React, { useEffect, useState } from "react";
import ContentDisplay from "./ContentDisplay";

const DataFetcher = ({
  activeTab,
  filter,
  allNodes,
  nodes,
  setSelectedDetail,
  setNavOpening,
  setNavClosing,
}) => {
  const [tankData, settankData] = useState([]);
  const [WaterMeterData, setWaterMeterData] = useState([]);
  const [borewellData, setborewellData] = useState([]);
  useEffect(() => {
    const fetchDatat = () => {
      const data = allNodes["tank"];
      const lastObjects = Object.keys(data).map((key) => {
        const array = data[key];
        let status = "false";
        if (array.length !== 0) {
          const lastItem = array[array.length - 1];
          const lastItemDate = new Date(lastItem.Last_Updated);
          const now = new Date();
          const differenceInMilliseconds =
            now.getTime() - lastItemDate.getTime();
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
          if (differenceInHours <= 48) {
            status = "true";
          }
          return {
            name: key,
            totalvolume: lastItem["Total Volume"],
            waterlevel: lastItem["Water Level"],
            temperature: lastItem.Temperature,
            created_at: lastItem.Last_Updated,
            stat: status,
          };
        } else {
          return {
            name: key,
            totalvolume: "-",
            waterlevel: "-",
            temperature: "-",
            created_at: "-",
            stat: status,
          };
        }
      });

      settankData(lastObjects);
    };
    const fetchDatam = () => {
      const data = allNodes["water"];
      const lastObjects = Object.keys(data).map((key) => {
        const array = data[key];
        let status = "false";
        if (array.length !== 0) {
          const lastItem = array[array.length - 1];
          const lastItemDate = new Date(lastItem.Last_Updated);
          const now = new Date();
          const differenceInMilliseconds =
            now.getTime() - lastItemDate.getTime();
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
          if (differenceInHours <= 24) {
            status = "true";
          }
          return {
            name: key,
            totalflow: lastItem["Total Flow"],
            flowrate: lastItem["Flow Rate"],
            created_at: lastItem.Last_Updated,
            pressure: lastItem.Pressure,
            stat: status,
          };
        } else {
          return {
            name: key,
            totalflow: "-",
            flowrate: "-",
            created_at: "-",
            pressure: "-",
            stat: status,
          };
        }
      });

      setWaterMeterData(lastObjects);
    };
    const fetchDatab = async () => {
      const data = allNodes["borewell"];
      const lastObjects = Object.keys(data).map((key) => {
        const array = data[key];
        let status = "false";
        if (array.length !== 0) {
          const lastItem = array[array.length - 1];
          const lastItemDate = new Date(lastItem.Last_Updated);
          const now = new Date();
          const differenceInMilliseconds =
            now.getTime() - lastItemDate.getTime();
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
          if (differenceInHours <= 24) {
            status = "true";
          }
          return {
            name: key,
            waterlevel: lastItem["Water Level"],
            created_at: lastItem.last_Updated,
            stat: status,
          };
        } else {
          return {
            name: key,
            waterlevel: "-",
            created_at: "-",
            stat: status,
          };
        }
      });

      setborewellData(lastObjects);
    };

    fetchDatat();
    fetchDatam();
    fetchDatab();
  }, []);

  return (
    <ContentDisplay
      activeTab={activeTab}
      filter={filter}
      tankData={tankData}
      WaterMeterData={WaterMeterData}
      borewellData={borewellData}
      nodes={nodes}
      data={allNodes}
      setSelectedDetail={setSelectedDetail}
      setNavClosing={setNavClosing}
      setNavOpening={setNavOpening}
    />
  );
};

export default DataFetcher;