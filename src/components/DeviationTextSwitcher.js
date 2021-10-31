import React from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getShortTime } from "../utils/common";

export default function DeviationTextSwitcher({ deviations, estimatedTimeAtLocation, trainStatus }) {
  const [index, setIndex] = useState(0)
  const [statusText, setStatusText] = useState("")
  
  const textLoop = useMemo(() => {
    let output = [];
    // Loop deviations
    deviations?.forEach((deviation) => {
      output.push(deviation.Description);
    });
  
    if (estimatedTimeAtLocation) output.push(`Ny tid: ${getShortTime(estimatedTimeAtLocation)}`);
    return output;
  }, [deviations, estimatedTimeAtLocation])

  const shuffle = useCallback(() => {
    if (textLoop.length === 1) {
      setStatusText(textLoop[index])
    }
    if (textLoop.length > 1) {
      setStatusText(textLoop[index]);
      setIndex(index < textLoop.length - 1 ? index + 1 : 0);
    }
  },[index, textLoop])

  useEffect(() => {
    if (textLoop.length > 0) setStatusText(textLoop[index])
    const intervalId = setInterval(shuffle, 3000);
    return () => clearInterval(intervalId)
  }, [shuffle, textLoop, index])

  return (
    <>
      <div style={trainStatus ? { color: trainStatus?.textColor } : null}>
        {trainStatus?.activity === "Ankomst" ? "*" : ""}
        {trainStatus?.locationName !== undefined && trainStatus?.locationName !== null
          ? trainStatus?.locationName
          : trainStatus?.location}{" "}
        {trainStatus?.prefix}
        {trainStatus?.minutes}
      </div>
      <div><em>{statusText}</em></div>
    </>
  );
}
