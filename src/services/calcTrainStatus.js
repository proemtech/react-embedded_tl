export function calcTrainStatus(trainAnnouncement) {
  if (trainAnnouncement !== undefined) {
    const actual = new Date(trainAnnouncement.TimeAtLocation);
    let advertised;
    let prefix = "";

    if (
      trainAnnouncement.TechnicalDateTime !== undefined &&
      trainAnnouncement.AdvertisedTimeAtLocation !== trainAnnouncement.TechnicalDateTime
    ) {
      advertised = new Date(trainAnnouncement.TechnicalDateTime);
    } else {
      advertised = new Date(trainAnnouncement.AdvertisedTimeAtLocation);
    }
    let minutes = Math.floor((actual - advertised) / 1000 / 60);
    let textColor;

    if (minutes > 0 && minutes < 5) {
      textColor = "orange";
    } else if (minutes >= 5) {
      textColor = "#F91730";
    } else if (minutes < -3) {
      textColor = "#3C69FF";
    } else {
      textColor = "green";
    }

    if (minutes > 0) {
      prefix = "+";
    }

    let output = {
      activity: trainAnnouncement.ActivityType,
      location: trainAnnouncement.LocationSignature,
      timeAtLocation: trainAnnouncement.TimeAtLocationWithSeconds,
      minutes: minutes,
      isDelayed: minutes > 0 ? true : false,
      prefix: prefix,
      textColor: textColor,
    };

    return output;
  }
  return {};
}
