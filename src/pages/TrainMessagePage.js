import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { trainMessageQuery } from "../services/queries/trainMessageQuery";

export default function TrainMessagePage() {
  const { locationId } = useParams();
  const [ messages, setMessages ] = useState({});

  useEffect(() => {
    async function getMessages() {
      const result = await fetchJsonResponse(trainMessageQuery(locationId));

      setMessages(result);
    }
    getMessages();
  }, [locationId]);

  return (
    <>
      <h4>Visar trafikstörningsmeddelanden för {locationId}</h4>
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
