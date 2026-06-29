import { NextRequest, NextResponse } from "next/server";
import { createPayment, listPayments } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ payments: await listPayments() });
  } catch (e) {
    console.error("/api/payments", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.walker_name || !b.org_name) {
      return NextResponse.json({ error: "散歩者・団体は必須です" }, { status: 400 });
    }
    const payment = await createPayment({
      walker_id: b.walker_id ?? null,
      walker_name: String(b.walker_name),
      org_id: b.org_id ?? null,
      org_name: String(b.org_name),
      note: String(b.note ?? ""),
    });
    return NextResponse.json({ payment }, { status: 201 });
  } catch (e) {
    console.error("/api/payments", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
