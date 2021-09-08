import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StationBoard from "../components/StationBoard";
import { getDateFormat, getLongTime } from "../utils/common";
import { calcTrainStatus } from "../services/calcTrainStatus";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { stationQuery } from "../services/queries/stationQuery";
import { trainMessageQuery } from "../services/queries/trainMessageQuery";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";
import Clock from "../components/Clock";
import LastUpdateInfo from "../components/LastUpdateInfo";
import LocationNameTitle from "../components/LocationNameTitle";
import TrainMessageCard from "../components/TrainMessageCard";
import { getTrainStationName } from "../services/getTrainStationName";
import Help from "../components/Help";

export default function StationPage() {
  const { locationId, type, limit } = useParams();
  const [arrivalsData, setArrivalsData] = useState(null);
  const [departuresData, setDeparturesData] = useState(null);
  const [messages, setMessages] = useState(null);
  const [messageStreamUrl, setMessageStreamUrl] = useState(null);
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
      console.log(`Updated at ${getLongTime(new Date())}`);
      const stationName = getTrainStationName(locationId);
      setLocationName(stationName?.AdvertisedLocationName);

      if (type === undefined || type === "arrivals") {
        const response = await fetchJsonResponse(stationQuery(locationId, "Ankomst", isNaN(limit) ? 25 : limit));
        const arrivals = await Promise.all(
          response?.TrainAnnouncement?.map(async (item) => {
            item.FromLocationName = getTrainStationName(item.FromLocation[0]?.LocationName);
            item.ToLocationName = getTrainStationName(item.ToLocation[0]?.LocationName);
            item.TrainStatus = await getTrainState(item.TechnicalTrainIdent, item.ScheduledDepartureDateTime);
            return item;
          })
        );

        setArrivalsData(arrivals);
      }
      if (type === undefined || type === "departures") {
        const response = await fetchJsonResponse(stationQuery(locationId, "Avgang", isNaN(limit) ? 25 : limit));
        const departures = await Promise.all(
          response.TrainAnnouncement?.map(async (item) => {
            item.FromLocationName = getTrainStationName(item.FromLocation[0]?.LocationName);
            item.ToLocationName = getTrainStationName(item.ToLocation[0]?.LocationName);
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
  }, [locationId, type, limit]);

  // Get train messages
  useEffect(() => {
    let eventSource;
    async function getMessages() {
      const result = await fetchJsonResponse(trainMessageQuery(locationId));
      const stationName = getTrainStationName(locationId);

      setLocationName(stationName.AdvertisedLocationName);
      setMessages(result);
      if (messageStreamUrl === null) {
        console.log(`Updated at ${getLongTime(new Date())}`);
        setMessageStreamUrl(result?.INFO?.SSEURL);
      }
    }
    getMessages();

    // Start stream
    if (messageStreamUrl) {
      // Set event source
      eventSource = new EventSource(messageStreamUrl);

      // Error handling
      eventSource.onerror = (event) => {
        console.error(event.error);
      };

      // Message on stream open
      eventSource.onopen = () => console.log(`Stream open at ${getLongTime(new Date())}`);

      // Message handler
      eventSource.onmessage = (event) => {
        console.log(`Stream ping at ${getLongTime(new Date())}`);
        getMessages();
      };
    }
  }, [locationId, messageStreamUrl]);

  if (type === "arrivals") {
    document.title = `Ankomster ${locationId}`;
    return (
      <div>
        <div className="content">
          <div className="half">
            <LocationNameTitle locationId={locationId} locationName={locationName} />
          </div>
          <div className="half">
            <Clock />
          </div>
        </div>
        {arrivalsData !== null ? <StationBoard locationId={locationId} data={arrivalsData} type="arrivals" /> : <></>}
        {messages?.TrainMessage?.length !== 0 && (
          <>
            {messages?.TrainMessage?.map((msg) => (
              <TrainMessageCard msg={msg} key={msg.EventId} />
            ))}
          </>
        )}
        <div className="content">
          <LastUpdateInfo dateTime={new Date()} />
        </div>
      </div>
    );
  }
  if (type === "departures") {
    document.title = `Avgångar ${locationId}`;
    return (
      <div>
        <div className="content">
          <div className="half">
            <LocationNameTitle locationId={locationId} locationName={locationName} />
          </div>
          <div className="half">
            <Clock />
          </div>
        </div>
        {departuresData !== null ? (
          <StationBoard locationId={locationId} data={departuresData} type="departures" />
        ) : (
          <></>
        )}
        {messages?.TrainMessage?.length !== 0 && (
          <>
            {messages?.TrainMessage?.map((msg) => (
              <TrainMessageCard msg={msg} key={msg.EventId} />
            ))}
          </>
        )}
        <div className="content">
          <LastUpdateInfo dateTime={new Date()} />
        </div>
      </div>
    );
  } else {
    document.title = `Ankomster & avgångar ${locationId}`;
    return (
      <div>
        <div className="content">
          <div className="half">
            <LocationNameTitle locationId={locationId} locationName={locationName} />
          </div>
          <div className="half">
            <Clock />
          </div>
        </div>
        {arrivalsData !== null && departuresData !== null ? (
          <div className="stationBoard">
            <div className="half">
              {arrivalsData !== null ? (
                <StationBoard locationId={locationId} data={arrivalsData} type="arrivals" />
              ) : (
                <></>
              )}
            </div>
            <div className="half">
              {departuresData !== null ? (
                <StationBoard locationId={locationId} data={departuresData} type="departures" />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <div className="content">
            {type === "arrivals" && arrivalsData !== null ? (
              <StationBoard locationId={locationId} data={arrivalsData} type="arrivals" />
            ) : (
              <></>
            )}
            {type === "departures" && departuresData !== null ? (
              <StationBoard locationId={locationId} data={departuresData} type="departures" />
            ) : (
              <></>
            )}
          </div>
        )}
        {messages?.TrainMessage?.length !== 0 && (
          <>
            {messages?.TrainMessage?.map((msg) => (
              <TrainMessageCard msg={msg} key={msg.EventId} />
            ))}
          </>
        )}
        <Help />
        <div className="content">
          <LastUpdateInfo dateTime={new Date()} />
        </div>
      </div>
    );
  }
}
