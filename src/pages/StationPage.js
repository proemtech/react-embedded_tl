import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StationTable from "../components/StationTable";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { stationQuery } from "../services/queries/stationQuery";
import { stationNameQuery } from "../services/queries/stationNameQuery";

export default function StationPage() {
  const { locationId, type } = useParams();
  const [arrivalsData, setArrivalsData] = useState(null);
  const [departuresData, setDeparturesData] = useState(null);
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    async function getStationData(type) {
      const stationName = await fetchJsonResponse(stationNameQuery(locationId));
      setLocationName(stationName.TrainStation[0]?.OfficialLocationName);

      if (type === undefined || type === "arrivals") {
        const arrivals = await fetchJsonResponse(stationQuery(locationId, "Ankomst"));
        setArrivalsData(arrivals);
      }
      if (type === undefined || type === "departures") {
        const departures = await fetchJsonResponse(stationQuery(locationId, "Avgang"));
        setDeparturesData(departures);
      }
    }

    getStationData(type);
  }, [locationId, type]);

  if (type === "arrivals") {
    return (
      <div>
        {locationName ? <h2 className="locationId">{locationName}</h2> : <h2 className="locationId">{locationId}</h2>}
        {arrivalsData !== null ? <StationTable data={arrivalsData} type="arrivals" /> : <></>}
      </div>
    );
  }
  if (type === "departures") {
    return (
      <div>
        {locationName ? <h2 className="locationId">{locationName}</h2> : <h2 className="locationId">{locationId}</h2>}
        {departuresData !== null ? <StationTable data={departuresData} type="departures" /> : <></>}
      </div>
    );
  } else {
    return (
      <div>
        {locationName ? <h2 className="locationId">{locationName}</h2> : <h2 className="locationId">{locationId}</h2>}
        {arrivalsData !== null && departuresData !== null ? (
          <div className="content">
            <div className="half">
              {arrivalsData !== null ? <StationTable data={arrivalsData} type="arrivals" /> : <></>}
            </div>
            <div className="half">
              {departuresData !== null ? <StationTable data={departuresData} type="departures" /> : <></>}
            </div>
          </div>
        ) : (
          <div className="content">
            {type === "arrivals" && arrivalsData !== null ? (
              <StationTable data={arrivalsData} type="arrivals" />
            ) : (
              <></>
            )}
            {type === "departures" && departuresData !== null ? (
              <StationTable data={departuresData} type="departures" />
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    );
  }
}
