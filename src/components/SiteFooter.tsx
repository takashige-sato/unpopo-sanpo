import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-unpopo-yellow/50 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 sm:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-unpopo-ink">
            <img src="/illustrations/08_patting_dog.png" alt="" className="h-9 w-9 object-contain" />
            おさんぽマッチング
          </div>
          <p className="mt-2 text-unpopo-ink/70">
            保護犬とあなたをつなぐ、ワンコインのおさんぽ体験。
          </p>
        </div>
        <div>
          <p className="font-bold mb-2">メニュー</p>
          <ul className="space-y-1 text-unpopo-ink/80">
            <li><Link href="/register/walker" className="hover:underline">散歩したい方の登録</Link></li>
            <li><Link href="/register/org" className="hover:underline">保護団体の登録</Link></li>
            <li><Link href="/#flow" className="hover:underline">マッチングの仕組み</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-2">運営</p>
          <ul className="space-y-1 text-unpopo-ink/80">
            <li><Link href="/admin" className="hover:underline">管理ページ</Link></li>
            <li>お問い合わせ：info@example.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-unpopo-ink/60 pb-6">
        © {new Date().getFullYear()} ウンポポ君のおさんぽマッチング
      </div>
    </footer>
  );
}
