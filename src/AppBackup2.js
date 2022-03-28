import * as React from 'react';
import ReactDOM from "react-dom";
import Map, {Source, Layer, Popup} from 'react-map-gl';
import { MapContext } from 'react-map-gl/dist/esm/components/map';
import DeckGL from '@deck.gl/react';
import {render} from 'react-dom';
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import {ScatterplotLayer} from '@deck.gl/layers';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {CSVLoader} from '@loaders.gl/csv';
import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ControlPanel from './control-panel';
import {PointCloudLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM, OrbitView, LinearInterpolator} from '@deck.gl/core';


  
  export default function App() {
    const LAZ_SAMPLE =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/pointcloud.json'

    const layer = new PointCloudLayer({
      id: 'PointCloudLayer',
      data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/pointcloud.json',
      
      /* props from PointCloudLayer class */
      
      getColor: d => d.color,
      getNormal: d => d.normal,
      getPosition: d => d.position,
      // material: true,
      pointSize: 2,
      // sizeUnits: 'pixels',
      /* props inherited from Layer class */
      // autoHighlight: false,
      coordinateOrigin: [-122.4, 37.74],
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      // highlightColor: [0, 0, 128, 128],
      // modelMatrix: null,
      // opacity: 1,
      pickable: false,
      // visible: true,
      // wrapLongitude: false,
    });
  
    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZXJpY2tlcm5leSIsImEiOiJja2FjbTNiMXcwMXp1MzVueDFjdDNtcW92In0.LW0qdB-2FmA3UK51M67fAQ';
    
    const [viewState, setViewState] = React.useState({
      longitude: -97,
      latitude: 37,
      zoom: 4,
      pitch: 60,
      bearing: -60,
    });
    
  const [hoverInfo, setHoverInfo] = useState();  
  const deckRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [showPopup, setShowPopup] = React.useState(true);
  const [features, setFeatures] = useState({});

  return (
    <>

    <DeckGL 
      ref={deckRef}
      initialViewState={viewState} 
      controller={true}
      layers={[layer]}
      ContextProvider={MapContext.Provider}
      onClick={({ x, y, coordinate, object}) => {
        // TODO: figure out how to get rid of extra click event
        if (object) {
          setSelected({ x, y, coordinate, object });
        } else {
          // clicked off an object
          setSelected(null);
        }
      }}
      //getTooltip={getTooltip} 
    >
      <Map reuseMaps
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100vw', height: '100vh'}}
        mapStyle="mapbox://styles/erickerney/cl0l6ydmk000d14slnsws819a"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}   
      >
      
        </Map>

    </DeckGL>
    <ControlPanel station={selected && selected.object.desc} />

    </>
  );
}
