import * as React from 'react';
import area from '@turf/area';

function ControlPanel(props) {
  let polygonArea = 0;
  for (const polygon of props.polygons) {
    polygonArea += area(polygon);
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Draw Polygon</h3>
            </div>
            <div className="card-body">
              {polygonArea > 0 && (
                <p>
                  {Math.round(polygonArea * 100) / 100} <br />
                  square meters
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
