import { GetEntryListParams, GetEntryParams } from "@/types/entries";

export const queryKeys = {
  entries: {
    all: ["entries"] as const,
    list: (params: GetEntryListParams) => ["entries", "list", params] as const,
    detail: ({ id }: GetEntryParams) => ["entries", "detail", id] as const,
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
