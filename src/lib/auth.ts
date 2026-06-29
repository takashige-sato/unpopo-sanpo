import { NextRequest } from "next/server";

// 管理ページ用パスワード。Vercel の環境変数 ADMIN_PASSWORD で必ず設定してください。
// 未設定の場合はデモ用の既定値が使われますが、本番では必ず独自の値を設定してください。
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "unpopo-admin-demo";

// タイミング攻撃に強い定数時間比較
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isAuthed(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token") || "";
  return safeEqual(token, ADMIN_PASSWORD);
}
