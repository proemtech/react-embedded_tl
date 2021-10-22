import React, { useCallback,useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from "@react-google-maps/api";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { getLocationsForTrainQuery } from "../services/queries/getLocationsForTrainQuery";
import { stationGeoDataQuery } from "../services/queries/stationGeoDataQuery";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";
import { convertWgs84, getDateFormat } from "../utils/common";
import { darkMap } from "../utils/mapStyles";

// Map settings
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const mapOptions = {
  styles: darkMap,
  disableDefaultUI: true,
  zoomControl: true,
};

const polylineOptions = {
  strokeColor: "#FFFFFF",
  strokeOpacity: 0.8,
  strokeWeight: 3,
  fillColor: "#FFFFFF",
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1,
};

export default function MapPage() {
  const { trainIdent } = useParams();
  // Sveriges geografiska mittpunkt

  const [mapCenter, setMapCenter] = useState({
    lat: 62.3875,
    lng: 16.325556,
  });
  const [mapZoom, setMapZoom] = useState(5);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [trainMarker, setTrainMarker] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  console.log(map)

  useEffect(() => {
    async function getMapData() {
      // Get locations for train ident
      const today = getDateFormat(new Date());
      const trainLocations = await fetchJsonResponse(getLocationsForTrainQuery(trainIdent, today));
      const locationString = trainLocations?.INFO?.EVALRESULT[0]?.OrderedLocations;
      console.log(`${trainIdent}: ${locationString.split(",").join(", ")}`);

      // Get geodata for locations
      const geodata = await fetchJsonResponse(stationGeoDataQuery(locationString));
      // Get geodata for train
      const trainStatus = await fetchJsonResponse(trainStatusQuery(trainIdent, today));
      const trainLocation = await fetchJsonResponse(
        stationGeoDataQuery(trainStatus?.TrainAnnouncement[0]?.LocationSignature)
      );
      const trainPosition = convertWgs84(trainLocation?.TrainStation[0]?.Geometry?.WGS84);

      setTrainMarker(trainPosition);
      // Center map on train position
      setMapCenter(trainPosition);
      setMapZoom(5)
      let output = [];
      geodata?.TrainStation?.map((data) => {
        // Converting POINT string to latitude/longitude
        const point = data?.Geometry?.WGS84.split(" ");
        const lng = parseFloat(point[1].substring(1));
        const lat = parseFloat(point[2]);

        const geo = {
          locationName: data?.AdvertisedLocationName,
          locationSignature: data?.LocationSignature,
          lat: lat,
          lng: lng,
        };
        output.push(geo);
        return null;
      });
      setPathCoordinates(output);
    }

    try {
      getMapData();
    } catch (error) {
      console.error(error);
    }
  }, [trainIdent]);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Polyline path={pathCoordinates} options={polylineOptions} />
        {trainMarker && <Marker position={trainMarker} />}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}
