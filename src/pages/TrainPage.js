import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Clock from "../components/Clock";
import LastUpdateInfo from "../components/LastUpdateInfo";
import TrainScheduleTable from "../components/TrainScheduleTable";
import TrainStatus from "../components/TrainStatus";
import { calcTrainStatus } from "../services/calcTrainStatus";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { stationNameQuery } from "../services/queries/stationNameQuery";
import { trainScheduleQuery } from "../services/queries/trainScheduleQuery";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";
import { trainStreamQuery } from "../services/queries/trainStreamQuery";
import { scheduleCleaner } from "../services/scheduleCleaner";
import { getDateFormat, getLongTime } from "../utils/common";

export default function TrainPage() {
  const { trainIdent, searchDate } = useParams();
  const [trainSchedule, setTrainSchedule] = useState(null);
  const [trainStatus, setTrainStatus] = useState(null);
  const [trainStatusStreamUrl, setTrainStatusStreamUrl] = useState(null);

  useEffect(() => {
    let eventSource;
    async function getTrainData() {
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
          const station = await fetchJsonResponse(stationNameQuery(item.LocationSignature));
          item.LocationName = station?.TrainStation[0];
          return item;
        })
      );

      const status = await Promise.all(
        trainStatusResponse?.TrainAnnouncement?.map(async (item) => {
          item.LocationName = await fetchJsonResponse(stationNameQuery(item.LocationSignature)).then(
            (value) => value?.TrainStation[0]
          );
          return item;
        })
      );

      // Set data
      setTrainSchedule(scheduleCleaner(schedule));
      //await Promise.all(scheduleCleaner(trainScheduleResponse)).then(res => setTrainSchedule(res));
      setTrainStatus(calcTrainStatus(status[0]));

      if (trainStatusStreamUrl === null) {
        console.log(`Updated at ${getLongTime(new Date())}`);
        setTrainStatusStreamUrl(trainStreamResponse?.INFO?.SSEURL);
      }
    }

    getTrainData();

    if (trainStatusStreamUrl) {
      // Set event source
      eventSource = new EventSource(trainStatusStreamUrl);

      // Error handling
      eventSource.onerror = (event) => {
        console.error(event.error);
      };

      // Message on stream open
      eventSource.onopen = () => console.log(`Stream open at ${getLongTime(new Date())}`);

      // Message handler
      eventSource.onmessage = () => {
        console.log(`Stream ping at ${getLongTime(new Date())}`);
        getTrainData();
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
      <div className="content">
        <div className="half">
          <h2 className="locationId">Tåg {trainIdent}</h2>
        </div>
        <div className="half">
          <Clock />
        </div>
      </div>
      <div className="content">{trainStatus && <TrainStatus trainStatus={trainStatus} />}</div>
      <div className="content">{trainSchedule && <TrainScheduleTable trainSchedule={trainSchedule} />}</div>
      <div className="content">
        <LastUpdateInfo dateTime={new Date()} />
      </div>
    </div>
  );
}
