"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Illust } from "@/components/Illust";
import { AREAS, AGE_GROUPS } from "@/lib/constants";

export default function WalkerRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/walkers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "送信に失敗しました");
      }
      router.push("/thanks?type=walker");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
      setLoading(false);
    }
  }

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-4">
          <Illust name="patting" anim="bob" className="w-24" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-unpopo-pink">
              散歩したい方の登録
            </h1>
            <p className="text-unpopo-ink/70 mt-1 text-sm">
              ワンコイン500円で、保護犬とおさんぽ。まずは登録から！（無料）
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card p-6 sm:p-8 mt-6 space-y-5">
          <div>
            <label htmlFor="name">お名前 <span className="text-unpopo-pink">*</span></label>
            <input id="name" name="name" required placeholder="例）鈴木 一郎" className="mt-1" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email">メールアドレス <span className="text-unpopo-pink">*</span></label>
              <input id="email" name="email" type="email" required placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <label htmlFor="phone">電話番号</label>
              <input id="phone" name="phone" placeholder="090-0000-0000" className="mt-1" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="area">お住まいのエリア <span className="text-unpopo-pink">*</span></label>
              <select id="area" name="area" required defaultValue="" className="mt-1">
                <option value="" disabled>選択してください</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="age_group">年代 <span className="text-unpopo-pink">*</span></label>
              <select id="age_group" name="age_group" required defaultValue="" className="mt-1">
                <option value="" disabled>選択してください</option>
                {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="motivation">参加のきっかけ・ひとこと</label>
            <textarea id="motivation" name="motivation" rows={4} placeholder="犬と触れ合いたい、運動のきっかけにしたい など" className="mt-1" />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">⚠️ {error}</p>}

          <button type="submit" disabled={loading} className="btn-pink w-full py-3 text-lg disabled:opacity-60">
            {loading ? "送信中…" : "🐕 この内容で登録する"}
          </button>
          <p className="text-center text-xs text-unpopo-ink/60">
            送信すると<Link href="/" className="underline">利用規約</Link>に同意したものとみなします。
          </p>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
