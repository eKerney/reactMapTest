import * as React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import * as ReactDOM from 'react-dom';

// prodURL = 'https://noaaflaskapi.herokuapp.com/station/'
// localURL = 'http://127.0.0.1:5000/'

function ControlPanel(props) {
  const marks = [
    {value: 0, label: 'JAN'},
    {value: 10, label: 'FEB'},
    {value: 20, label: 'MAR'},
    {value: 30, label: 'APR'},
    {value: 40, label: 'MAY'},
    {value: 50, label: 'JUN'},
    {value: 60, label: 'JUL'},
    {value: 70, label: 'AUG'},
    {value: 80, label: 'SEP'},
    {value: 90, label: 'OCT'},
    {value: 100, label: 'NOV'},
    {value: 110, label: 'DEC'},
  ];
  
  const [month, setMonth] = useState(null);

  const onChange = (e, v) => console.log(e, v);
  const OnChangeCommitted = (e, v) => {
    //console.log(props);
    //console.log(e, v);
    };
  const valueLabelFormat = (val) => `${(marks.find(m => m.value === val)).label}`;
  useEffect(() => {
    //console.log(props, month.mon);
    
    const panel = !month ? '' : document.getElementsByClassName('control-panel');
    console.log(panel);

  
  });

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
         //getAriaValueText={valuetext}
         valueLabelDisplay="auto"
         step={10}
         marks={marks}
         min={0}
         max={110}
         valueLabelFormat={valueLabelFormat}
         //onChange={onChange}
         onChangeCommitted={(e, v) => {
           //console.log(props, e, v, `${(marks.find(m => m.value === v)).label}`);
           const mon = `${(marks.find(m => m.value === v)).label}`;
           setMonth({props, mon});
           
           } 
         }
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

export default React(ControlPanel);