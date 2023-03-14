import { useEffect, useState } from 'react';
import Map , { useControl, Source, Layer , FullscreenControl} from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { myConfig } from "../config.js";
import lineOffset from '@turf/line-offset';
import { lineString } from '@turf/helpers';
import { getCoords } from '@turf/invariant';

const TOKEN = myConfig.mapboxToken;

function MapInstance() {
  
  const [drawingMode, setDrawingMode] = useState("line");

  const [selectedPoints, setSelectedPoints] = useState([  ]);
   
  const [lineData, setLineData] = useState({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[-76.534293,3.372799] , [-76.6,3.38]] // coordenadas de la línea
        }
      });
  const [offsetLine, setOffsetLine] = useState(null);

  useEffect(() => {
    if (lineData) {
      const offset = lineOffset(lineData, 0.01, { units: 'kilometers' });
      setOffsetLine(offset);
    }
  }, [lineData]);



  useEffect(() => {
        if (selectedPoints.length > 0 ) {
          const line = lineString(selectedPoints.map(p => [p.lng, p.lat]), { "stroke": "#F00" });
          
        }
      }, [selectedPoints]);
  
  const handleClick = (event) => {
        if (drawingMode === 'line') {
          const { lngLat } = event;
          setSelectedPoints([...selectedPoints, lngLat]);
          console.log(selectedPoints);
        }
      };


  return (
   <div>
     <Map
      onClick={handleClick}
      mapboxAccessToken= {TOKEN} 
      initialViewState={{
          longitude: -76.534293,
          latitude: 3.372799,
          zoom: 15,
      }}
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
    
    <FullscreenControl></FullscreenControl>
    
    
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
    <Source type="geojson" data={offsetLine}>
            <Layer
              id="offset-line"
              type="line"
              paint={{
                'line-color': '#d703fc',
                'line-width': 5,
              }}
            />
          </Source>

    
    </Map>
   

   </div>
  ); 
}

export default MapInstance;

