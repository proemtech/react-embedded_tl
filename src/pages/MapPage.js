import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoogleMap, useJsApiLoader, Polyline, InfoWindow } from "@react-google-maps/api";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { getLocationsForTrainQuery } from "../services/queries/getLocationsForTrainQuery";
import { stationGeoDataQuery } from "../services/queries/stationGeoDataQuery";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";
import { convertWgs84, getDateFormat } from "../utils/common";
import { darkMap } from "../utils/mapStyles";
import Clock from "../components/Clock";

// Map settings
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const infoWindowOptions = {
  styles: darkMap,
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
  const [sseUrl, setSseUrl] = useState(null);
  const [trainMarker, setTrainMarker] = useState(null);
  const [trainStatusData, setTrainStatusData] = useState({});
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

  useEffect(() => {
    // Prepare eventsource for later use
    let eventSource;
    // Fetch data
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
      setTrainStatusData(trainStatus?.TrainAnnouncement[0]);
      const trainLocation = await fetchJsonResponse(
        stationGeoDataQuery(trainStatus?.TrainAnnouncement[0]?.LocationSignature)
      );
      const trainPosition = convertWgs84(trainLocation?.TrainStation[0]?.Geometry?.WGS84);
      // Set up streaming data if null
      if (sseUrl === null) {
        console.log(`Updated at ${new Date().toLocaleTimeString()}`);
        setSseUrl(trainStatus?.INFO?.SSEURL);
      }
      // Set point of train
      setTrainMarker(trainPosition);
      // Center map on train position
      setMapCenter(trainPosition);
      setMapZoom(5);
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

    if (sseUrl) {
      // Set event source
      eventSource = new EventSource(sseUrl);

      // Handle error
      eventSource.onerror = (error) => {
        console.error(error);
        // TODO: Add some kind of error display
      };

      // Message on stream open
      eventSource.onopen = () => console.log(`Stream open at ${new Date().toLocaleTimeString()}`);

      // Message handler
      eventSource.onmessage = () => {
        console.log(`Stream ping at ${new Date().toLocaleTimeString()}`);
        getMapData();
      };
    }
  }, [sseUrl, trainIdent]);

  //console.log(map);

  return isLoaded ? (
    <div>
      <Clock styles={{ zIndex: 99 }} />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Polyline path={pathCoordinates} options={polylineOptions} />
        {trainMarker && (
          <InfoWindow options={infoWindowOptions} position={trainMarker}>
            <div className="infoWindow">
              <h1>Tåg {trainIdent}</h1>
              {trainStatusData && (
                <>
                <p>{trainStatusData.ActivityType === "Ankom" ? ("Ankom") : ("Avgick")} {trainStatusData.LocationSignature} {new Date(trainStatusData.TimeAtLocationWithSeconds).toLocaleTimeString()}</p>
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}
