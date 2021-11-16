const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
  //   timeZone: 'America/New_York',
};
export const getRelativeTimeDate = (date: Date | number) => new Intl.DateTimeFormat('default', options).format(date);
