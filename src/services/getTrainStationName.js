import { trainStations } from "../data/trainStations";
import { fetchJsonResponse } from "./fetchJsonResponse";
import { stationNameQuery } from "./queries/stationNameQuery";

export async function getTrainStationName(locationSignature) {
  // Try to find location details in local data
  const stationName = trainStations?.TrainStation.find((station) => station.LocationSignature === locationSignature);
  // If no local data found, query the API for location and if no result, return location signature as AdvertisedLocatioName and OfficialName
  if (stationName === undefined) {
    const stationDetails = await fetchJsonResponse(stationNameQuery(locationSignature));

    if (stationDetails?.TrainStation[0]) return stationDetails?.TrainStation[0];
    return { AdvertisedLocationName: locationSignature, LocationSignature: locationSignature, OfficialLocationName: locationSignature};
  }
  return stationName;
}
