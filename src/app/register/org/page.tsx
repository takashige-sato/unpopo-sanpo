"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Illust } from "@/components/Illust";
import { AREAS } from "@/lib/constants";

export default function OrgRegister() {
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
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "送信に失敗しました");
      }
      router.push("/thanks?type=org");
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
          <Illust name="brushing" anim="wiggle" className="w-24" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-unpopo-yellowdeep">
              保護団体の登録
            </h1>
            <p className="text-unpopo-ink/70 mt-1 text-sm">
              おさんぽを通じて活動を広め、里親候補と出会えます。（登録無料）
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card p-6 sm:p-8 mt-6 space-y-5">
          <div>
            <label htmlFor="name">団体名 <span className="text-unpopo-pink">*</span></label>
            <input id="name" name="name" required placeholder="例）わんわんレスキュー仙台" className="mt-1" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rep_name">ご担当者名 <span className="text-unpopo-pink">*</span></label>
              <input id="rep_name" name="rep_name" required placeholder="例）佐藤 花子" className="mt-1" />
            </div>
            <div>
              <label htmlFor="area">活動エリア <span className="text-unpopo-pink">*</span></label>
              <select id="area" name="area" required defaultValue="" className="mt-1">
                <option value="" disabled>選択してください</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email">メールアドレス <span className="text-unpopo-pink">*</span></label>
              <input id="email" name="email" type="email" required placeholder="info@example.com" className="mt-1" />
            </div>
            <div>
              <label htmlFor="phone">電話番号</label>
              <input id="phone" name="phone" placeholder="022-000-0000" className="mt-1" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website">ウェブサイト / SNS</label>
              <input id="website" name="website" placeholder="https://..." className="mt-1" />
            </div>
            <div>
              <label htmlFor="dog_count">保護している犬の数（おおよそ）</label>
              <input id="dog_count" name="dog_count" type="number" min={0} placeholder="例）8" className="mt-1" />
            </div>
          </div>
          <div>
            <label htmlFor="description">活動内容・アピール</label>
            <textarea id="description" name="description" rows={4} placeholder="活動エリアや保護犬の特徴、散歩ボランティアに期待することなど" className="mt-1" />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">⚠️ {error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg disabled:opacity-60">
            {loading ? "送信中…" : "🏠 この内容で登録する"}
          </button>
          <p className="text-center text-xs text-unpopo-ink/60">
            ご登録後、運営にて内容を確認し、ご連絡いたします。
            <Link href="/" className="underline ml-1">トップに戻る</Link>
          </p>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
