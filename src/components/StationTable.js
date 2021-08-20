import React from "react";
import { getShortTime } from "../utils/common";

export default function StationTable(props) {
  const { data, type } = props;
  if (data !== null) {
    return (
      <div>
        {type === "arrivals" ? (<h4 className="activityType">Ankomster</h4>) : (<h4 className="activityType">Avgångar</h4>)}
        <table>
          <thead>
            <tr>
              <th>Tåg</th>
              <th>Från</th>
              <th>Till</th>
              <th>Tid</th>
              <th>Spår</th>
              <th>Status</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {data.TrainAnnouncement?.map((row) => (
              <tr key={Math.random()}>
                <td>{row.AdvertisedTrainIdent}</td>
                <td>{row.FromLocation[0]?.LocationName}</td>
                <td>{row.ToLocation[0]?.LocationName}</td>
                <td>{getShortTime(row.AdvertisedTimeAtLocation)}</td>
                <td>{row.TrackAtLocation}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <></>;
}
