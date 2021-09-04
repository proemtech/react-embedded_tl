import { trainStations } from "../data/trainStations";

export function getTrainStationName(locationSignature) {
    return trainStations?.TrainStation.find((station) => station.LocationSignature === locationSignature);
}