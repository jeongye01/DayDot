import { NextResponse } from "next/server";

export const success = (data: unknown) => NextResponse.json({ ok: true, data });
export const fail = (message: string, status = 400) =>
  NextResponse.json({ ok: false, message }, { status });
