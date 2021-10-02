import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Clock from "../components/Clock";
import Help from "../components/Help";
import LastUpdateInfo from "../components/LastUpdateInfo";
import TrainScheduleTable from "../components/TrainScheduleTable";
import TrainStatus from "../components/TrainStatus";
import { calcTrainStatus } from "../services/calcTrainStatus";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { getTrainStationName } from "../services/getTrainStationName";
import { trainScheduleQuery } from "../services/queries/trainScheduleQuery";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";
import { trainStreamQuery } from "../services/queries/trainStreamQuery";
import { scheduleCleaner } from "../services/scheduleCleaner";
import { getDateFormat, getLongTime } from "../utils/common";

export default function TrainPage() {
  const { trainIdent, searchDate } = useParams();
  const [errors, setErrors] = useState(null);
  const [trainSchedule, setTrainSchedule] = useState(null);
  const [trainStatus, setTrainStatus] = useState(null);
  const [trainStatusStreamUrl, setTrainStatusStreamUrl] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let eventSource;

    async function getTrainData() {
      setLoading(true);
      // Fetch data
      const trainScheduleResponse = await fetchJsonResponse(
        trainScheduleQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );
      const trainStatusResponse = await fetchJsonResponse(
        trainStatusQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );
      const trainStreamResponse = await fetchJsonResponse(
        trainStreamQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );

      // Fetch names
      const schedule = await Promise.all(
        trainScheduleResponse?.TrainAnnouncement?.map(async (item) => {
          // Fetching full names
          const fromLocation = (await getTrainStationName(item?.FromLocation[0]?.LocationName)) ?? null;
          const toLocation = (await getTrainStationName(item?.ToLocation[0]?.LocationName)) ?? null;
          const station = await getTrainStationName(item?.LocationSignature);
          // Insert full names and output item
          item.FromLocationName = fromLocation;
          item.ToLocationName = toLocation;
          item.LocationName = station;
          return item;
        })
      );

      const status = await Promise.all(
        trainStatusResponse?.TrainAnnouncement?.map(async (item) => {
          item.LocationName = await getTrainStationName(item.LocationSignature);
          return item;
        })
      );

      // Set data
      setTrainSchedule(await scheduleCleaner(schedule));
      setTrainStatus(await calcTrainStatus(status[0]));

      setLoading(false);

      if (trainStatusStreamUrl === null) {
        console.log(`Updated at ${getLongTime(new Date())}`);
        setTrainStatusStreamUrl(trainStreamResponse?.INFO?.SSEURL);
      }
    }

    try {
      getTrainData();
    } catch (error) {
      setErrors(error);
    }

    if (trainStatusStreamUrl) {
      // Set event source
      eventSource = new EventSource(trainStatusStreamUrl);

      // Error handling
      eventSource.onerror = (event) => {
        console.error(event.error);
        setErrors(event.error);
      };

      // Message on stream open
      eventSource.onopen = () => console.log(`Stream open at ${getLongTime(new Date())}`);

      // Message handler
      eventSource.onmessage = () => {
        console.log(`Stream ping at ${getLongTime(new Date())}`);
        getTrainData();
        setErrors(null);
      };
    }

    return () => {};
  }, [trainIdent, searchDate, trainStatusStreamUrl]);

  // Set doc title
  if (trainStatus?.activity !== undefined) {
    document.title = `Tåg ${trainIdent}: ${trainStatus.activity === "Ankomst" ? "*" : ""}${trainStatus.location} ${
      trainStatus.prefix
    }${trainStatus.minutes}`;
  } else {
    document.title = `Tåg ${trainIdent}`;
  }

  return (
    <div>
      {errors && <div className="content">{errors}</div>}
      <div className="content">
        <div className="half">
          <h2 className="locationId">Tåg {trainIdent}</h2>
          {trainSchedule !== null && (
            <div className="trainInfo">
              <small>
                {trainSchedule[0]?.DepartureData?.FromLocationName?.AdvertisedLocationName} -{" "}
                {trainSchedule[0]?.DepartureData?.ToLocationName?.AdvertisedLocationName}
              </small>
              <br />
              <small>
                {trainSchedule[0]?.DepartureData?.ProductInformation[0]?.Description}
                {trainSchedule[0]?.DepartureData?.InformationOwner.toLowerCase() !== trainSchedule[0]?.DepartureData?.Operator.toLowerCase() && (
                  <>
                    {" "}({trainSchedule[0]?.DepartureData?.InformationOwner}, {trainSchedule[0]?.DepartureData?.Operator})
                  </>
                )}
                {trainSchedule[0]?.DepartureData?.InformationOwner.toLowerCase() === trainSchedule[0]?.DepartureData?.Operator.toLowerCase() && (
                  <>{" "}({trainSchedule[0]?.DepartureData.Operator})</>
                )}
              </small>
            </div>
          )}
        </div>
        <div className="half">
          <Clock />
        </div>
      </div>
      <div className="content">{trainStatus && <TrainStatus trainStatus={trainStatus} />}</div>
      <div className="content">{trainSchedule && <TrainScheduleTable trainSchedule={trainSchedule} />}</div>
      <Help />
      {isLoading && (
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
      )}
      <div className="content">
        <LastUpdateInfo dateTime={new Date()} />
      </div>
    </div>
  );
}
