import { useEffect, useState } from 'react';
import './App.css'

import TimeNow from "./components/TimeNow/TimeNow";
import TrackBtn from './components/TrackButton/TrackButton'
import Detail from './components/Detail/Detail'

import DefaultMap from './components/Map/DefaultMap'
import KMITLMap from './components/Map/KMTILMap'
import FloodMap from './components/Map/FloodMap'

import EngImg from './assets/logos/EngKMITL.png'
import IoTImg from './assets/logos/IoTeKMITL.png'

function App() {
  
  const [trackObj, setTrackObj] = useState(null);
  const [trackType, setTrackType] = useState("Vehicle");
  const [isNavrop, setIsNavdrop] = useState(false);
  const [clientLocation, setClientLocation] = useState(null);

  const [handleSelfTrack, setHandleSelfTrack] = useState();

  const mapConfig = {
    '/': {
      mapName: (
        <div className='pageName'>
          <label style={{ color: 'var(--orange-color)', fontWeight: "bold", overflow: "none" }}>KMITL</label>
          <label>&nbsp;</label>
          <label style={{ color: 'var(--black-color)', fontWeight: "normal" }}>Transit Tracking</label>
        </div>
      ),
      trackGroup: "ENGTCK",
      enableStation: true,
      routeName: "KMTIL Transit Tracking"
    },
    '/floodmap': {
      mapName: (
        <div className='pageName'>
          <label style={{ color: 'var(--orange-color)', fontWeight: "bold", overflow: "none" }}>เรือช่วยเหลือน้ำท่วม</label>
        </div>
      ),
      trackGroup: "FLDTCK",
      enableStation: false,
      routeName: "เรือช่วยเหลือน้ำท่วม"
    }
  };

  const routeSetting = (path) => {
    if (!mapConfig[path]) {
      return {
        mapName: (
          <div className='pageName'>
            <label style={{ color: 'var(--orange-color)', fontWeight: "bold", overflow: "none" }}>KMITL</label>
            <label>&nbsp;</label>
            <label style={{ color: 'var(--black-color)', fontWeight: "normal" }}>Tracking System</label>
          </div>
        ),
        trackGroup: null,
        enableStation: true
      };
    } else {
      return mapConfig[path];
    }
  };

  const { mapName, trackGroup, enableStation } = routeSetting(location.pathname.toLowerCase());
  const routeNames = Object.entries(mapConfig).map(([key, config]) => ({
    routePath: key,
    routeName: config.routeName
  }));

  return (
    <>
      <div className="test"> * อยู่ในช่วงระหว่างการพัฒนาระบบ * </div>
      <div className='credit'>
        <img src={EngImg}/>
        <img src={IoTImg}/>
      </div>
      <TimeNow />
      <div className='Nav'>

        { mapName }

        <button className="menu" onClick={() => { setIsNavdrop(!isNavrop) }}>
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--black-color)" strokeWidth="0.4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="var(--black-color)" fillRule="evenodd" d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"></path> </g></svg>
        </button>

        <div
          className='menuList'
          style={{
            display: isNavrop ? 'initial' : 'none'
          }}>
          {routeNames.map(({ routePath, routeName }, index) => (
            routePath !== window.location.pathname && <div key={index} onClick={() => { window.open(`${window.location.origin}${routePath}`); setIsNavdrop(!isNavrop);}}>{routeName}</div>
          ))}

          <br></br>
          Develop By IoTE of KMITL&nbsp;&nbsp;&nbsp;
        </div>

        <div
          className='menuListfade'
          style={{
            width: "100vw",
            height: "100vh",
            display: isNavrop ? 'initial' : 'none',
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 3
          }}
          onClick={() => { setIsNavdrop(!isNavrop) }}
        ></div>

      </div>

      <div className='Map'>
        {!mapConfig[location.pathname.toLowerCase()] && <DefaultMap/>}
        {location.pathname.toLowerCase() === '/' && <KMITLMap trackGroup={trackGroup} trackType={trackType} trackObj={trackObj} clientLocation={clientLocation} setClientLocation={setClientLocation} setHandleSelfTrack={setHandleSelfTrack}/>}
        {location.pathname.toLowerCase() === '/floodmap' && <FloodMap trackGroup={trackGroup} trackObj={trackObj} clientLocation={clientLocation} setClientLocation={setClientLocation} setHandleSelfTrack={setHandleSelfTrack}/>}
      </div>

      <TrackBtn trackGroup={trackGroup} trackObj={trackObj} setTrackObj={setTrackObj} trackType={trackType} setTrackType={setTrackType} enableStation={enableStation} clientLocation={clientLocation} handleSelfTrack={handleSelfTrack}/>
      {trackObj !== null && <Detail trackObj={trackObj} trackType={trackType} />}
    </>
  )
}

export default App
