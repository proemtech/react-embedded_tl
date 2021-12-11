import React from "react";
import { Link } from "react-router-dom";
import { getDateFormat, getShortTime } from "../utils/common";
import DeviationTextSwitcher from "./DeviationTextSwitcher";

export default function StationBoard({ locationId, data, type }) {
  if (data !== null) {
    return (
      <div className="tableContent">
        {type === "arrivals" ? (
          <h4 className="activityType">
            <Link to={`/arrivals/${locationId}`}>Ankomster</Link>
          </h4>
        ) : (
          <h4 className="activityType">
            <Link to={`/departures/${locationId}`}>Avgångar</Link>
          </h4>
        )}
        <table>
          <thead>
            <tr>
              <th>Tåg</th>
              {type === "arrivals" ? <th>Från</th> : <th>Till</th>}
              <th>Tid</th>
              <th>Spår</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr key={Math.random()}>
                <td className="stationBoardTrainIdent">
                  <Link to={`/train/${row.AdvertisedTrainIdent}/${getDateFormat(row.ScheduledDepartureDateTime)}`}>
                    {row.AdvertisedTrainIdent}
                  </Link>
                  <br />
                  &nbsp;
                </td>
                {type === "arrivals" ? (
                  <td title={row.FromLocationName.AdvertisedLocationName} className="stationBoardLocation">
                    {row.FromLocationName !== null && row.FromLocationName !== undefined ? (
                      <Link to={`/station/${row.FromLocation[0]?.LocationName}`}>
                        {row.FromLocationName?.AdvertisedLocationName}
                      </Link>
                    ) : (
                      <Link to={`/station/${row.FromLocation[0]?.LocationName}`}>
                        {row.FromLocation[0]?.LocationName}
                      </Link>
                    )}
                  </td>
                ) : (
                  <td title={row.ToLocationName?.AdvertisedLocationName} className="stationBoardLocation">
                    {row.FromLocationName !== null && row.FromLocationName !== undefined ? (
                      <Link to={`/station/${row.ToLocation[0]?.LocationName}`}>
                        {row.ToLocationName?.AdvertisedLocationName}
                      </Link>
                    ) : (
                      <Link to={`/station/${row.ToLocation[0]?.LocationName}`}>{row.ToLocation[0]?.LocationName}</Link>
                    )}
                  </td>
                )}
                <td className="stationBoardTimeAtLocation">
                  <div style={row.Canceled || row.EstimatedTimeAtLocation ? { textDecoration: "line-through" } : {}}>
                    {getShortTime(row.AdvertisedTimeAtLocation)}
                  </div>
                  {row.EstimatedTimeAtLocation && (
                    <div>
                      <em>{getShortTime(row.EstimatedTimeAtLocation)} (!)</em>
                    </div>
                  )}
                </td>
                <td className="stationBoardTrackAtLocation">{row.TrackAtLocation}</td>
                <td className="stationBoardInfo">
                  <DeviationTextSwitcher
                    deviations={row.Deviation}
                    estimatedTimeAtLocation={row.EstimatedTimeAtLocation}
                    trainStatus={row.TrainStatus}
                    trainIdent={row.AdvertisedTrainIdent}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div>
      <div className="loading">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    </div>
  );
}
