export const dateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export const fullDateTimeOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export const shortDateTimeOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}

export const fullTimeOptions = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export const timeOptions = {
  hour: "numeric",
  minute: "numeric",
};

export function getShortTime(dateTimeString) {
  return new Intl.DateTimeFormat("sv-SE", timeOptions).format(new Date(dateTimeString));
}

export function getLongTime(dateTimeString) {
  return new Intl.DateTimeFormat("sv-SE", fullTimeOptions).format(new Date(dateTimeString));
}

export function getDateFormat(dateTimeString) {
  return new Intl.DateTimeFormat("sv-SE", dateOptions).format(new Date(dateTimeString));
}

export function getLongDateFormat(dateTimeString) {
  return new Intl.DateTimeFormat("sv-SE", fullDateTimeOptions).format(new Date(dateTimeString));
}

export function getShortDateFormat(dateTimeString) {
  return new Intl.DateTimeFormat("sv-SE", shortDateTimeOptions).format(new Date(dateTimeString));
}

// Converting POINT string to latitude/longitude
export function convertWgs84(input) {
  if (input !== undefined) {
    const point = input?.split(" ");
    const lng = parseFloat(point[1].substring(1));
    const lat = parseFloat(point[2]);

    return { lat: lat, lng: lng };
  }
  return null;
}

// Getting middle of two lat/lng points
export function getMiddlePoint(fromLatLng, toLatLng) {
  const middleLat = (fromLatLng.lat + toLatLng.lat) / 2;
  const middleLng = (fromLatLng.lng + toLatLng.lng) / 2;
  return { lat: middleLat, lng: middleLng };
}

// Calculating distance in meters
// Source: https://www.movable-type.co.uk/scripts/latlong.html
export function getDistance(fromLatLng, toLatLng) {
  const R = 6371e3; // metres
  const fi1 = (fromLatLng.lat * Math.PI) / 180; // fi, lambda in radians
  const fi2 = (toLatLng.lat * Math.PI) / 180;
  const deltaFi = ((toLatLng.lat - fromLatLng.lat) * Math.PI) / 180;
  const deltaLambda = ((toLatLng.lng - fromLatLng.lng) * Math.PI) / 180;

  const a = Math.sin(deltaFi / 2) * Math.sin(deltaFi / 2) + Math.cos(fi1) * Math.cos(fi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres

  //console.log(d);
  return d;
}

// Converts from degrees to radians.
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}


export function getBearing(fromLatLng, toLatLng){
  const startLat = toRadians(fromLatLng.lat);
  const startLng = toRadians(fromLatLng.lng);
  const destLat = toRadians(toLatLng.lat);
  const destLng = toRadians(toLatLng.lng);

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}