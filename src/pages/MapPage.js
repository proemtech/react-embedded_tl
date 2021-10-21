import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useState } from "react/cjs/react.development";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { getLocationsForTrainQuery } from "../services/queries/getLocationsForTrainQuery";
import { stationGeoDataQuery } from "../services/queries/stationGeoDataQuery";
import { getDateFormat } from "../utils/common";

export default function MapPage() {
  const { trainIdent } = useParams();
  const [locString, setLocString] = useState('')

  useEffect(() => {
    async function getMapData() {
      // Get locations for train ident
      const today = getDateFormat(new Date());
      const trainLocations = await fetchJsonResponse(getLocationsForTrainQuery(trainIdent, today));
      const locationString = trainLocations?.INFO?.EVALRESULT[0]?.OrderedLocations;
      console.log(`${trainIdent}: ${locationString}`);

      // Get geodata for locations
      const geodata = await fetchJsonResponse(stationGeoDataQuery(locationString));
      let output = ''
      geodata?.TrainStation?.map((data) => {
        // Converting POINT string to latitude/longitude
        const point = data?.Geometry?.WGS84.split(" ");
        const lng = parseFloat(point[1].substring(1))
        const lat = parseFloat(point[2]);

        const geo = {
          "locationName": data?.AdvertisedLocationName,
          "locationSignature": data?.LocationSignature,
          "lat": lat,
          "lng": lng,
        }
        console.log(geo)
        output += `${geo.lat},${geo.lng}\n`;
        return null;
      });
      setLocString(output)
    }

    try {
      getMapData();
    } catch (error) {
      console.error(error);
    }
  }, [trainIdent]);

  return (<div><pre>{locString}</pre></div>);
}
