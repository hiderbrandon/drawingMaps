import { useEffect, useState } from 'react';
import ReactMapGL , { Source, Layer , Popup} from 'react-map-gl';


function MapInstance() {
    const [selectedPoints, setSelectedPoints] = useState([]);

    const [lineData, setLineData] = useState({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [] // coordenadas de la línea
        }
      });

      const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        longitude: -76.534293,
        latitude: 3.372799,
        zoom: 15,});

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
     <ReactMapGL
      onClick={(event) => {
        const { lngLat } = event;
        setSelectedPoints([...selectedPoints, lngLat]);
        console.log(selectedPoints)

      }}
      mapboxAccessToken='pk.eyJ1IjoiaGlkZXJicmFuZG9uIiwiYSI6ImNsZHl1c3FqODB1eWQzb253c2x6cjlmMW0ifQ.evK8D5KqO4eFlp4vomMvNQ'
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
   
    {selectedPoints.map((point, index) => (
    <Popup
        key={`popup-${index}`}
        longitude={point.lng}
        latitude={point.lat}
        closeButton={false}>
        <div>Lat: {point.lat.toFixed(6)}</div>
        <div>Lng: {point.lng.toFixed(6)}</div>
    </Popup> ) )}
      
    </ReactMapGL>
   </div>
  );
}

export default MapInstance;

