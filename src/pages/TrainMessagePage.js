import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { trainMessageQuery } from "../services/queries/trainMessageQuery";
import { stationNameQuery } from "../services/queries/stationNameQuery";

export default function TrainMessagePage() {
  const { locationId } = useParams();
  const [messages, setMessages] = useState({});
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    async function getMessages() {
      const result = await fetchJsonResponse(trainMessageQuery(locationId));
      const stationName = await fetchJsonResponse(stationNameQuery(locationId));

      setLocationName(stationName.TrainStation[0]?.OfficialLocationName);
      setMessages(result);
    }
    getMessages();
  }, [locationId]);

  return (
    <>
      {locationName ? (
        <h4 className="locationId">Visar trafikstörningsmeddelanden vid {locationName}</h4>
      ) : (
        <h4 className="locationId">Visar trafikstörningsmeddelanden för {locationId}</h4>
      )}
      {messages && (
        <>
          {messages.TrainMessage?.map((msg) => (
            <div className="trainMessageCard">
              <h4 key={Math.random()}>{msg.Header}</h4>
              <p>{msg.ExternalDescription}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
