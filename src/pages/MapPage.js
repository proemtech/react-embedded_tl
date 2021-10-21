import React, { useEffect } from "react";
import { useParams } from "react-router";
import { fetchJsonResponse } from "../services/fetchJsonResponse";
import { getLocationsForTrainQuery } from "../services/queries/getLocationsForTrainQuery";
import { getDateFormat } from "../utils/common";

export default function MapPage() {
  const { trainIdent } = useParams();

  useEffect(() => {
      async function getMapData() {
          const today = getDateFormat(new Date());
          const trainLocations = await fetchJsonResponse(getLocationsForTrainQuery(trainIdent, today));
          console.log(trainLocations?.INFO?.EVALRESULT[0]?.OrderedLocations);
      }

      try {
          getMapData()
      } catch (error) {
          console.error(error);
      }
  }, [trainIdent]);

  return <div></div>;
}
