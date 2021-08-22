import React from "react";
import { getLongDateFormat } from "../utils/common";

export default function TrainMessageCard({ msg }) {
  return (
    <div className="trainMessageCard">
      <h4>{msg.Header}</h4>
      <small>Starttid: {getLongDateFormat(msg.StartDateTime)}</small>
      {msg.PrognosticatedEndDateTimeTrafficImpact && (
        <>
          <br />
          <small>Beräknat klart: {getLongDateFormat(msg.PrognosticatedEndDateTimeTrafficImpact)}</small>
        </>
      )}
      <p>{msg.ExternalDescription}</p>
    </div>
  );
}
