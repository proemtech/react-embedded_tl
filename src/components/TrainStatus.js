import React from "react";

export default function TrainStatus({ trainStatus }) {
  return (
    <div className="trainStatus">
      {trainStatus?.activity && (
        <span style={{ color: trainStatus?.textColor }}>
          {trainStatus?.activity === "Ankomst" ? "Ankom " : "Avgick "}
          {trainStatus?.location} {trainStatus?.prefix}{trainStatus?.minutes}
        </span>
      )}
    </div>
  );
}
