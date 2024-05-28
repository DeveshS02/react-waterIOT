import React, { useState } from 'react';
import Navbar from './components/Navbar';
import IndexButton from './components/IndexButton';
import IndexPanel from './components/IndexPanel';
import MapComponent from './components/Map';  // Ensure the import is correct
import waterTankImage from './images/water_tank.png';
import prawahImage from './images/water-meter-new.png';
import shenitechImage from './images/sheni-new.png';
import sumpImage from './images/sump.png';
import boreWellImage from './images/borewell.png';
import pipelineImage from './images/pipeline.png';

const options = [
  { id: 1, label: 'Water Tank', image: waterTankImage },
  { id: 2, label: 'Prawah', image: prawahImage },
  { id: 3, label: 'Shenitech Water Meter', image: shenitechImage },
  { id: 4, label: 'Sump', image: sumpImage },
  { id: 5, label: 'Bore Well', image: boreWellImage },
  { id: 6, label: 'Pipeline', image: pipelineImage }
];

const App = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true); 

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

  const getDropdownLabel = () => {
    if (selectedOptions.length === 0) return 'All Nodes';
    if (selectedOptions.length > 1) return 'Multi';
    const selectedOption = options.find(option => option.id === selectedOptions[0]);
    return selectedOption ? selectedOption.label : 'All Nodes';
  };

  return (
    <div>
      {isNavbarVisible && (
        <Navbar 
          dropdownLabel={getDropdownLabel()} 
          options={options} 
          selectedOptions={selectedOptions} 
          toggleOption={toggleOption} 
        />
      )}
      
      <MapComponent 
        selectedOptions={selectedOptions}
        setIsNavbarVisible={setIsNavbarVisible} 
        location="IIITH"
      />
      
      <div className="fixed bottom-4 left-4 p-2 z-50">
          {!isOpen && <IndexButton handleButtonClick={handleButtonClick} />}
        <div className={isOpen ? 'blockk' : 'hiddenn'}>
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
      </div>
    </div>
  );
};

export default App;
