import React from "react";
import { Link } from "react-router-dom";
import { getDateFormat, getShortTime } from "../utils/common";

export default function StationBoard({ locationId, data, type }) {
  if (data !== null) {
    return (
      <div className="tableContent">
        {type === "arrivals" ? <h4 className="activityType"><Link to={`/station/${locationId}/arrivals`}>Ankomster</Link></h4> : <h4 className="activityType"><Link to={`/station/${locationId}/departures`}>Avgångar</Link></h4>}
        <table>
          <thead>
            <tr>
              <th>Tåg</th>
              <th>Från</th>
              <th>Till</th>
              <th>Tid</th>
              <th>Spår</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr key={Math.random()}>
                <td><Link to={`/train/${row.AdvertisedTrainIdent}/${getDateFormat(row.ScheduledDepartureDateTime)}`}>{row.AdvertisedTrainIdent}</Link></td>
                <td><Link to={`/station/${row.FromLocation[0]?.LocationName}`}>{row.FromLocation[0]?.LocationName}</Link></td>
                <td><Link to={`/station/${row.ToLocation[0]?.LocationName}`}>{row.ToLocation[0]?.LocationName}</Link></td>
                <td><div style={row.Canceled ? {textDecoration: "line-through"} : {}}>{getShortTime(row.AdvertisedTimeAtLocation)}</div></td>
                <td>{row.TrackAtLocation}</td>
                <td>
                  {row.Canceled ? (
                    <div>
                      {row.Canceled ? "Inställt" : ""}
                    </div>
                  ) : (
                    <div style={row.TrainStatus ? { color: row.TrainStatus.textColor } : null}>
                      {row.TrainStatus.activity === "Ankomst" ? "*" : ""}
                      {row.TrainStatus.location} {row.TrainStatus.prefix}
                      {row.TrainStatus.minutes}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <></>;
}
