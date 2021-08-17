import * as React from "react";
import { useState, useCallback } from "react";
import MapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";

import Util from "../components/Util";

import Pin from "../components/Pin";

const SimpleMap = (props) => {
  const [viewport, setViewport] = useState({
    width: "100",
    height: "400",
    latitude: props.latitude,
    longitude: props.longitude,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });
  const [marker, setMarker] = useState({
    latitude: props.latitude,
    longitude: props.longitude,
  });
  const TOKEN = process.env.REACT_APP_MAPBOX_API_TOKEN;

  const onMarkerDragEnd = useCallback((event) => {
    Util.getPlaceName(event.lngLat[0], event.lngLat[1]).then((data) => {
      props.sendLocation({ cordinate: event.lngLat, location_name: data });
    });

    setMarker({
      latitude: event.lngLat[1],
      longitude: event.lngLat[0],
    });
  }, []);

  return (
    <>
      <MapGL
        {...viewport}
        width="500px"
        height="500px"
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        onViewportChange={setViewport}
        mapboxApiAccessToken={TOKEN}
      >
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          offsetTop={-20}
          offsetLeft={-10}
          draggable
          onDragEnd={onMarkerDragEnd}
        >
          <Pin size={20} />
        </Marker>
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <div className="nav" style={navStyle}>
          <NavigationControl />
        </div>
      </MapGL>
    </>
  );
};

const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px",
};

export default SimpleMap;
