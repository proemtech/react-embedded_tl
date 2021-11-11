import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
//import { GoogleMap, useJsApiLoader, Polyline, InfoWindow } from "@react-google-maps/api";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import { calcTrainStatus } from "../services/calcTrainStatus";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { getLocationsForTrainQuery } from "../services/queries/getLocationsForTrainQuery";
import { getTrainStationName } from "../services/getTrainStationName";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";
import { convertWgs84, getBearing, getDateFormat, getDistance, getMiddlePoint } from "../utils/common";
import Clock from "../components/Clock";

// Leaflet marker icon fix
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

// Set default map center
const mapDefaultCenter = {
  lat: 62.3875,
  lng: 16.325556,
};

const mapDefaultZoom = 6;

// Page
export default function MapPage() {
  const { trainIdent, searchDate } = useParams();
  const [isInitialRender, setInitialRender] = useState(true);
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [sseUrl, setSseUrl] = useState(null);
  const [trainMarker, setTrainMarker] = useState(null);
  const [trainStatus, setTrainStatus] = useState({});
  const [trainBearing, setTrainBearing] = useState(0);

  if (map && mapCenter !== null) {
    if (isInitialRender) {
      map.flyTo(mapCenter);
      if (mapBounds !== null) {
        map.fitBounds(mapBounds);
      }
    }
  }

  useEffect(() => {
    // Prepare eventsource for later use
    let eventSource;

    // Get station geodata
    async function getStationGeoData(locationString) {
      const locations = locationString?.split(",");
      //console.log(locations)
      if (locations !== undefined) {
        let output = [];
        locations.forEach(async (location) => {
          const station = await getTrainStationName(location);
          output.push(station);
        });
        return output;
      }
      return null;
    }

    // Fetch data
    async function getMapData() {
      // Get locations for train ident
      const trainLocations = await fetchJsonResponse(
        getLocationsForTrainQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );
      const locationString = trainLocations?.INFO?.EVALRESULT[0]?.OrderedLocations;
      // Get geodata for locations
      //const geodata = await fetchJsonResponse(stationGeoDataQuery(locationString));
      const geodata = await getStationGeoData(locationString);
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

      setTrainStatus(await calcTrainStatus(status[0]));
      const trainLocation = await getStationGeoData(trainStatusResponse?.TrainAnnouncement[0]?.LocationSignature);
      //console.log(trainLocation)
      // TODO: Fix alternate location here.
      const trainPosition =
        trainLocation !== null ? convertWgs84(trainLocation[0]?.Geometry?.WGS84) : { lat: 0.0, lng: 0.0 };
      // Set up streaming data if null
      if (sseUrl === null) {
        console.log(`Updated at ${new Date().toLocaleTimeString()}`);
        setSseUrl(trainStatusResponse?.INFO?.SSEURL);
      }
      // Set point of train

      if (trainStatusResponse?.TrainAnnouncement[0]?.ActivityType === "Ankomst") {
        setTrainMarker(trainPosition);
        setMapCenter(trainPosition);
      }
      if (trainStatusResponse?.TrainAnnouncement[0]?.ActivityType === "Avgang") {
        //console.log(`Avgång ${trainStatusResponse?.TrainAnnouncement[0]?.LocationSignature}`);
        // Get index of current position
        const index = geodata?.findIndex(
          (x) => x.LocationSignature === trainStatusResponse?.TrainAnnouncement[0]?.LocationSignature
        );
        const currentLatLng = convertWgs84(geodata[index].Geometry.WGS84);
        const nextLatLng = convertWgs84(geodata[index + 1].Geometry.WGS84);
        const halflingLatLng = getMiddlePoint(currentLatLng, nextLatLng);
        const markerBearing = getBearing(currentLatLng, nextLatLng);
        if (markerBearing) setTrainBearing(markerBearing);

        //console.log(currentLatLng, nextLatLng, halflingLatLng)
        //console.log(`${trainStatusResponse?.TrainAnnouncement[0]?.LocationSignature} is at index ${index}`);
        //console.log(`Next is ${geodata[index + 1].LocationSignature}`);
        setTrainMarker(halflingLatLng);
        if (!isInitialRender) {
          setMapCenter(halflingLatLng);
        }
      }
      // Center map on train position
      const startLatLng = convertWgs84(geodata[0]?.Geometry?.WGS84);
      const endLatLng = convertWgs84(geodata[geodata?.length - 1].Geometry.WGS84);
      if (startLatLng && endLatLng) {
        const centerLatLng = getMiddlePoint(startLatLng, endLatLng);
        if (isInitialRender) {
          setMapBounds([startLatLng, endLatLng]);
          setMapCenter(centerLatLng);
          const distance = getDistance(startLatLng, endLatLng);
          const bearing = getBearing(startLatLng, endLatLng);
          console.log(
            `From start to end\nDistance: ${(distance / 1000).toFixed(1)} km\nBearing: ${bearing.toFixed(0)} deg`
          );
          setInitialRender(false);
        }
      }

      // Set path coordinates
      let output = [];
      geodata?.map((data) => {
        const position = convertWgs84(data?.Geometry?.WGS84);

        const geo = {
          locationName: data?.AdvertisedLocationName,
          locationSignature: data?.LocationSignature,
          lat: position.lat,
          lng: position.lng,
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
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("Stream closed.");
      }
    };
  }, [isInitialRender, searchDate, sseUrl, trainIdent]);

  // Set doc title
  if (trainStatus?.activity !== undefined) {
    document.title = `Tåg ${trainIdent}: ${trainStatus.activity === "Ankomst" ? "*" : ""}${trainStatus.location} ${
      trainStatus.prefix
    }${trainStatus.minutes}`;
  } else {
    document.title = `Tåg ${trainIdent}`;
  }

  return pathCoordinates ? (
    <div>
      <div className="content mapWindowHeader">
        <div className="half">
          <h3>
            <Link to={`/train/${trainIdent}${searchDate !== undefined ? `/${searchDate}` : ""}`} className="locationId">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mapWindowHeaderIcon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Tillbaka till tidtabell {trainIdent}
            </Link>
          </h3>
        </div>
        <div className="half">
          <Clock />
        </div>
      </div>
      <div className="map">
        <MapContainer
          center={mapCenter ? mapCenter : mapDefaultCenter}
          zoom={mapDefaultZoom}
          scrollWheelZoom={true}
          zoomControl={false}
          onZoomEnd={(e) => console.log(e)}
          onMoveEnd={(e) => console.log(e)}
          whenCreated={setMap}
        >
          <TileLayer
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            url="https://api.mapbox.com/styles/v1/jewenson/ckv9juidr69jm15nz4hhtx232/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamV3ZW5zb24iLCJhIjoiY2tidGp3Y2xmMGFyNDJybGNuZGZqZW1uNyJ9.yXdCo-Spk2F-YSSbmCKCBg"
          />
          <Polyline positions={pathCoordinates} color={"white"} />
          {trainMarker && (
            <>
              <Marker position={trainMarker}>
                <Tooltip permanent>
                  <div className="infoWindow">
                  <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="infoWindowIcon"
                        viewBox="0 0 20 20"
                        fill={trainStatus?.textColor}
                        style={{ transform: `rotate(${trainBearing}deg)` }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    
                      <b>
                        {trainStatus?.activity === "Ankomst" ? "Ankom" : "Avgick"}&nbsp;
                        {trainStatus?.locationName}&nbsp;
                        {trainStatus?.minutes < 0 ? trainStatus?.minutes : `+${trainStatus?.minutes}`}
                      </b>
                    </span>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="infoWindow">
                    <h3>
                      {trainStatus?.isDelayed ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="infoWindowIcon"
                            viewBox="0 0 20 20"
                            fill={trainStatus?.textColor}
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
                            fill={trainStatus?.textColor}
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
                    <p>
                      <b>
                        {trainStatus?.activity === "Ankomst" ? "Ankom" : "Avgick"}{" "}
                        <Link to={`/station/${trainStatus?.location}`}>{trainStatus?.locationName}</Link>{" "}
                        {trainStatus?.minutes < 0 ? trainStatus?.minutes : `+${trainStatus?.minutes}`}
                      </b>
                      <br />
                      kl. {new Date(trainStatus?.timeAtLocation).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  ) : (
    <>
      <div className="content mapWindowHeader">
        <div className="half">
          <h3>
            <Link to={`/train/${trainIdent}${searchDate !== undefined ? `/${searchDate}` : ""}`} className="locationId">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mapWindowHeaderIcon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Tillbaka till tidtabell {trainIdent}
            </Link>
          </h3>
        </div>
        <div className="half">
          <Clock />
        </div>
      </div>
    </>
  );

  /* return isLoaded ? (
    <div>
      <div className="content mapWindowHeader">
        <div className="half">
          <h3>
            <Link to={`/train/${trainIdent}${searchDate !== undefined ? `/${searchDate}` : ""}`} className="locationId">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mapWindowHeaderIcon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Tillbaka till tidtabell {trainIdent}
            </Link>
          </h3>
        </div>
        <div className="half">
          <Clock />
        </div>
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
                {trainStatus?.isDelayed ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="infoWindowIcon"
                      viewBox="0 0 20 20"
                      fill={trainStatus?.textColor}
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
                      fill={trainStatus?.textColor}
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
              {trainStatus && (
                <>
                  <p>
                    <b>
                      {trainStatus?.activity === "Ankomst" ? "Ankom" : "Avgick"} {trainStatus?.locationName}{" "}
                      {trainStatus?.minutes < 0 ? trainStatus?.minutes : `+${trainStatus?.minutes}`}
                    </b>
                    <br />
                    kl. {new Date(trainStatus?.timeAtLocation).toLocaleTimeString()}
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
  ); */
}
