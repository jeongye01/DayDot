import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // 인증 만료 → 로그인 페이지로 이동 등
      console.warn("인증 만료");
    }
    return Promise.reject(err);
  },
);
