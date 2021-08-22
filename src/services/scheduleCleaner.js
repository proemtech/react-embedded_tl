import { calcTrainStatus } from "./calcTrainStatus";
import { TrainSchedule } from "../models/TrainSchedule";

export function scheduleCleaner(json) {
  let data = json?.TrainAnnouncement;
  // Initiera variabler och lista över slutprodukt
  let previousLocation;
  let output = [];
  
  // Iterera input och placera i object
  let ts;
  for (let i in data) {
    if (previousLocation !== data[i].LocationSignature) {
      let deviations = new Set();
      ts = new TrainSchedule();
      ts.AdvertisedTrainIdent = data[i].AdvertisedTrainIdent;
      ts.LocationSignature = data[i].LocationSignature;
      if (data[i].FromLocation || data[i].ToLocation) {
        ts.FromLocation = data[i].FromLocation[0].LocationName;
        ts.ToLocation = data[i].ToLocation[0].LocationName;
      }
      previousLocation = data[i].LocationSignature;

      if (data[i].ActivityType === "Ankomst") {
        ts.ArrivalData = data[i];
        if (data[i].TimeAtLocation) {
          ts.ArrivalState = calcTrainStatus(data[i]);
        }
      } else {
        ts.DepartureData = data[i];
        if (data[i].TimeAtLocation) {
          ts.DepartureState = calcTrainStatus(data[i]);
        }
      }
      data[i]?.Deviation?.forEach((deviation) => deviations.add(deviation?.Description));
      ts.Deviations = deviations;
      output.push(ts);
    } else {
      let deviations = new Set();
      ts.AdvertisedTrainIdent = data[i].AdvertisedTrainIdent;
      ts.LocationSignature = data[i].LocationSignature;
      if (data[i].FromLocation || data[i].ToLocation) {
        ts.FromLocation = data[i].FromLocation[0].LocationName;
        ts.ToLocation = data[i].ToLocation[0].LocationName;
      }
      previousLocation = data[i].LocationSignature;
      if (data[i].ActivityType === "Avgang") {
        ts.DepartureData = data[i];
        if (data[i].TimeAtLocation) {
          ts.DepartureState = calcTrainStatus(data[i]);
        }
        continue;
      }
      data[i]?.Deviation?.forEach((deviation) => deviations.add(deviation?.Description));
      ts.Deviations = deviations;
      output.push(ts);
    }
  }

  // Returnera listan
  return output;
}
