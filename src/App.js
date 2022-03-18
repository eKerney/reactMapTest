import * as React from 'react';
import Map, {Source, Layer, Popup} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {render} from 'react-dom';
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import {ScatterplotLayer} from '@deck.gl/layers';
import {CSVLoader} from '@loaders.gl/csv';
import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
//import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const geojson = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-83.05, 42.33]}}
  ]
};
const layerStyle = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 20,
    'circle-color': 'red'
  }
};
const data = [
  {sourcePosition: [-150, 41], targetPosition: [-50, 43]}
];
const HEX_DATA =
  "https://raw.githubusercontent.com/chriszrc/foss4g-2021-react-mapbox/main/deck-layers-map/public/data/hex_radio_coverage.json";
  const stationData = 'https://raw.githubusercontent.com/eKerney/reactMapTest/main/src/noaaAptEditedCol.csv';
  const testData = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';


  
  export default function App() {
    const layerStations = new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: fetch(stationData)
        .then(response => response.arrayBuffer())
        .then(buffer => CSVLoader.parse(buffer)),
      pickable: true,
      opacity: 0.5,
      stroked: true,
      filled: true,
      radiusScale: 6,   
      radiusMinPixels: 10,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => [d['lon'], d['lat']],
      getRadius: d => Math.sqrt(d.exits),
      getFillColor: d => [(255-(d['elevation']*.1)), (140+(d['elevation']*.001)), (d['elevation']* .50)],
      getLineColor: d => [0, 0, 0],
      onHover: (info, event) => console.log('Hovered:', info.object),
      onClick: ({object}) => object
    });  
   
    const layerUK = new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: fetch(testData)
        .then(response => response.arrayBuffer())
        .then(buffer => CSVLoader.parse(buffer)),
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 10,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => [d['lng'], d['lat']],
      getRadius: d => Math.sqrt(d.exits),
      getFillColor: d => [255, 140, 0],
      getLineColor: d => [0, 0, 0]
    });

    const lineTest = new LineLayer({id: 'line-layer', data});

    const layers = [
    new LineLayer({id: 'line-layer', data}),
     new H3HexagonLayer({
      id: "H3 Radio Sources",
      data: HEX_DATA,
      pickable: true,
      wireframe: false,
      filled: true,
      extruded: true,
      elevationScale: 10000,
      getHexagon: (d) => d.hex,
      getFillColor: (d) => [255, (1 - d.count / 50) * 255, 0],
      getElevation: (d) => d.count,
      opacity: 0.2,
    })
    ];


    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZXJpY2tlcm5leSIsImEiOiJja2FjbTNiMXcwMXp1MzVueDFjdDNtcW92In0.LW0qdB-2FmA3UK51M67fAQ';
    // const [viewState, setViewState] = React.useState({
    //   longitude: -83.05,
    //   latitude: 42.33,
    //   zoom: 11
    // });

    const [hoverInfo, setHoverInfo] = useState();
    
    const [viewState, setViewState] = React.useState({
      longitude: -85,
      latitude: 35,
      zoom: 4,
      pitch: 60,
      bearing: -50,
    });
//***
  const deckRef = useRef(null);

  const onClick = useCallback(event => {
    const pickInfo = deckRef.current.pickObject({
      x: event.clientX,
      y: event.clientY,
      radius: 1
    });
    console.log(pickInfo.coordinate, pickInfo.object);
  }, [])

  const onHover = useCallback(event => {
    const hoverInfo = deckRef.current.onHover({
      x: event.clientX,
      y: event.clientY,
      radius: 1
    });
    console.log(hoverInfo.coordinate, hoverInfo.object);
  }, [])


  // function getTooltip({object}) {
  //   return object && object.properties;
  // }

  const getTooltip = info => {
    if (!info.object) {
      return null;
    }


    return `${info.object.lat} per 100K residents`;
  };
  
//*** 

  return (
   
    /* DECKGL WORKING EXAMPLE */
    <div onClick={onClick}>
    <Map
    {...viewState}
    onMove={evt => setViewState(evt.viewState)}
      style={{width: '100vw', height: '100vh'}}
      mapStyle="mapbox://styles/erickerney/cl0l6ydmk000d14slnsws819a"
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
    >
      
    <DeckGL 
      ref={deckRef}
      initialViewState={viewState} 
      controller={true}
      layers={[layerStations]}
      getTooltip={getTooltip}
      // getTooltip={() => ({
      //   text: 'Testing tooltip text'
      // })}
      >
        
      <Map 
        mapStyle="mapbox://styles/erickerney/cl0l6ydmk000d14slnsws819a" 
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        
      />
     
      {/* <LineLayer id="line-layer" data={data} /> */}
    </DeckGL>
    
    </Map>
  </div>

    /* REACT MAP GL WORKING EXAMPLE */
    // <Map
    // {...viewState}
    // onMove={evt => setViewState(evt.viewState)}
    //   style={{width: '100vw', height: '100vh'}}
    //   mapStyle="mapbox://styles/erickerney/cl0l6ydmk000d14slnsws819a"
    //   mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
    // >
   
    // <Source id="my-data" type="geojson" data={geojson}>
    //   <Layer {...layerStyle} />
    // </Source>
    // </Map>
  );
}

/* REACT QUERY EXAMPLE */

// const queryClient = new QueryClient()
 
//  export default function App() {
//    return (
//      <QueryClientProvider client={queryClient}>
//        <Example />
//      </QueryClientProvider>
//    )
//  }
 
//  function Example() {
//    const { isLoading, error, data } = useQuery('repoData', () =>
//      fetch('https://api.github.com/repos/tannerlinsley/react-query').then(res =>
//        res.json().then(console.log('fetching fetch :)'))
//      )
//    )
 
//    if (isLoading) return 'Loading...'
 
//    if (error) return 'An error has occurred: ' + error.message
 
//    return (
//      <div>
//        <h1>{data.name}</h1>
//        <p>{data.description}</p>
//        <strong>👀 {data.subscribers_count}</strong>{' '}
//        <strong>✨ {data.stargazers_count}</strong>{' '}
//        <strong>🍴 {data.forks_count}</strong>
//      </div>
//    )
//  }

