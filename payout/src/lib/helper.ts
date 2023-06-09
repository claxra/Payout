export const getSolidityDate = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export const yearsToSeconds = (years: number) => {
  return years * 365 * 24 * 60 * 60;
};

export const ddmmyyToDate = (date: string) => {
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}`);
};
