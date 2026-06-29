import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Illust } from "@/components/Illust";

export default function Thanks({ searchParams }: { searchParams: { type?: string } }) {
  const isOrg = searchParams.type === "org";
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Illust name={isOrg ? "brushing" : "goingout"} anim="walk" className="mx-auto w-56" />
        <h1 className="mt-6 text-3xl font-extrabold text-unpopo-ink">
          ご登録ありがとうございます！
        </h1>
        <p className="mt-4 text-unpopo-ink/80 leading-relaxed">
          {isOrg
            ? "保護団体としてのご登録を受け付けました。運営にて内容を確認のうえ、ご連絡いたします。一緒に保護犬とおさんぽの輪を広げましょう！"
            : "おさんぽ参加のご登録を受け付けました。お住まいのエリアの参加団体とマッチングのうえ、ご案内します。ウンポポ君とのおさんぽをお楽しみに！"}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary px-6 py-3">トップに戻る</Link>
          <Link href={isOrg ? "/register/walker" : "/register/org"} className="btn-pink px-6 py-3">
            {isOrg ? "散歩したい方の登録も見る" : "保護団体の登録も見る"}
          </Link>
        </div>
        <p className="mt-6 text-3xl anim-heartbeat">💛🐾</p>
      </section>
      <SiteFooter />
    </main>
  );
}
