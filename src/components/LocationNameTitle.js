import React from "react";
import { Link } from "react-router-dom";

export default function LocationNameTitle({ locationId, locationName }) {
  return (
    <>{locationName ? <h2 className="locationId"><Link to={`/station/${locationId}`}>{locationName}</Link></h2> : <h2 className="locationId"><Link to={`/station/${locationId}`}>{locationId}</Link></h2>}</>
  );
}
