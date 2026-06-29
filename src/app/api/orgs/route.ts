import { NextRequest, NextResponse } from "next/server";
import { createOrg, listOrgs } from "@/lib/db";
import { isAuthed } from "@/lib/auth";
import { isEmail } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ orgs: await listOrgs() });
  } catch (e) {
    console.error("GET /api/orgs", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.name || !b.rep_name || !b.email || !b.area) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    if (!isEmail(String(b.email))) {
      return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
    }
    const dogCount = Number(b.dog_count ?? 0);
    const org = await createOrg({
      name: String(b.name).slice(0, 120),
      rep_name: String(b.rep_name).slice(0, 80),
      email: String(b.email).slice(0, 160),
      phone: String(b.phone ?? "").slice(0, 40),
      area: String(b.area),
      website: String(b.website ?? "").slice(0, 300),
      dog_count: Number.isFinite(dogCount) && dogCount >= 0 ? Math.round(dogCount) : 0,
      description: String(b.description ?? "").slice(0, 2000),
    });
    return NextResponse.json({ org }, { status: 201 });
  } catch (e) {
    console.error("POST /api/orgs", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
