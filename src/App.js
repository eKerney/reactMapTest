import * as React from 'react';
import ReactDOM from "react-dom";
import Map, {Source, Layer, Popup} from 'react-map-gl';
import { MapContext } from 'react-map-gl/dist/esm/components/map';
import DeckGL from '@deck.gl/react';
import {render} from 'react-dom';
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import {ScatterplotLayer} from '@deck.gl/layers';
import {CSVLoader} from '@loaders.gl/csv';
import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import ControlPanel from './control-panel';

const HEX_DATA = "https://raw.githubusercontent.com/chriszrc/foss4g-2021-react-mapbox/main/deck-layers-map/public/data/hex_radio_coverage.json";
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
      radiusMinPixels: 5,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => [d['lon'], d['lat']],
      getRadius: d => Math.sqrt(d.exits),
      getFillColor: d => [(255-(d['elevation']*.1)), (140+(d['elevation']*.001)), (d['elevation']* .50)],
      getLineColor: d => [0, 0, 0],
      //onHover: (info, event) => console.log('Hovered:', info.object),
      //onClick: (info, event) => onClick(info)
    });  
   
    const layers = [
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
    
    const [viewState, setViewState] = React.useState({
      longitude: -95,
      latitude: 35,
      zoom: 3,
      pitch:40,
      bearing: 0,
    });
    
  const [hoverInfo, setHoverInfo] = useState();  
  const deckRef = useRef(null);

  const getTooltip = info => {
    if (!info.object) {
      return null;
    }
    return `\
    ${info.object.desc}
    ${info.object.id}
    ${info.object.elevation}`;
  };

  // const onClick = info => {
  //   if (!info.object) {
  //     return null;
  //   }
  //   console.log(info.devicePixel);
  //   //console.log(event);
  //   return (
  //     <div anchor="top" className="tooltip interactive" style={{left: info.devicePixel[0], top: info.devicePixel[0]}}>
  //       <div key={info.object.desc}>
  //         <h5>{info.object.desc}</h5>
  //         <div>{info.object.id}</div>
  //         <div>{info.object.elevation}</div>
  //      </div>
  //     </div>
  //   )
  //   };
  

  const [selected, setSelected] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [showPopup, setShowPopup] = React.useState(true);

  // next example
  const imageUrl = "127.0.0.1:5000/RIFLE%20GARFIELD%20CO%20AP";
  const [img, setImg] = useState();
  const fetchImage = async () => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
  };

  useEffect(() => {
    fetchImage();
  }, []);

 


  const queryClient = new QueryClient();
  const [imageData, setImageData] = useState();
  function Example() {
       const { isLoading, error, data } = useQuery('repoData', () =>
          fetch('127.0.0.1:5000/RIFLE%20GARFIELD%20CO%20AP')
          .then(response => response.blob())
          .then(image => URL.createObjectURL(image))
          .then(localUrl => setImageData(localUrl))
          .then(res => console.log(res))
            // // Create a local URL of that image
            // const localUrl = URL.createObjectURL(image);
            // setImageData(localUrl);

        //  .then(res => res.blob())
        //  .then(resBlob => URL.createObjectURL(resBlob))
        //  .then(ImageObjectURL => setImg(ImageObjectURL))
        //  .then(res => console.log(img))
        //   //URL.createObjectURL(res.blob())
         //.then(res => console.log(res))
       );

       if (isLoading) return 'Loading...';
       if (error) return 'An error has occurred: ' + error.message;
       return (
          <div>{data}
            
           <img src={data}/>
          </div>
       )
     };

  return (
    <>


    <DeckGL 
      ref={deckRef}
      initialViewState={viewState} 
      controller={true}
      layers={[layerStations]}
      ContextProvider={MapContext.Provider}
      onClick={({ x, y, coordinate, object}) => {
        // TODO: figure out how to get rid of extra click event
        console.log(queryClient, object);
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
       {selected && (
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
        )}
        </Map>

      
      
    </DeckGL>
    <ControlPanel />
    </>
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

