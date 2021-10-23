import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoogleMap, useJsApiLoader, Polyline, InfoWindow } from "@react-google-maps/api";
import { calcTrainStatus } from "../services/calcTrainStatus";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { getLocationsForTrainQuery } from "../services/queries/getLocationsForTrainQuery";
import { getTrainStationName } from "../services/getTrainStationName";
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
  const { trainIdent, searchDate } = useParams();
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
      const trainLocations = await fetchJsonResponse(
        getLocationsForTrainQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );
      const locationString = trainLocations?.INFO?.EVALRESULT[0]?.OrderedLocations;
      console.log(`${trainIdent}: ${locationString.split(",").join(", ")}`);

      // Get geodata for locations
      const geodata = await fetchJsonResponse(stationGeoDataQuery(locationString));
      // Get geodata for train
      const trainStatusResponse = await fetchJsonResponse(
        trainStatusQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );
      const status = await Promise.all(
        trainStatusResponse?.TrainAnnouncement?.map(async (item) => {
          item.LocationName = await getTrainStationName(item.LocationSignature);
          return item;
        })
      );
      setTrainStatusData(await calcTrainStatus(status[0]));
      const trainLocation = await fetchJsonResponse(
        stationGeoDataQuery(trainStatusResponse?.TrainAnnouncement[0]?.LocationSignature)
      );
      const trainPosition = convertWgs84(trainLocation?.TrainStation[0]?.Geometry?.WGS84);
      // Set up streaming data if null
      if (sseUrl === null) {
        console.log(`Updated at ${new Date().toLocaleTimeString()}`);
        setSseUrl(trainStatusResponse?.INFO?.SSEURL);
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
  }, [searchDate, sseUrl, trainIdent]);

  console.log(map);

  return isLoaded ? (
    <div>
      <div className="mapWindowHeader">
        <Clock />
      </div>

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
              <h3>
                {trainStatusData?.isDelayed ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="infoWindowIcon"
                      viewBox="0 0 20 20"
                      fill={trainStatusData?.textColor}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="infoWindowIcon"
                      viewBox="0 0 20 20"
                      fill={trainStatusData?.textColor}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
                Tåg {trainIdent}
              </h3>
              {trainStatusData && (
                <>
                  <p>
                    <b>
                      {trainStatusData?.activity === "Ankomst" ? "Ankom" : "Avgick"} {trainStatusData?.locationName}{" "}
                      {trainStatusData?.minutes < 0 ? trainStatusData?.minutes : `+${trainStatusData?.minutes}`}
                    </b>
                    <br />
                    kl. {new Date(trainStatusData?.timeAtLocation).toLocaleTimeString()}
                  </p>
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
