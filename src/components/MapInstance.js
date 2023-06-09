import { useCallback, useEffect, useRef, useState } from 'react';
import Map, { useControl, Source, Layer, FullscreenControl, GeolocateControl } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { myConfig } from "../config.js";
import lineOffset from '@turf/line-offset';
import { lineString } from '@turf/helpers';
import DrawControl from './DrawControl.js';


const TOKEN = myConfig.mapboxToken;

function MapInstance() {

  const [selectedPoints, setSelectedPoints] = useState([]);
  const [offsetLine, setOffsetLine] = useState(null);
  const [line, setLine] = useState(null);

  const [lineData, setLineData] = useState({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [] // coordenadas de la línea
    }
  });

  useEffect(() => {
    if (selectedPoints.length > 2) {
      const offset = lineOffset(line, 0.01, { units: 'kilometers' });
      setOffsetLine(offset);
    }
  }, [lineData, selectedPoints]);

  useEffect(() => {
    if (selectedPoints.length >= 2) {
      const line = lineString(selectedPoints.map(p => [p.lng, p.lat]), { "stroke": "#F00" });
      setLine(line);
    }
  }, [selectedPoints]);

  useEffect(() => {
    if (selectedPoints.length > 0) {
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


  const onUpdate = useCallback(e => {
    setLineData(currFeatures => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback(e => {
    setLineData(currFeatures => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const handleClick = (event) => {
    const { lngLat } = event;
    setSelectedPoints([...selectedPoints, lngLat]);
    console.log(selectedPoints)

  }

  return (
    <div>
      <Map
        onClick={handleClick}
        mapboxAccessToken={TOKEN}
        initialViewState={{
          longitude: -76.534293,
          latitude: 3.372799,
          zoom: 15,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <FullscreenControl></FullscreenControl>
        <GeolocateControl></GeolocateControl>

        <DrawControl
          position="top-left"
          displayControlsDefault={true}
          controls={{
            line_string: true,
          }}
          defaultMode="draw_line_string"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />

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
              'line-width': 2,
            }}
          />
        </Source>


      </Map>


    </div>
  );
}

export default MapInstance;