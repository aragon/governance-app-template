import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export function getSimpleRelativeTimeFromDate(value: Dayjs) {
  dayjs.extend(relativeTime);

  const now = dayjs();
  const targetDate = dayjs(value);

  if (targetDate.isBefore(now)) {
    return "0 minutes";
  }

  const diffMins = targetDate.diff(now, "minute");
  const diffHours = targetDate.diff(now, "hour");
  const diffDays = targetDate.diff(now, "day");
  const diffWeeks = targetDate.diff(now, "week");

  // Decide whether to show days or weeks
  if (Math.abs(diffMins) < 60) {
    return `${Math.abs(diffMins)} ${Math.abs(diffMins) === 1 ? "minute" : "minutes"}`;
  } else if (Math.abs(diffHours) < 24) {
    return `${Math.abs(diffHours)} ${Math.abs(diffHours) === 1 ? "hour" : "hours"}`;
  } else if (Math.abs(diffDays) >= 15) {
    return `${Math.abs(diffWeeks)} ${Math.abs(diffWeeks) === 1 ? "week" : "weeks"}`;
  } else {
    return `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? "day" : "days"} `;
  }
}
