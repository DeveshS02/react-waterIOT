import React, { useState } from "react";
import IndexButton from "./IndexButton";
import IndexPanel from "./IndexPanel";
import waterTankImage from "../images/water_tank.png";
import prawahImage from "../images/water-meter-new.png";
import shenitechImage from "../images/sheni-new.png";
import sumpImage from "../images/sump.png";
import boreWellImage from "../images/borewell.png";
import pipeLineImage from "../images/pipeline.png";

const options = [
  {
    id: 1,
    label: "Water Tank",
    image: waterTankImage,
  },
  {
    id: 2,
    label: "Prawah",
    image: prawahImage,
  },
  {
    id: 3,
    label: "Shenitech Water Meter",
    image: shenitechImage,
  },
  {
    id: 4,
    label: "Sump",
    image: sumpImage,
  },
  {
    id: 5,
    label: "Bore Well",
    image: boreWellImage,
  },
  {
    id: 6,
    label: "Pipe Line",
    image: pipeLineImage,
  },
];

const Indexselect = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((optionId) => optionId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 p-2 z-50">
      {!isOpen && <IndexButton handleButtonClick={handleButtonClick} />}
      {isOpen && (
        <IndexPanel
          isOpen={isOpen}
          handleClose={handleClose}
          options={options}
          selectedOptions={selectedOptions}
          toggleOption={toggleOption}
        />
      )}
    </div>
  );
};

export default Indexselect;