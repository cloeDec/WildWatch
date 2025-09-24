import React from 'react';
import Mapbox from "@rnmapbox/maps";

interface AccuracyCircleProps {
  coordinates: [number, number];
  accuracy: number;
}

export const AccuracyCircle: React.FC<AccuracyCircleProps> = ({
  coordinates,
  accuracy,
}) => {
  if (!accuracy) return null;

  return (
    <Mapbox.ShapeSource
      id="accuracy-circle"
      shape={{
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        properties: {
          radius: accuracy,
        },
      }}
    >
      <Mapbox.CircleLayer
        id="accuracy-circle-layer"
        style={{
          circleRadius: [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            ["/", ["get", "radius"], 4],
            20,
            ["get", "radius"],
          ],
          circleColor: "rgba(0, 122, 255, 0.1)",
          circleStrokeColor: "rgba(0, 122, 255, 0.3)",
          circleStrokeWidth: 1,
        }}
      />
    </Mapbox.ShapeSource>
  );
};