import * as React from 'react';
import Slider from '@mui/material/Slider';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

const prodURLyear = 'https://noaaflaskapi.onrender.com/year/', localURLyear = 'http://127.0.0.1:5000/year/';
const localURLmonth = 'http://127.0.0.1:5000/month', prodURLmonth = 'https://noaaflaskapi.onrender.com/month';

function ControlPanel(props) {
  const marks = [
    { value: 0, label: 'JAN' },
    { value: 10, label: 'FEB' },
    { value: 20, label: 'MAR' },
    { value: 30, label: 'APR' },
    { value: 40, label: 'MAY' },
    { value: 50, label: 'JUN' },
    { value: 60, label: 'JUL' },
    { value: 70, label: 'AUG' },
    { value: 80, label: 'SEP' },
    { value: 90, label: 'OCT' },
    { value: 100, label: 'NOV' },
    { value: 110, label: 'DEC' },
  ];
  const [month, setMonth] = useState(null);

  const valueLabelFormat = (val) => `${(marks.find(m => m.value === val)).label}`;
  useEffect(() => {
    const panel = !month ? '' : document.getElementsByClassName('control-panel');
    month && (console.log(month));
  });

  return !props.station ?
    // START PANEL NO SLIDER
    (
      <div className="control-panel">
        <h2>Operational Weather Suitability</h2>
        <p>NOAA GHCN Stations Climate Normals</p>
        <p>Click on a Station for Climate Chart - Data: <a href="https://www.ncdc.noaa.gov/cdo-web/" target="_blank" rel="noopener noreferrer">NOAA Climate Data</a></p>
        <hr style={{ width: '800px', marginLeft: '-100px', marginTop: '26px' }} />
        <br />
      </div>
    )
    // END PANEL NO SLIDER
    :
    props.station && month ? (
      <div className="control-panel" style={{ height: '90vh', overflowY: 'auto' }}>
        <h2>Operational Weather Suitability</h2>
        <p>NOAA GHCN Stations Climate Normals</p>
        <p>Click on a Station for Climate Chart - Data: <a href="https://www.ncdc.noaa.gov/cdo-web/" target="_blank" rel="noopener noreferrer">NOAA Climate Data</a></p>
        <hr style={{ width: '800px', marginLeft: '-100px', marginBottom: '10px', marginTop: '26px' }} />
        <br />
        <div style={{ position: 'absolute' }}>
          <iframe className='iframe-year' title='yearFrame' src={`${prodURLyear}${props.station}`} />
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <hr style={{ width: '800px', marginLeft: '-100px' }} />
        <p></p>
        <Slider name='monthSlider' aria-label="Temperature" defaultValue={0} valueLabelDisplay="auto" step={10} marks={marks}
          min={0} max={110} valueLabelFormat={valueLabelFormat}
          onChangeCommitted={(e, v) => {
            setMonth({ mon: `${(marks.find(m => m.value === v)).label}`, sta: props.station })
          }}
        />
        <div style={{ position: 'absolute' }}>
          <iframe style={{ overflow: 'hidden', padding: '0px', height: '700px' }} className="frame-month" title='monthFrame' src={`${prodURLmonth}?station=${props.station}&month=${month.mon}`} />
        </div>
      </div>
    ) :
      // START PANEL WITH MONTH SLIDER
      (
        <div className="control-panel" style={{ height: '600px' }}>
          <h2>Operational Weather Suitability</h2>
          <p>NOAA GHCN Stations Climate Normals</p>
          <p>Click on a Station for Climate Chart - Data: <a href="https://www.ncdc.noaa.gov/cdo-web/" target="_blank" rel="noopener noreferrer">NOAA Climate Data</a></p>
          <hr style={{ width: '800px', marginLeft: '-100px', marginBottom: '10px', marginTop: '26px' }} />
          <br />
          <div style={{ position: 'absolute' }}>
            <iframe className='iframe-year' title='yearFrame' src={`${prodURLyear}${props.station}`} />
          </div>
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <hr style={{ width: '800px', marginLeft: '-100px' }} />
          <p></p>
          <Slider name='monthSlider' aria-label="Temperature" defaultValue={0} valueLabelDisplay="auto" step={10} marks={marks}
            min={0} max={110} valueLabelFormat={valueLabelFormat}
            onChangeCommitted={(e, v) => {
              setMonth({ mon: `${(marks.find(m => m.value === v)).label}`, sta: props.station })
            }}
          />
        </div>
      );
  // END PANEL WITH MONTH SLIDER

}

export default React.memo(ControlPanel);
