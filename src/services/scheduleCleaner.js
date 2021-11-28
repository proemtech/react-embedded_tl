import { calcTrainStatus } from "./calcTrainStatus";
import { TrainSchedule } from "../models/TrainSchedule";

export async function scheduleCleaner(data) {
  //let data = json?.TrainAnnouncement;
  // Initiera variabler och lista över slutprodukt
  let previousLocation;
  let output = [];
  
  // Iterera input och placera i object
  // TODO: Check further into deviations handling
  let ts;
  for (let i in data) {
    if (previousLocation !== data[i].LocationSignature) {
      let deviations = new Set();
      ts = new TrainSchedule();
      ts.AdvertisedTrainIdent = data[i].AdvertisedTrainIdent;
      ts.LocationSignature = data[i].LocationSignature;
      ts.LocationName = data[i].LocationName?.AdvertisedLocationName;
      if (data[i].FromLocation || data[i].ToLocation) {
        ts.FromLocation = data[i].FromLocation[0].LocationName;
        ts.ToLocation = data[i].ToLocation[0].LocationName;
      }
      previousLocation = data[i].LocationSignature;

      if (data[i].ActivityType === "Ankomst") {
        ts.ArrivalData = data[i];
        if (data[i].TimeAtLocation) {
          ts.ArrivalState = await calcTrainStatus(data[i]);
        }
      } else {
        ts.DepartureData = data[i];
        if (data[i].TimeAtLocation) {
          ts.DepartureState = await calcTrainStatus(data[i]);
        }
      }
      data[i]?.Deviation?.forEach((deviation) => {
        //console.log(data[i].LocationSignature,data[i].ActivityType, deviation)
        if (deviation?.Code === "ANA027") {
          if (data[i]?.ActivityType === "Ankomst") deviations.add("Inställd ankomst");
          if (data[i]?.ActivityType === "Avgang") deviations.add("Inställd avgång");
        } else {
          deviations.add(deviation?.Description)
        }
      });
      ts.Deviations = deviations;
      output.push(ts);
    } else {
      let deviations = new Set();
      ts.AdvertisedTrainIdent = data[i].AdvertisedTrainIdent;
      ts.LocationSignature = data[i].LocationSignature;
      data[i]?.Deviation?.forEach((deviation) => {
        if (deviation?.Code === "ANA027") {
          if (data[i]?.ActivityType === "Ankomst") deviations.add("Inställd ankomst");
          if (data[i]?.ActivityType === "Avgang") deviations.add("Inställd avgång");
        } else {
          deviations.add(deviation?.Description)
        }
      });
      ts.Deviations = deviations;
      if (data[i].FromLocation || data[i].ToLocation) {
        ts.FromLocation = data[i].FromLocation[0].LocationName;
        ts.ToLocation = data[i].ToLocation[0].LocationName;
      }
      previousLocation = data[i].LocationSignature;
      if (data[i].ActivityType === "Avgang") {
        ts.DepartureData = data[i];
        if (data[i].TimeAtLocation) {
          ts.DepartureState = await calcTrainStatus(data[i]);
        }
        continue;
      }
      output.push(ts);
    }
  }

  // Returnera listan
  return output;
}
