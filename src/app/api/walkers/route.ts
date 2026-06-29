import { NextRequest, NextResponse } from "next/server";
import { createWalker, listWalkers } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { isEmail } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ walkers: await listWalkers() });
  } catch (e) {
    console.error("GET /api/walkers", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.name || !b.email || !b.area || !b.age_group) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    if (!isEmail(String(b.email))) {
      return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
    }
    const walker = await createWalker({
      name: String(b.name).slice(0, 80),
      email: String(b.email).slice(0, 160),
      phone: String(b.phone ?? "").slice(0, 40),
      area: String(b.area),
      age_group: String(b.age_group),
      motivation: String(b.motivation ?? "").slice(0, 2000),
    });
    return NextResponse.json({ walker }, { status: 201 });
  } catch (e) {
    console.error("POST /api/walkers", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
