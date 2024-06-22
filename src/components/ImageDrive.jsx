import React, { useState } from 'react';

const nodeIndexMapping = {
  0: "Himalaya01",
  1: "Himalaya02",
  2: "SmartWaterMeter_Node_Kohli_Rooftop-72",
  3: "SmartWaterMeter_Node_Kohli_Rooftop-73",
  4: "PH03-70",
  5: "SmartWaterMeter_Node_PH04-70",
  6: "SmartWaterMeter_Node_PH04-71",
  7: "Smart Water Meter-Retrofit Vindhya Rooftop VN04-70",
  8: "Smart Water Meter-Retrofit Vindhya Rooftop VN04-71",
  9: "Parijath Nivas",
  10: "Smart Water Meter-Retrofit Bodh Bhavan Rooftop BB0",
  11: "Smart Water Meter-Retrofit Bodh Bhavan Rooftop BB1",
  12: "SmartWaterMeter_Node_PL00-70",
  13: "SmartWaterMeter_Node_PL00-71",
  14: "PH02-70"
};

const ImageDrive = ({setImageDisplay}) => {
  const [n, setN] = useState('');
  const [t, setT] = useState('');
  const [timeUnit, setTimeUnit] = useState('minutes');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(Object.keys(nodeIndexMapping)[0]);

  const fetchImages = () => {
    setLoading(true);
    setImages([]); // Clear previous images

    const eventSource = new EventSource(`https://drive-5s1o.onrender.com/drive/files/first/${selectedNodeIndex}?n=${n}&t=${t}&unit=${timeUnit}`);

    let firstImageDisplayed = false;

    eventSource.onmessage = function(event) {
      if (!firstImageDisplayed) {
        setLoading(false);
        firstImageDisplayed = true;
      }

      const data = JSON.parse(event.data);
      setImages(prevImages => [...prevImages, data]);
    };

    eventSource.onerror = function() {
      console.error('EventSource failed.');
      eventSource.close();
    };
  };

  return (
    <div className="img-display">
      <div className="absolute top-2 right-3">
        <button onClick={() => setImageDisplay(false)}>
          <svg
            width="64px"
            height="64px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-9"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M16 8L8 16M8.00001 8L16 16"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </button>
      </div>
      <h1 className='mt-3'>Image Archive</h1>

      <div className='fields grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='inut'>
            <label htmlFor="node">Select Prawah Node</label>
            <select
              id="node"
              name="node"
              value={selectedNodeIndex}
              onChange={(e) => setSelectedNodeIndex(e.target.value)}
              required
            >
              {Object.entries(nodeIndexMapping).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
        </div>

        <div className='inut'>
            <label htmlFor="timeUnit">Time Unit</label>
            <select
              id="timeUnit"
              name="timeUnit"
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
              required
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
        </div>

        <div className='inut'>
            <label htmlFor="n">Number of Images</label>
            <input
              id="n"
              name="n"
              value={n}
              onChange={(e) => setN(e.target.value)}
              required
            />
        </div>

        <div className='inut'>
            <label htmlFor="t">Time Difference Value</label>
            <input
              id="t"
              name="t"
              value={t}
              onChange={(e) => setT(e.target.value)}
              required
            />
        </div>
      </div>
      <button className='btn mb-3 mt-3' onClick={fetchImages}>Display Images</button>
      <div className='box grid grid-cols-1 md:grid-cols-2 gap-11' id="images">
        {images.map((image, index) => {
          const fileName = image.fileName;
          const match = fileName.match(/img(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\.jpg/);

          let formattedDate = fileName; // Default to the filename in case the match fails

          if (match) {
            const timestamp = match[1];
            const date = new Date(`${timestamp.slice(0, 10)}T${timestamp.slice(11).replace(/-/g, ':')}`);

            formattedDate = date.toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }).replace(',', '');
          }

          return (
            <div key={index} className="image-container flex justify-center flex-col">
              <img className='image mb-3' src={image.fileData} alt={fileName} />
              <p className='date'>{formattedDate}</p>
            </div>
          );
        })}
      </div>
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default ImageDrive;
