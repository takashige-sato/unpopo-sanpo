import { NextRequest, NextResponse } from "next/server";
import { updateWalkerStatus } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const { status } = await req.json();
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    await updateWalkerStatus(params.id, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PATCH /api/walkers/[id]", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

