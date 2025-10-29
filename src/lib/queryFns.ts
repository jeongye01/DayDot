// src/lib/queryFns.ts
import { api } from "@/lib/axios";
import {
  GetEntryData,
  GetEntryListData,
  GetEntryListParams,
  GetEntryParams,
  PatchEntryPayload,
  PostEntryPayload,
} from "@/types/entries";
import { Entry } from "@prisma/client";

// 🧾 일기 목록
export const getEntryList = async (
  params?: GetEntryListParams,
): Promise<GetEntryListData> => {
  const { data } = await api.get("/entries", { params });
  return data;
};

// 📖 일기 상세
export const getEntry = async ({
  id,
}: GetEntryParams): Promise<GetEntryData> => {
  const { data } = await api.get(`/entries/${id}`);
  return data;
};

// ✍️ 일기 작성
export const postEntry = async (
  payload: PostEntryPayload,
): Promise<GetEntryData> => {
  const { data } = await api.post("/entries", payload);
  return data;
};
// 🧩 일기 수정
export const patchEntry = async (
  id: Entry["id"],
  payload: PatchEntryPayload,
): Promise<GetEntryData> => {
  const { data } = await api.patch(`/entries/${id}`, payload);
  return data;
};
// ❌ 일기 삭제
export const deleteEntry = async (id: Entry["id"]) => {
  const { data } = await api.delete(`/entries/${id}`);
  return data;
};

// // 👤 유저 프로필
// export const fetchUserProfile = async (id: string) => {
//   const { data } = await api.get(`/api/users/${id}`);
//   return data;
// };
