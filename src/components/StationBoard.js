import React from "react";
import { Link } from "react-router-dom";
import { getDateFormat, getShortTime } from "../utils/common";

export default function StationBoard({ data, type }) {
  if (data !== null) {
    return (
      <div>
        {type === "arrivals" ? <h4 className="activityType">Ankomster</h4> : <h4 className="activityType">Avgångar</h4>}
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
                <td>{getShortTime(row.AdvertisedTimeAtLocation)}</td>
                <td>{row.TrackAtLocation}</td>
                <td>
                  {row.Canceled ? (
                    <div style={row.Canceled ? { color: "#F91730", fontStyle: "italic" } : null}>
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
