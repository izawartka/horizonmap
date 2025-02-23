import { useState } from 'react';
import Map from './map/Map';
import Toolbar from './toolbar/Toolbar';
import MainContext from '../contexts/MainContext';
import './App.css';
import Constants from '../helpers/constants';
import HorizonManager from './horizon/HorizonManager';

function App() {
  const [map, setMap] = useState(null);
  const [markerPos, setMarkerPos] = useState(Constants.marker.startPos);
  const [radius, setRadius] = useState(Constants.marker.defaultRadius);
  const [heightmapZoom, setHeightmapZoom] = useState(Constants.heightmap.defaultZoom);
  const [rays, setRays] = useState(Constants.horizon.defaultRays);
  const [heightOffset, setHeightOffset] = useState(Constants.horizon.defaultHeightOffset);
  const [includeCurvature, setIncludeCurvature] = useState(Constants.horizon.defaultIncludeCurvature);
  const [showOverlay, setShowOverlay] = useState(true);
  const [horizonData, setHorizonData] = useState(null);
  const [inProgress, setInProgress] = useState(0);

  return (
    <MainContext.Provider value={{ 
      map, 
      markerPos, setMarkerPos, 
      radius, setRadius, 
      showOverlay, setShowOverlay,
      heightmapZoom, setHeightmapZoom,
      rays, setRays,
      horizonData, setHorizonData,
      heightOffset, setHeightOffset,
      includeCurvature, setIncludeCurvature,
      inProgress, setInProgress
    }}>
      <div className="App">
        <HorizonManager />
        <Toolbar />
        <Map setMap={setMap} />
      </div>
    </MainContext.Provider>
  );
}

export default App;
