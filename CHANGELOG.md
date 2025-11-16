# v0.1.0 – DayDot MVP 초기 기능 완성

📅 _2025-11-16_

---

## 🛠 Backend

### ✨ Added — API 기능

- **NextAuth 기반 구글 로그인 기능 추가**

- **일기 CRUD API**
  - `POST /api/entries` — 오늘 일기 작성
  - `GET /api/entries` — 유저별 일기 목록 조회
  - `GET /api/entries/[id]` — 일기 단건 조회
  - `PATCH /api/entries/[id]` — 일기 수정
  - `DELETE /api/entries/[id]` — 일기 삭제

- **이번 달 감정 통계 API (`POST /api/entries/stats`)**
  - 기간 내 감정 빈도(mood count) 계산

- **연속 기록 일수 API (`POST /api/entries/streak`)**

- **오늘 일기 작성 여부 API (`POST /api/entries/today`)**

### 🗄 Added — DB/모델 구성

- Prisma + PostgreSQL Neon 개발 환경 구성
- prisma schema 정의

---

## 🎨 Frontend

### ✨ Added

- Tailwind CSS 초기 설정
- shadcn-ui 설치
- tanstack-query 설치
- Recharts 설치
- GA 스크립트 추가
- MVP 기능 추가

---

## 📌 Notes

- Vercel 빌드 시 타입 체크 옵션 꺼둠. 다음 버전에서는 타입스크립트의 이점을 잘 활용하고 에러가 나지 않도록 작성 필요.
- Util에서 시간을 현지 시간에서 자정으로 맞춘 뒤 UTC 시간으로 변환하는 toUTCMidnightISOString 작성 해둠. FE,BE 모두 사용

---
