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
              <td className="scheduleLocation">
                <div style={{ fontWeight: "bold" }}>
                  {row.LocationName !== null && row.LocationName !== undefined ? (
                    <>
                      <Link to={`/station/${row.LocationSignature}`}>{row.LocationName}</Link>
                      <br />
                      <small className="locationSignature">{row.LocationSignature}</small>
                    </>
                  ) : (
                    <>
                      <Link to={`/station/${row.LocationSignature}`}>{row.LocationSignature}</Link>
                    </>
                  )}
                </div>
              </td>
              <td className="scheduleTrack">
                <div style={{ fontWeight: "bold" }}>
                  {row.DepartureData?.TrackAtLocation &&
                  row.DepartureData?.TrackAtLocation !== "x" &&
                  row.DepartureData?.TrackAtLocation !== "-"
                    ? row.DepartureData?.TrackAtLocation
                    : row.ArrivalData?.TrackAtLocation}
                </div>
              </td>
              <td className="scheduleTimeAtLocation">
                <div
                  style={
                    row.ArrivalData?.Canceled || row.ArrivalData?.EstimatedTimeAtLocation
                      ? { fontWeight: "600", textDecoration: "line-through" }
                      : { fontWeight: "600" }
                  }
                >
                  {row.ArrivalData?.AdvertisedTimeAtLocation && (
                    <>{getLongTime(row.ArrivalData?.AdvertisedTimeAtLocation)}</>
                  )}
                </div>
                <div style={{ fontWeight: "600", fontStyle: "italic" }}>
                  {row.ArrivalData?.EstimatedTimeAtLocation && (
                    <>{getLongTime(row.ArrivalData?.EstimatedTimeAtLocation)} (!)</>
                  )}
                </div>
                <div style={{ fontWeight: "100", fontStyle: "italic" }}>
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
              <td className="scheduleTimeAtLocation">
                <div
                  style={
                    row.DepartureData?.Canceled || row.DepartureData?.EstimatedTimeAtLocation
                      ? { fontWeight: "600", textDecoration: "line-through" }
                      : { fontWeight: "600" }
                  }
                >
                  {row.DepartureData?.AdvertisedTimeAtLocation && (
                    <>{getLongTime(row.DepartureData?.AdvertisedTimeAtLocation)}</>
                  )}
                </div>
                <div style={{ fontWeight: "600", fontStyle: "italic" }}>
                  {row.DepartureData?.EstimatedTimeAtLocation && (
                    <>{getLongTime(row.DepartureData?.EstimatedTimeAtLocation)} (!)</>
                  )}
                </div>
                <div style={{ fontWeight: "100", fontStyle: "italic" }}>
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
              <td className="scheduleInfo">
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
