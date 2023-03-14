import { useEffect, useState } from 'react';
import Map , { Source, Layer , FullscreenControl} from 'react-map-gl';
import { myConfig } from "../config.js";

const TOKEN = myConfig.mapboxToken;

function MapInstance() {
   
  const [selectedPoints, setSelectedPoints] = useState([]);
   
  const [lineData, setLineData] = useState({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [] // coordenadas de la línea
        }
      });


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
  
  const handleClick = (event) => {
    const { lngLat } = event;
    setSelectedPoints([...selectedPoints, lngLat]);
    console.log(selectedPoints)

  }

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

    
    </Map>
   

   </div>
  ); 
}

export default MapInstance;

