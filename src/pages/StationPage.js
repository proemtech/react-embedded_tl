import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StationTable from "../components/StationTable";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { stationQuery } from "../services/queries/stationQuery";

export default function StationPage() {
  const { locationId, type } = useParams();
  const [arrivalsData, setArrivalsData] = useState(null);
  const [departuresData, setDeparturesData] = useState(null);

  useEffect(() => {
    if (type === "arrivals") setDeparturesData(null);
    if (type === "departures") setArrivalsData(null);
    async function getStationData(type) {
      if (type === null || type === "arrivals") {
        console.log(`type: ${type}`);
        const arrivals = await fetchJsonResponse(stationQuery(locationId, "Ankomst"));
        setArrivalsData(arrivals);
      }
      if (type === null || type === "departures") {
        const departures = await fetchJsonResponse(stationQuery(locationId, "Avgang"));
        setDeparturesData(departures);
      }
    }

    getStationData(type);
  }, [locationId, type]);

  return (
    <div>
      <h4>Location ID: {locationId}</h4>
      {arrivalsData !== null ? <StationTable data={arrivalsData} type="arrivals" /> : <></>}
      {departuresData !== null ? <StationTable data={departuresData} type="departures" /> : <></>}
    </div>
  );
}
