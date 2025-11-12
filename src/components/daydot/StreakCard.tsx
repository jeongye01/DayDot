import { getHasWrittenToday, getStreak } from "@/lib/queryFns";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const getTimeOfDayIcon = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 18) {
    return `☀️`;
  } else {
    return `🌙`;
  }
};
export const StreakCard = () => {
  const [todayProgress, setTodayProgress] = useState(0);
  const { data: hasWrittenTodayData } = useQuery({
    queryKey: queryKeys.entries.today(),
    queryFn: getHasWrittenToday,
  });
  const { data: streakData } = useQuery({
    queryKey: queryKeys.entries.streak(),
    queryFn: getStreak,
  });

  // 🌞 오늘이 얼마나 지났는지 계산
  useEffect(() => {
    const getTodayProgress = () => {
      const now = new Date();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      const total = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.min(100, Math.round((elapsed / total) * 100));
    };

    setTodayProgress(getTodayProgress());

    // 1분마다 갱신
    const timer = setInterval(
      () => setTodayProgress(getTodayProgress()),
      60000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">
          🔥 {streakData?.currentStreak}일 연속 기록 중
        </p>
        <span className="text-xs text-gray-500">
          하루의 {todayProgress}%쯤 왔어요. {getTimeOfDayIcon()}
        </span>
      </div>

      {/* 진행 바 */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="bg-primary h-2 transition-all duration-700 ease-in-out"
          style={{ width: `${todayProgress}%` }}
        />
      </div>

      {/* 상태 문구 */}
      <p className="mt-1 text-xs text-gray-500">
        최장 연속 기록 {streakData?.maxStreak}일 • 오늘은{" "}
        {hasWrittenTodayData && (
          <>
            {hasWrittenTodayData.hasWrittenToday ? (
              <span className="text-primary font-medium">기록 완료</span>
            ) : (
              <span className="font-medium text-gray-900">아직 안 했어요</span>
            )}
          </>
        )}
      </p>
    </div>
  );
};
