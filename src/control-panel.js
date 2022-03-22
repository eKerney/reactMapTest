import * as React from 'react';

function ControlPanel(props) {
  return (
    <div className="control-panel">
      <div className="tooltip interactive">    
          <iframe 
          src={`http://127.0.0.1:5000/${props.station}`} />
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);