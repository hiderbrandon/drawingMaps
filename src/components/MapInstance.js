import { useCallback, useEffect, useState } from 'react';
import Map , { Source, Layer , Popup, useControl , FullscreenControl} from 'react-map-gl';
import { myConfig } from "../config.js";

import DrawControl from './Menu.js';
import ControlPanel from './ControlPanel.js';

const TOKEN = myConfig.mapboxToken;

function MapInstance() {
   
  const [selectedPoints, setSelectedPoints] = useState([]);
   
  const [showPopup, setShowPopup] = useState(true);

  const [lineData, setLineData] = useState({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [] // coordenadas de la línea
        }
      });

  const [viewport, setViewport] = useState({
        width: '100vw',
        height: '50vh',
        longitude: -76.534293,
        latitude: 3.372799,
        zoom: 15,});
  const [features, setFeatures] = useState({});

  const onUpdate = useCallback(e => {
          setFeatures(currFeatures => {
            const newFeatures = {...currFeatures};
            for (const f of e.features) {
              newFeatures[f.id] = f;
            }
            return newFeatures;
          });
        }, []);
      
  const onDelete = useCallback(e => {
          setFeatures(currFeatures => {
            const newFeatures = {...currFeatures};
            for (const f of e.features) {
              delete newFeatures[f.id];
            }
            return newFeatures;
          });
        }, []);

  useEffect(() => {
        if (selectedPoints.length > 0 ) {
          const newLineData = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: selectedPoints.map((point) => [point.lng, point.lat])
            }
          };
          setLineData(newLineData);
        }
      }, [selectedPoints]);
      

  return (
   <div>
     <Map
      onClick={(event) => {
        const { lngLat } = event;
        setSelectedPoints([...selectedPoints, lngLat]);
        console.log(selectedPoints)

      }}
      mapboxAccessToken= {TOKEN} 
      initialViewState={{
          longitude: -76.534293,
          latitude: 3.372799,
          zoom: 15,
      }}
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewportChange={(viewport) => setViewport(viewport)}
    >
    
    
    <Source id="my-data" type="geojson" data={lineData}>
        <Layer
          id="line-layer"
          type="line"
          source="my-data"
          paint={{
            'line-color': '#f00',
            'line-width': 2
          }}
        />
    </Source>
   
    <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{}}
          defaultMode="draw_LineStrings"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
    <ControlPanel polygons={Object.values(features)} />
    
    </Map>
   

   </div>
  ); 
}

export default MapInstance;

