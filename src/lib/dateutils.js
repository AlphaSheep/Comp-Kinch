import { parseISO, format } from 'date-fns';

export function dateOffsetFromToday(offset) {
  let date = new Date();
  date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000 ));
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
}

export function formatDateRange(startString, endString) {
  const [startDay, startMonth, startYear] = format(
    parseISO(startString),
    'd MMM yyyy'
  ).split(' ');
  const [endDay, endMonth, endYear] = format(
    parseISO(endString),
    'd MMM yyyy'
  ).split(' ');

  if (startString === endString) {
    return `${startMonth} ${startDay}, ${startYear}`;
  }
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay} - ${endDay}, ${endYear}`;
  }
  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  }
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
}