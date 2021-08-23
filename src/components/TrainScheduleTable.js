import React from "react";
import { Link } from "react-router-dom";
import { getLongTime } from "../utils/common";

export default function TrainScheduleTable({ trainSchedule }) {
  return (
    <div className="tableContent">
      <table>
        <thead>
          <tr>
            <th>Plats</th>
            <th>Spår</th>
            <th>Ank.</th>
            <th>Avg.</th>
            <th>Avvikelse</th>
          </tr>
        </thead>
        <tbody>
          {trainSchedule?.map((row) => (
            <tr key={Math.random()}>
              <td>
                <div style={{ fontWeight: "bold" }}>
                  <Link to={`/station/${row.LocationSignature}`}>{row.LocationSignature}</Link>
                </div>
              </td>
              <td>
                <div style={{ fontWeight: "bold" }}>
                  {row.DepartureData?.TrackAtLocation && row.DepartureData?.TrackAtLocation !== "x"
                    ? row.DepartureData?.TrackAtLocation
                    : row.ArrivalData?.TrackAtLocation}
                </div>
              </td>
              <td>
                <div
                  style={
                    row.ArrivalData?.Canceled
                      ? { fontWeight: "bold", textDecoration: "line-through" }
                      : { fontWeight: "bold" }
                  }
                >
                  {row.ArrivalData?.AdvertisedTimeAtLocation && (
                    <>{getLongTime(row.ArrivalData?.AdvertisedTimeAtLocation)}</>
                  )}
                </div>
                <div>
                  {row.DepartureData?.EstimatedTimeAtLocation && (
                    <>Ber: {getLongTime(row.DepartureData?.EstimatedTimeAtLocation)}</>
                  )}
                </div>
                <div>
                  {row.ArrivalData?.TimeAtLocationWithSeconds
                    ? getLongTime(row.ArrivalData?.TimeAtLocationWithSeconds)
                    : ""}
                  {row.ArrivalState?.activity && (
                    <>
                      {" "}
                      <span style={{ color: row.ArrivalState?.textColor }}>
                        ({row.ArrivalState?.prefix}
                        {row.ArrivalState?.minutes})
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td>
                <div
                  style={
                    row.DepartureData?.Canceled
                      ? { fontWeight: "bold", textDecoration: "line-through" }
                      : { fontWeight: "bold" }
                  }
                >
                  {row.DepartureData?.AdvertisedTimeAtLocation && (
                    <>{getLongTime(row.DepartureData?.AdvertisedTimeAtLocation)}</>
                  )}
                </div>
                <div>
                  {row.DepartureData?.EstimatedTimeAtLocation && (
                    <>Ber: {getLongTime(row.DepartureData?.EstimatedTimeAtLocation)}</>
                  )}
                </div>
                <div>
                  {row.DepartureData?.TimeAtLocationWithSeconds ? (
                    <>{getLongTime(row.DepartureData?.TimeAtLocationWithSeconds)}</>
                  ) : (
                    ""
                  )}
                  {row.DepartureState?.activity && (
                    <>
                      {" "}
                      <span style={{ color: row.DepartureState?.textColor }}>
                        ({row.DepartureState?.prefix}
                        {row.DepartureState?.minutes})
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td>
                {Array.from(row.Deviations).map((deviation) => (
                  <div key={Math.random()}>{deviation}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
