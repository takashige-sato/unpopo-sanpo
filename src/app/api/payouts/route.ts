import { NextRequest, NextResponse } from "next/server";
import { createPayout, listPayouts } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ payouts: await listPayouts() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    const amount = Number(b.amount);
    if (!b.org_name || !b.period) {
      return NextResponse.json({ error: "団体・対象期間は必須です" }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "金額は1以上の数値で入力してください" }, { status: 400 });
    }
    const payout = await createPayout({
      org_id: b.org_id ?? null,
      org_name: String(b.org_name),
      amount: Math.round(amount),
      period: String(b.period),
      note: String(b.note ?? ""),
    });
    return NextResponse.json({ payout }, { status: 201 });
  } catch (e) {
    console.error("POST /api/payouts", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
