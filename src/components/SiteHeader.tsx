import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b-2 border-unpopo-yellow/50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-unpopo-ink">
          <img src="/illustrations/03_walking_dog.png" alt="" className="h-10 w-10 object-contain anim-bob" />
          <span className="text-lg sm:text-xl">ウンポポ君のおさんぽマッチング</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-2 text-sm font-bold">
          <Link href="/#flow" className="px-3 py-2 rounded-full hover:bg-unpopo-cream">仕組み</Link>
          <Link href="/#price" className="px-3 py-2 rounded-full hover:bg-unpopo-cream">料金</Link>
          <Link href="/register/walker" className="btn-pink px-4 py-2">散歩したい</Link>
          <Link href="/register/org" className="btn-primary px-4 py-2">団体登録</Link>
        </nav>
      </div>
    </header>
  );
}
