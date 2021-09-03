import React from "react";
import { getLongTime } from "../utils/common";

export default function TrainStatus({ trainStatus }) {
  console.log(trainStatus)
  return (
    <div className="trainStatus">
      {trainStatus?.activity && (
        <span style={{ color: trainStatus?.textColor }}>
          {trainStatus?.activity === "Ankomst" ? "Ankom " : "Avgick "}
          {trainStatus?.locationName ? trainStatus?.locationName : trainStatus?.location} {trainStatus?.locationName && (`(${trainStatus?.location})`)} kl {getLongTime(trainStatus.timeAtLocation)} ({trainStatus?.prefix}{trainStatus?.minutes})
        </span>
      )}
    </div>
  );
}
