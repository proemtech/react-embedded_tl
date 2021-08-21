import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Clock from "../components/Clock";
import TrainScheduleTable from "../components/TrainScheduleTable";
import TrainStatus from "../components/TrainStatus";
import { calcTrainStatus } from "../services/calcTrainStatus";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { trainScheduleQuery } from "../services/queries/trainScheduleQuery";
import { trainStatusQuery } from "../services/queries/trainStatusQuery";
import { scheduleCleaner } from "../services/scheduleCleaner";
import { getDateFormat } from "../utils/common";

export default function TrainPage() {
  const { trainIdent, searchDate } = useParams();
  const [trainSchedule, setTrainSchedule] = useState(null);
  const [trainStatus, setTrainStatus] = useState(null);

  useEffect(() => {
    let interval;

    async function getTrainData() {
      console.log(new Date());
      const trainScheduleResponse = await fetchJsonResponse(
        trainScheduleQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );
      const trainStatusResponse = await fetchJsonResponse(
        trainStatusQuery(trainIdent, searchDate !== undefined ? searchDate : getDateFormat(new Date()))
      );
      setTrainSchedule(scheduleCleaner(trainScheduleResponse));
      setTrainStatus(calcTrainStatus(trainStatusResponse.TrainAnnouncement[0]));
    }

    getTrainData();

    interval = setInterval(() => {
      getTrainData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [trainIdent, searchDate]);

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
      <div className="content">{trainStatus && (<TrainStatus trainStatus={trainStatus} />)}</div>
      <div className="content">{trainSchedule && <TrainScheduleTable trainSchedule={trainSchedule} />}</div>
    </div>
  );
}
