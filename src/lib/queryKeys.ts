import { GetEntryListParams, GetEntryParams } from "@/types/entries";

export const queryKeys = {
  entries: {
    all: ["entries"] as const,
    list: (params: GetEntryListParams) =>
      [...queryKeys.entries.all, "list", params] as const,
    detail: ({ id }: GetEntryParams) =>
      [...queryKeys.entries.all, "detail", id] as const,

    stats: () => [...queryKeys.entries.all, "stats"] as const,
    streak: () => [...queryKeys.entries.all, "streak"] as const,
    today: () => [...queryKeys.entries.all, "today"] as const,
  },
};
