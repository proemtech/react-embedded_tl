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

export function convertWgs84(input) {
  if (input !== undefined) {
    const point = input?.split(" ");
    const lng = parseFloat(point[1].substring(1));
    const lat = parseFloat(point[2]);
  
    return { lat: lat, lng: lng };
  }
  return null;
}
