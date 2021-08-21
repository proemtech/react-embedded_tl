import React from "react";
import { getShortTime } from "../utils/common";

export default function TrainScheduleTable({ trainSchedule }) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Plats</th>
            <th>Spår</th>
            <th>Tid</th>
            <th>Faktisk</th>
          </tr>
        </thead>
        <tbody>
          {trainSchedule?.map((row) => (
            <tr key={Math.random()}>
              <td>{row.LocationSignature}</td>
              <td>
                {row.DepartureData?.TrackAtLocation && row.DepartureData?.TrackAtLocation !== "x"
                  ? row.DepartureData?.TrackAtLocation
                  : row.ArrivalData?.TrackAtLocation}
              </td>
              <td>
                {row.ArrivalData?.AdvertisedTimeAtLocation
                  ? getShortTime(row.ArrivalData?.AdvertisedTimeAtLocation)
                  : ""}
                {row.ArrivalData?.AdvertisedTimeAtLocation && row.DepartureData?.AdvertisedTimeAtLocation ? (
                  <br />
                ) : (
                  <></>
                )}
                {row.DepartureData?.AdvertisedTimeAtLocation && (
                  <>{getShortTime(row.DepartureData?.AdvertisedTimeAtLocation)}</>
                )}
              </td>
              <td>
                {row.ArrivalData?.TimeAtLocation ? getShortTime(row.ArrivalData?.TimeAtLocation) : ""}
                {row.ArrivalState?.activity && (
                  <>
                    {" "}
                    <span style={{ color: row.ArrivalState?.textColor }}>({row.ArrivalState?.minutes})</span>
                  </>
                )}
                {row.ArrivalData?.AdvertisedTimeAtLocation && row.DepartureData?.AdvertisedTimeAtLocation ? (
                  <br />
                ) : (
                  <></>
                )}
                {row.DepartureData?.TimeAtLocation ? (
                  <>{getShortTime(row.DepartureData?.TimeAtLocation)}</>
                ) : (<>&nbsp;</>)}
                {row.DepartureState?.activity && (
                  <>
                    {" "}
                    <span style={{ color: row.DepartureState?.textColor }}>({row.DepartureState?.minutes})</span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
