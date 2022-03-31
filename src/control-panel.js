import * as React from 'react';

// import { Slider } from 'antd';

// import 'antd/lib/slider/style/index.css';
// import 'antd/lib/tooltip/style/index.css';
// import 'antd/lib/tooltip/style/index.less';
// import 'antd/lib/tooltip/style/rtl.less';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

//import 'atd/dist/antd.css'
//import './App.css'
// prodURL = 'https://noaaflaskapi.herokuapp.com/station/'
// localURL = 'http://127.0.0.1:5000/'

function ControlPanel(props) {
  const marks = {
    0: 'JAN',
    9.1 : 'FEB',
    18.2: 'MAR',
    27.2: 'APR',
    36.3: 'MAY',
    45.4: 'JUN',
    54.5: 'JUL',
    63.6: 'AUG',
    72.7: 'SEP',
    81.8: 'OCT',
    90.9: 'NOV',
    100: 'DEC',
  };

  function onAfterChange(value) {
    console.log(marks[value]);
  }
  function formatter(value) {
    return `${marks[value]}`;
  };
  
  function valuetext(value) {
    return `${value}°C`;
  }

  return !props.station ? (
    <div className="control-panel">
      <h2>Operational Weather Suitability</h2>
      <p>NOAA GHCN Stations Climate Normals</p>
      <p>Click on a Station for Climate Chart - Data: <a href="https://www.ncdc.noaa.gov/cdo-web/" target="_blank" rel="noopener noreferrer">NOAA Climate Data</a></p>
     
      
      <hr style={{width: '800px', marginLeft: '-100px', marginTop: '26px'}}/>
      <br />
    </div>
  ) 
    : ( 
    
      <div className="control-panel" style={{height: '800px'}}>
        <h2>Operational Weather Suitability</h2>
        <p>NOAA GHCN Stations Climate Normals</p>
        <p>Click on a Station for Climate Chart - Data: <a href="https://www.ncdc.noaa.gov/cdo-web/" target="_blank" rel="noopener noreferrer">NOAA Climate Data</a></p>
        
        <hr style={{width: '800px', marginLeft: '-100px', marginBottom: '10px', marginTop: '26px'}}/>
        <br />
        <div style={{position: 'absolute'}}>
          <iframe src={`https://noaaflaskapi.herokuapp.com/station/${props.station}`}></iframe>
        </div>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
         <hr style={{width: '800px', marginLeft: '-100px'}}/>
         <p></p>
         <Slider
         
         aria-label="Temperature"
         defaultValue={30}
         getAriaValueText={valuetext}
         valueLabelDisplay="auto"
         step={10}
         marks
         min={0}
         max={110}
       />
      </div>
    
    ); 
    // extended panel for additional chart display
    // ( 
    
    //   <div className="control-panel">
    //     <h2>Operational Weather Suitability</h2>
    //     <p>NOAA GHCN Stations Climate Normals</p>
    //     <p>Click on a Station for Climate Chart - Data: <a href="https://www.ncdc.noaa.gov/cdo-web/" target="_blank" rel="noopener noreferrer">NOAA Climate Data</a></p>
    //     <hr style={{width: '800px', marginLeft: '-100px'}}/>
    //     <br />
    //     <div style={{position: 'absolute'}}>
    //       <iframe src={`https://noaaflaskapi.herokuapp.com/station/${props.station}`}></iframe>
    //     </div>
    //     <div style={{position: 'absolute'}}>
    //     <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      
    //     <hr style={{width: '800px', marginLeft: '-100px'}}/>
    //     <p></p>
    //     </div>
    //   </div>
    
    // );
    
}

export default React.memo(ControlPanel);