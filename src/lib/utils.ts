import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const toUTCMidnightISOString = (date: Date): string => {
  // 브라우저의 타임존 오프셋(분 단위)
  const offsetMinutes = date.getTimezoneOffset();

  // 로컬 자정으로 설정 후, UTC로 변환
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  // 로컬 자정을 UTC 기준으로 보정
  const utcTime = new Date(localMidnight.getTime() - offsetMinutes * 60 * 1000);

  return utcTime.toISOString();
};
export const toUTCMidnight = (date: Date): Date => {
  // 브라우저의 타임존 오프셋(분 단위)
  const offsetMinutes = date.getTimezoneOffset();

  // 로컬 자정으로 설정 후, UTC로 변환
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  // 로컬 자정을 UTC 기준으로 보정
  const utcTime = new Date(localMidnight.getTime() - offsetMinutes * 60 * 1000);

  return utcTime;
};
