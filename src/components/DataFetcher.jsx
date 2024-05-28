import React, { useEffect, useState } from "react";
import ContentDisplay from "./ContentDisplay";

const DataFetcher = ({ activeTab, filter }) => {
  const [tankData, settankData] = useState([]);
  const [WaterMeterData, setWaterMeterData] = useState([]);
  const [borewellData, setborewellData] = useState([]);
  useEffect(() => {
    const fetchDatat = async () => {
      try {
        const response = await fetch(
          "https://api-gateway-green.vercel.app/water/tankdata"
        );
        const data = await response.json();
        // console.log(Object.keys(data));
        const lastObjects = Object.keys(data).map((key) => {
          const array = data[key];
          const lastItem = array[array.length - 1];
          const lastItemDate = new Date(lastItem.created_at);
          const now = new Date();
          const differenceInMilliseconds =
            now.getTime() - lastItemDate.getTime();
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
          let status = "false";
          if (differenceInHours <= 24) {
            status = "true";
          }
          return {
            name: key,
            totalvolume: lastItem.totalvolume,
            waterlevel: lastItem.waterlevel,
            temperature: lastItem.temperature,
            created_at: lastItem.created_at,
            stat: status,
          };
        });

        settankData(lastObjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchDatam = async () => {
      try {
        const response = await fetch(
          "https://api-gateway-green.vercel.app/water/latestwaterC"
        );
        const data = await response.json();
        // console.log(Object.keys(data));
        const lastObjects = Object.keys(data).map((key) => {
          const array = data[key];
          const lastItem = array[array.length - 1];
          const lastItemDate = new Date(lastItem.created_at);
          const now = new Date();
          const differenceInMilliseconds =
            now.getTime() - lastItemDate.getTime();
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
          let status = "false";
          if (differenceInHours <= 24) {
            status = "true";
          }
          return {
            name: key,
            totalflow: lastItem.totalflow,
            flowrate: lastItem.flowrate,
            created_at: lastItem.created_at,
            pressure:lastItem.pressure,
            stat: status,
          };
        });

        setWaterMeterData(lastObjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchDatab = async () => {
      try {
        const response = await fetch(
          "https://api-gateway-green.vercel.app/water/borewellgraphC"
        );
        const data = await response.json();
        // console.log(Object.keys(data));
        const lastObjects = Object.keys(data).map((key) => {
          const array = data[key];
          const lastItem = array[array.length - 1];
          const lastItemDate = new Date(lastItem.created_at);
          const now = new Date();
          const differenceInMilliseconds =
            now.getTime() - lastItemDate.getTime();
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
          let status = "false";
          if (differenceInHours <= 24) {
            status = "true";
          }
          return {
            name: key,
            waterlevel: lastItem.waterlevel,
            created_at: lastItem.created_at,
            stat: status,
          };
        });

        setborewellData(lastObjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
    />
  );
};

export default DataFetcher;