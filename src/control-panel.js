import * as React from 'react';

function ControlPanel(props) {
  return !props.station ? (<div className="control-panel"><h1>Select a NOAA Station</h1></div>) 
    : ( <div className="control-panel">
          <iframe src={`http://127.0.0.1:5000/${props.station}`} />
        </div> 
      ); 
    
}

export default React.memo(ControlPanel);