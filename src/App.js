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
//import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ControlPanel from './control-panel';
import {PointCloudLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM, OrbitView, LinearInterpolator} from '@deck.gl/core';

import ReactMapGL from "react-map-gl";
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const HEX_DATA = "https://raw.githubusercontent.com/chriszrc/foss4g-2021-react-mapbox/main/deck-layers-map/public/data/hex_radio_coverage.json";
const stationData = 'https://raw.githubusercontent.com/eKerney/reactMapTest/main/src/noaaAptEditedCol.csv';
const testData = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';
  
  export default function App() {
    
    // station point locations layer
    const noaaStations = new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: fetch(stationData)
        .then(response => response.arrayBuffer())
        .then(buffer => CSVLoader.parse(buffer)),
      pickable: true,
      opacity: 0.3,
      stroked: true,
      filled: true,
      radiusScale: 6,   
      radiusMinPixels: 7, 
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => [d['lon'], d['lat']],
      getRadius: d => Math.sqrt(d.exits),
      getFillColor: d => [(255-(d['elevation']*.1)), (140+(d['elevation']*.001)), (d['elevation']* .50)],
      getLineColor: d => [0, 0, 0, 0],
      autoHighlight: true,
      highlightColor: [0, 255, 0]
      //onHover: (info, event) => console.log('Hovered:', info.object),
      //onClick: (info, event) => onClick(info)
    });  

    // specs for hex aggrgation layer
    const colorRange = [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78]
    ];
    const material = {
      ambient: 0.64,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [51, 51, 51]
    };
    const radius = 60000, upperPercentile = 100, coverage = 1;
    // end of hex specs

    const stationsHex = [ 
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data: fetch(stationData)
              .then(response => response.arrayBuffer())
              .then(buffer => CSVLoader.parse(buffer)),
        elevationRange: [0, 300000],
        elevationScale: 5,
        extruded: true,
        getPosition: d => [d.lon,d.lat],
        pickable: true,
        radius,
        upperPercentile,
        material,
        opacity: 0.1,
        transitions: {
          elevationScale: 3000
        }
      }),
      noaaStations,
     ];

    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZXJpY2tlcm5leSIsImEiOiJja2FjbTNiMXcwMXp1MzVueDFjdDNtcW92In0.LW0qdB-2FmA3UK51M67fAQ';
    
    const [viewState, setViewState] = React.useState({
      longitude: -90,
      latitude: 30,
      zoom: 4,
      pitch: 60,
      bearing: -60,
    });


  const getTooltip = info => {
    if (!info.object) {
      return null;
    }
    return`\
    ${info.object.desc}
    ${info.object.id}
    ${info.object.elevation} elev m.`;
  };
  const onClick = useCallback(e => {
    setFeatures(currFeatures => {
    console.log(e);  
    return e;
    });
  }, []);

  const [selected, setSelected] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [showPopup, setShowPopup] = React.useState(true);
  const [features, setFeatures] = useState({});
  const [hoverInfo, setHoverInfo] = useState();  
  const deckRef = useRef(null);


  return (
    <>
    <DeckGL 
      ref={deckRef}
      initialViewState={viewState} 
      controller={true}
      layers={[noaaStations]}
      ContextProvider={MapContext.Provider}
      onClick={({ x, y, coordinate, object}) => object ? (setSelected({ x, y, coordinate, object })) : setSelected(null)}
      getTooltip={getTooltip} 
    >
      <Map reuseMaps
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100vw', height: '100vh'}}
        mapStyle="mapbox://styles/erickerney/cl0l6ydmk000d14slnsws819a"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}   
      >
       {/* {selected && (
          <Popup
            longitude={selected.coordinate[0]}
            latitude={selected.coordinate[1]}
            closeButton={false}
            anchor="right"
            offsetLeft={10}
            closeOnClick={true}
            onOpen = {(e, i) => console.log(selected.object)}
          >
            <div className="tooltip interactive">
              {showPopup && (
                <div>
                 <iframe 
                 src={`http://127.0.0.1:5000/${selected.object.desc}`} />
                </div>
              )}
            </div>
          </Popup>
        )} */}
        </Map>

    </DeckGL>
    <ControlPanel station={selected && selected.object.desc} />

    </>
  );
}
