import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Illust } from "@/components/Illust";
import { PawTrack } from "@/components/PawTrack";
import { listOrgs } from "@/lib/db";
import { PRICE, SYSTEM_FEE, DONATION, yen } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Home() {
  let approvedOrgs: Awaited<ReturnType<typeof listOrgs>> = [];
  try {
    approvedOrgs = (await listOrgs()).filter((o) => o.status === "approved");
  } catch {
    approvedOrgs = [];
  }

  return (
    <main>
      <SiteHeader />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-unpopo-yellow/40 blur-2xl" />
        <div className="absolute top-20 right-0 h-56 w-56 rounded-full bg-unpopo-pinklight/60 blur-2xl" />
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 grid md:grid-cols-2 gap-8 items-center relative">
          <div>
            <span className="inline-block bg-unpopo-pink text-white text-sm font-extrabold px-4 py-1.5 rounded-full anim-bob">
              🐾 ワンコイン500円ではじめる
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight text-unpopo-ink">
              保護犬と、
              <span className="text-unpopo-yellowdeep">おさんぽ。</span>
              <br />
              心も体も、ぽかぽか。
            </h1>
            <p className="mt-4 text-unpopo-ink/80 text-lg leading-relaxed">
              「いきなり里親は不安…でも犬と触れ合いたい」そんなあなたへ。
              <br className="hidden sm:block" />
              ウンポポ君が、保護犬の活動をしている団体とあなたをつなぎます。
              気軽なおさんぽが、保護活動の応援になります。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register/walker" className="btn-pink px-7 py-3 text-lg">
                🐕 散歩したい方はこちら
              </Link>
              <Link href="/register/org" className="btn-primary px-7 py-3 text-lg">
                🏠 保護団体の方はこちら
              </Link>
            </div>
            <p className="mt-3 text-sm text-unpopo-ink/60">
              登録は無料・1分で完了します
            </p>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute inset-0 m-auto h-72 w-72 rounded-blob bg-gradient-to-br from-unpopo-yellow/60 to-unpopo-pinklight/60 anim-float" />
            <Illust name="walking" anim="walk" priority className="relative w-[320px] max-w-full" />
            <span className="absolute top-4 right-10 text-3xl anim-heartbeat">💛</span>
            <span className="absolute bottom-6 left-6 text-2xl anim-bob">🐾</span>
          </div>
        </div>
        <PawTrack className="py-2" />
      </section>

      {/* ===== メリット ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-unpopo-ink">
          みんなが、しあわせになる仕組み
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="card p-7">
            <div className="flex items-center gap-4">
              <Illust name="patting" anim="bob" className="w-28" />
              <div>
                <h3 className="text-xl font-extrabold text-unpopo-pink">散歩したいあなたへ</h3>
                <p className="text-sm text-unpopo-ink/70">気軽に、犬とふれあえる</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-unpopo-ink/85">
              <li className="flex gap-2"><span>🐾</span>まずは気軽に犬と触れ合える</li>
              <li className="flex gap-2"><span>🚶</span>おさんぽで自然と運動のきっかけに</li>
              <li className="flex gap-2"><span>💖</span>犬とのふれあいで心が落ち着く・癒される</li>
              <li className="flex gap-2"><span>🏡</span>将来の里親候補として、相性をじっくり確認できる</li>
            </ul>
          </div>
          <div className="card p-7">
            <div className="flex items-center gap-4">
              <Illust name="brushing" anim="wiggle" className="w-28" />
              <div>
                <h3 className="text-xl font-extrabold text-unpopo-yellowdeep">保護団体のみなさまへ</h3>
                <p className="text-sm text-unpopo-ink/70">活動を、もっと広く</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-unpopo-ink/85">
              <li className="flex gap-2"><span>📣</span>保護活動を知ってもらう機会が増える</li>
              <li className="flex gap-2"><span>🤝</span>里親候補の方と実際に会える</li>
              <li className="flex gap-2"><span>💰</span>参加費の一部が寄付として団体に届く</li>
              <li className="flex gap-2"><span>🐕</span>犬たちの社会化・運動の機会にもなる</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 仕組み ===== */}
      <section id="flow" className="bg-white/60 border-y-2 border-unpopo-yellow/40 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-unpopo-ink">
            おさんぽまでの 4ステップ
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "1", t: "登録する", d: "散歩したい方・保護団体それぞれが登録。無料です。", ic: "📝", il: "goingout" as const },
              { n: "2", t: "マッチング", d: "お住まいのエリアで参加団体とマッチング。", ic: "🔍", il: "walking" as const },
              { n: "3", t: "ワンコイン", d: "1回500円を支払って、おさんぽ予約。", ic: "🪙", il: "patting" as const },
              { n: "4", t: "おさんぽ♪", d: "保護犬とふれあい、活動を応援。", ic: "🐕", il: "washing" as const },
            ].map((s) => (
              <div key={s.n} className="card p-6 text-center relative">
                <span className="absolute -top-3 -left-3 h-9 w-9 grid place-items-center rounded-full bg-unpopo-pink text-white font-extrabold shadow">
                  {s.n}
                </span>
                <Illust name={s.il} anim="bob" className="mx-auto w-24" />
                <div className="text-2xl mt-2">{s.ic}</div>
                <h3 className="mt-1 font-extrabold text-unpopo-ink">{s.t}</h3>
                <p className="mt-1 text-sm text-unpopo-ink/75">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 料金 ===== */}
      <section id="price" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-unpopo-ink">
          ワンコイン{yen(PRICE)}の、ゆくえ
        </h2>
        <p className="text-center mt-2 text-unpopo-ink/70">
          1回のおさんぽ参加費は、こんなふうに使われます。
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="card p-8 text-center">
            <div className="text-unpopo-ink/70 font-bold">1回あたり</div>
            <div className="text-6xl font-extrabold text-unpopo-yellowdeep my-2">{yen(PRICE)}</div>
            <div className="mt-6 space-y-4 text-left">
              <div>
                <div className="flex justify-between font-bold">
                  <span>💝 保護団体への寄付</span>
                  <span className="text-unpopo-pink">{yen(DONATION)}</span>
                </div>
                <div className="mt-1 h-4 rounded-full bg-unpopo-pinklight overflow-hidden">
                  <div className="h-full bg-unpopo-pink" style={{ width: `${(DONATION / PRICE) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold">
                  <span>⚙️ システム使用料</span>
                  <span className="text-unpopo-yellowdeep">{yen(SYSTEM_FEE)}</span>
                </div>
                <div className="mt-1 h-4 rounded-full bg-unpopo-cream overflow-hidden">
                  <div className="h-full bg-unpopo-yellowdeep" style={{ width: `${(SYSTEM_FEE / PRICE) * 100}%` }} />
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-unpopo-ink/70">
              参加費の <b className="text-unpopo-pink">{Math.round((DONATION / PRICE) * 100)}%</b> が、
              保護犬の活動をしている団体への寄付になります。
            </p>
          </div>
          <div className="relative flex justify-center">
            <Illust name="washing" anim="float" className="w-72" />
            <span className="absolute -top-2 right-10 text-3xl anim-heartbeat">💧</span>
          </div>
        </div>
      </section>

      {/* ===== 参加団体 ===== */}
      <section className="bg-white/60 border-y-2 border-unpopo-yellow/40 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-unpopo-ink">
            いっしょに活動する団体
          </h2>
          {approvedOrgs.length === 0 ? (
            <p className="text-center mt-6 text-unpopo-ink/70">
              現在準備中です。最初の参加団体になりませんか？
            </p>
          ) : (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedOrgs.slice(0, 6).map((o) => (
                <div key={o.id} className="card p-6">
                  <div className="flex items-center gap-2 text-unpopo-ink/60 text-sm font-bold">
                    <span>📍 {o.area}</span>
                    {o.dog_count > 0 && <span>・🐕 {o.dog_count}頭</span>}
                  </div>
                  <h3 className="mt-1 text-lg font-extrabold text-unpopo-ink">{o.name}</h3>
                  <p className="mt-2 text-sm text-unpopo-ink/75 line-clamp-3">{o.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/register/org" className="btn-primary px-6 py-3">団体として参加する</Link>
          </div>
        </div>
      </section>

      {/* ===== 便利機能 ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-unpopo-ink">
          安心して使える、うれしい機能
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { ic: "🗺️", t: "エリアマッチング", d: "お住まいの地域で近くの参加団体とつながれます。" },
            { ic: "✅", t: "審査つきで安心", d: "団体・参加者ともに運営が確認。はじめてでも安心です。" },
            { ic: "💌", t: "里親への第一歩", d: "おさんぽを通じて相性を確認し、里親への道もサポート。" },
            { ic: "📊", t: "寄付の見える化", d: "あなたの参加費がいくら寄付になったか分かります。" },
            { ic: "🐾", t: "おさんぽ記録", d: "ふれあった子の記録を残して、思い出を振り返れます。" },
            { ic: "🔔", t: "イベント通知", d: "保護犬の譲渡会やイベント情報をお届け予定。" },
          ].map((f) => (
            <div key={f.t} className="card p-6 hover:-translate-y-1 transition-transform">
              <div className="text-3xl">{f.ic}</div>
              <h3 className="mt-2 font-extrabold text-unpopo-ink">{f.t}</h3>
              <p className="mt-1 text-sm text-unpopo-ink/75">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-center text-2xl font-extrabold text-unpopo-ink">よくある質問</h2>
        <div className="mt-8 space-y-3">
          {[
            { q: "犬を飼ったことがなくても大丈夫？", a: "もちろん大丈夫です。団体スタッフがサポートするので、はじめての方も安心してご参加いただけます。" },
            { q: "必ず里親にならないといけませんか？", a: "いいえ。まずは気軽におさんぽを楽しむことが目的です。もし相性が良ければ里親をご検討いただけます。" },
            { q: "500円はどう支払いますか？", a: "現在は団体での受け渡し・運営での記録に対応しています。オンライン決済は今後対応予定です。" },
            { q: "雨の日はどうなりますか？", a: "天候や犬の体調により中止になる場合があります。団体と相談のうえ日程を調整できます。" },
          ].map((f) => (
            <details key={f.q} className="card p-5">
              <summary className="font-extrabold text-unpopo-ink cursor-pointer list-none flex justify-between">
                <span>Q. {f.q}</span>
                <span className="faq-mark text-unpopo-pink transition-transform duration-200">＋</span>
              </summary>
              <p className="mt-3 text-unpopo-ink/80 text-sm">A. {f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== 最終CTA ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-4">
        <div className="card p-8 sm:p-12 text-center bg-gradient-to-br from-unpopo-cream to-unpopo-pinklight/50 relative overflow-hidden">
          <Illust name="goingout" anim="walk" className="mx-auto w-44" />
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-unpopo-ink">
            さあ、ウンポポ君と<br className="sm:hidden" />おさんぽに行こう！
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/register/walker" className="btn-pink px-7 py-3 text-lg">散歩したい方の登録</Link>
            <Link href="/register/org" className="btn-primary px-7 py-3 text-lg">保護団体の登録</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
