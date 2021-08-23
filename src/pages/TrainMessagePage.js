import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Clock from "../components/Clock";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { trainMessageQuery } from "../services/queries/trainMessageQuery";
import { stationNameQuery } from "../services/queries/stationNameQuery";
import { getLongTime } from "../utils/common";
import TrainMessageCard from "../components/TrainMessageCard";
import LastUpdateInfo from "../components/LastUpdateInfo";

export default function TrainMessagePage() {
  const { locationId } = useParams();
  const [messages, setMessages] = useState({});
  const [locationName, setLocationName] = useState(null);
  const [messageStreamUrl, setMessageStreamUrl] = useState(null);

  useEffect(() => {
    let eventSource;
    async function getMessages() {
      const result = await fetchJsonResponse(trainMessageQuery(locationId));
      const stationName = await fetchJsonResponse(stationNameQuery(locationId));

      setLocationName(stationName.TrainStation[0]?.OfficialLocationName);
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

  // Set doc title
  document.title = `Trafikinformation ${locationName ? locationName : locationId}`;

  return (
    <>
      <div className="content">
        <div className="half">
          {locationName ? (
            <h2 className="locationId">Trafikinformation vid {locationName}</h2>
          ) : (
            <h2 className="locationId">Trafikinformation för {locationId}</h2>
          )}
        </div>
        <div className="half">
          <Clock />
        </div>
      </div>
      {messages && (
        <>
          {messages.TrainMessage?.map((msg) => (
            <TrainMessageCard msg={msg} key={msg.EventId} />
          ))}
        </>
      )}
      {messages?.TrainMessage?.length === 0 && (
        <h4 style={{ textAlign: "center" }}>Ingen nuläget finns inga meddelanden att visa.</h4>
      )}
      <div className="content">
        <LastUpdateInfo dateTime={new Date()} />
      </div>
    </>
  );
}
