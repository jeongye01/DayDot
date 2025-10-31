import { GetEntryListParams, GetEntryParams } from "@/types/entries";

export const queryKeys = {
  entries: {
    all: ["entries"] as const,
    list: (params: GetEntryListParams) =>
      [...queryKeys.entries.all, "list", params] as const,
    detail: ({ id }: GetEntryParams) =>
      [...queryKeys.entries.all, "detail", id] as const,
    today: () => [...queryKeys.entries.all, "today"] as const,
  },

  //   user: {
  //     all: ["user"] as const,
  //     profile: (id?: string) => ["user", "profile", id] as const,
  //   },

  //   stats: {
  //     all: ["stats"] as const,
  //     monthly: (month: string) => ["stats", "monthly", month] as const,
  //   },
};
