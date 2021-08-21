import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StationBoard from "../components/StationBoard";
import { getDateFormat } from "../utils/common";
import { calcTrainStatus } from "../services/calcTrainStatus";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { stationQuery } from "../services/queries/stationQuery";
import { stationNameQuery } from "../services/queries/stationNameQuery";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";

export default function StationPage() {
  const { locationId, type } = useParams();
  const [arrivalsData, setArrivalsData] = useState(null);
  const [departuresData, setDeparturesData] = useState(null);
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    let interval;

    async function getTrainState(trainIdent, searchDate) {
      if (searchDate !== undefined) {
        const trainState = await fetchJsonResponse(trainStatusQuery(trainIdent, getDateFormat(searchDate)));
        if (trainState.TrainAnnouncement[0]?.TimeAtLocation) {
          return calcTrainStatus(trainState.TrainAnnouncement[0]);
        }
      }
      return {};
    }

    async function getStationData(type) {
      console.log(new Date());
      const stationName = await fetchJsonResponse(stationNameQuery(locationId));
      setLocationName(stationName.TrainStation[0]?.OfficialLocationName);

      if (type === undefined || type === "arrivals") {
        const response = await fetchJsonResponse(stationQuery(locationId, "Ankomst"));
        const arrivals = await Promise.all(
          response.TrainAnnouncement?.map(async (item) => {
            item.TrainStatus = await getTrainState(item.TechnicalTrainIdent, item.ScheduledDepartureDateTime);
            return item;
          })
        );

        setArrivalsData(arrivals);
      }
      if (type === undefined || type === "departures") {
        const response = await fetchJsonResponse(stationQuery(locationId, "Avgang"));
        const departures = await Promise.all(
          response.TrainAnnouncement?.map(async (item) => {
            item.TrainStatus = await getTrainState(item.TechnicalTrainIdent, item.ScheduledDepartureDateTime);
            return item;
          })
        );
        setDeparturesData(departures);
      }
    }

    getStationData(type);
    interval = setInterval(() => {
      getStationData(type);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [locationId, type]);

  if (type === "arrivals") {
    document.title = `Ankomster ${locationId}`;
    return (
      <div>
        {locationName ? <h2 className="locationId">{locationName}</h2> : <h2 className="locationId">{locationId}</h2>}
        {arrivalsData !== null ? <StationBoard data={arrivalsData} type="arrivals" /> : <></>}
      </div>
    );
  }
  if (type === "departures") {
    document.title = `Avgångar ${locationId}`;
    return (
      <div>
        {locationName ? <h2 className="locationId">{locationName}</h2> : <h2 className="locationId">{locationId}</h2>}
        {departuresData !== null ? <StationBoard data={departuresData} type="departures" /> : <></>}
      </div>
    );
  } else {
    document.title = `Ankomster & avgångar ${locationId}`;
    return (
      <div>
        {locationName ? <h2 className="locationId">{locationName}</h2> : <h2 className="locationId">{locationId}</h2>}
        {arrivalsData !== null && departuresData !== null ? (
          <div className="content">
            <div className="half">
              {arrivalsData !== null ? <StationBoard data={arrivalsData} type="arrivals" /> : <></>}
            </div>
            <div className="half">
              {departuresData !== null ? <StationBoard data={departuresData} type="departures" /> : <></>}
            </div>
          </div>
        ) : (
          <div className="content">
            {type === "arrivals" && arrivalsData !== null ? (
              <StationBoard data={arrivalsData} type="arrivals" />
            ) : (
              <></>
            )}
            {type === "departures" && departuresData !== null ? (
              <StationBoard data={departuresData} type="departures" />
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    );
  }
}
