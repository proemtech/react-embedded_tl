import React from "react";
import { getShortDateFormat } from "../utils/common";

export default function TrainMessageCard({ msg }) {
  return (
    <div className="trainMessageCard">
      <h4>{msg?.Header}</h4>
      <small>Starttid: {getShortDateFormat(msg?.StartDateTime)}</small>
      {msg?.LastUpdateDateTime && (
        <>
          <br />
          <small>Senast uppdaterat: {getShortDateFormat(msg?.LastUpdateDateTime)}</small>
        </>
      )}
      {msg?.PrognosticatedEndDateTimeTrafficImpact && (
        <>
          <br />
          <small>Beräknat klart: {getShortDateFormat(msg?.PrognosticatedEndDateTimeTrafficImpact)}</small>
        </>
      )}
      <p>{msg?.ExternalDescription}</p>
    </div>
  );
}
