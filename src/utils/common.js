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
