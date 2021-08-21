import React from "react";

export default function LocationNameTitle({ locationId, locationName }) {
  return (
    <>{locationName ? <h2 className="locationId">{locationName}</h2> : <h2 className="locationId">{locationId}</h2>}</>
  );
}
