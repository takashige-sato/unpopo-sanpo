"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { yen } from "@/lib/constants";
import { toCSV, downloadCSV } from "@/lib/csv";
import type { Org, Walker, Payment, Payout, Status } from "@/lib/types";

type Tab = "dashboard" | "orgs" | "walkers" | "payments" | "payouts";
const fmtDate = (s: string) => (s ? new Date(s).toLocaleDateString("ja-JP") : "");

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");

  const [orgs, setOrgs] = useState<Org[]>([]);
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);

  const headers = useCallback(
    (t: string) => ({ "Content-Type": "application/json", "x-admin-token": t }),
    []
  );

  const loadAll = useCallback(
    async (t: string) => {
      setLoading(true);
      const [o, w, p, po] = await Promise.all([
        fetch("/api/orgs", { headers: headers(t) }).then((r) => r.json()),
        fetch("/api/walkers", { headers: headers(t) }).then((r) => r.json()),
        fetch("/api/payments", { headers: headers(t) }).then((r) => r.json()),
        fetch("/api/payouts", { headers: headers(t) }).then((r) => r.json()),
      ]);
      setOrgs(o.orgs ?? []);
      setWalkers(w.walkers ?? []);
      setPayments(p.payments ?? []);
      setPayouts(po.payouts ?? []);
      setLoading(false);
    },
    [headers]
  );

  // セッション中はパスワードを保持
  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("unpopo_admin_token") : null;
    if (saved) {
      setToken(saved);
      verify(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verify(t: string) {
    const res = await fetch("/api/orgs", { headers: headers(t) });
    if (res.ok) {
      setAuthed(true);
      setToken(t);
      sessionStorage.setItem("unpopo_admin_token", t);
      await loadAll(t);
      return true;
    }
    return false;
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const ok = await verify(pwInput);
    if (!ok) setAuthError("パスワードが違います");
  }

  function logout() {
    sessionStorage.removeItem("unpopo_admin_token");
    setAuthed(false);
    setToken("");
    setPwInput("");
  }

  // ===== 集計 =====
  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === "paid");
    const revenue = paid.reduce((s, p) => s + p.amount, 0);
    const fee = paid.reduce((s, p) => s + p.system_fee, 0);
    const donation = paid.reduce((s, p) => s + p.donation, 0);
    const paidOut = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

    const byOrg = new Map<string, { collected: number; paid: number }>();
    for (const p of paid) {
      const k = p.org_name || "未設定";
      const cur = byOrg.get(k) ?? { collected: 0, paid: 0 };
      cur.collected += p.donation;
      byOrg.set(k, cur);
    }
    for (const p of payouts.filter((x) => x.status === "paid")) {
      const k = p.org_name || "未設定";
      const cur = byOrg.get(k) ?? { collected: 0, paid: 0 };
      cur.paid += p.amount;
      byOrg.set(k, cur);
    }
    const orgBalances = [...byOrg.entries()].map(([name, v]) => ({
      name,
      collected: v.collected,
      paid: v.paid,
      balance: v.collected - v.paid,
    }));
    // 未払い総額は、過払い団体が他団体の不足を相殺しないよう正の残高のみ合算
    const unpaid = orgBalances.reduce((s, b) => s + Math.max(b.balance, 0), 0);

    return { count: paid.length, revenue, fee, donation, paidOut, unpaid, orgBalances };
  }, [payments, payouts]);

  if (!authed) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <form onSubmit={onLogin} className="card p-8 w-full max-w-sm text-center">
          <img src="/illustrations/06_washing_dog.png" alt="" className="mx-auto w-24 anim-bob" />
          <h1 className="mt-3 text-xl font-extrabold text-unpopo-ink">管理ページ ログイン</h1>
          <p className="text-sm text-unpopo-ink/60 mt-1">運営者専用</p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            placeholder="パスワード"
            className="mt-5"
            autoFocus
          />
          {authError && <p className="text-red-500 text-sm font-bold mt-2">{authError}</p>}
          <button type="submit" className="btn-primary w-full py-3 mt-4">ログイン</button>
          <Link href="/" className="block mt-4 text-xs text-unpopo-ink/60 underline">サイトに戻る</Link>
        </form>
      </main>
    );
  }

  const tabs: { k: Tab; label: string; icon: string }[] = [
    { k: "dashboard", label: "ダッシュボード", icon: "📊" },
    { k: "orgs", label: "団体管理", icon: "🏠" },
    { k: "walkers", label: "散歩者管理", icon: "🚶" },
    { k: "payments", label: "入金管理", icon: "🪙" },
    { k: "payouts", label: "出金管理", icon: "💸" },
  ];

  return (
    <main className="min-h-screen">
      <header className="bg-white/80 backdrop-blur border-b-2 border-unpopo-yellow/50 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-unpopo-ink">
            <img src="/illustrations/02_brushing_dog.png" alt="" className="h-9 w-9 object-contain" />
            おさんぽマッチング 管理
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => loadAll(token)} className="px-3 py-1.5 rounded-full hover:bg-unpopo-cream font-bold">
              🔄 更新
            </button>
            <button onClick={logout} className="px-3 py-1.5 rounded-full hover:bg-unpopo-cream font-bold">
              ログアウト
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-2 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-4 py-2 text-sm font-bold whitespace-nowrap border-b-4 ${
                tab === t.k ? "border-unpopo-pink text-unpopo-pink" : "border-transparent text-unpopo-ink/60"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {loading && <p className="text-unpopo-ink/60 text-sm mb-3">読み込み中…</p>}

        {tab === "dashboard" && <Dashboard stats={stats} orgsCount={orgs.length} walkersCount={walkers.length} />}
        {tab === "orgs" && (
          <OrgsTab orgs={orgs} token={token} headers={headers} reload={() => loadAll(token)} />
        )}
        {tab === "walkers" && (
          <WalkersTab walkers={walkers} token={token} headers={headers} reload={() => loadAll(token)} />
        )}
        {tab === "payments" && (
          <PaymentsTab
            payments={payments}
            walkers={walkers}
            orgs={orgs}
            token={token}
            headers={headers}
            reload={() => loadAll(token)}
          />
        )}
        {tab === "payouts" && (
          <PayoutsTab
            payouts={payouts}
            orgBalances={stats.orgBalances}
            orgs={orgs}
            token={token}
            headers={headers}
            reload={() => loadAll(token)}
          />
        )}
      </div>
    </main>
  );
}

/* ============ Dashboard ============ */
function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm font-bold text-unpopo-ink/60">{label}</div>
      <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${color}`}>{value}</div>
      {sub && <div className="text-xs text-unpopo-ink/50 mt-1">{sub}</div>}
    </div>
  );
}

function Dashboard({
  stats,
  orgsCount,
  walkersCount,
}: {
  stats: {
    count: number;
    revenue: number;
    fee: number;
    donation: number;
    paidOut: number;
    unpaid: number;
    orgBalances: { name: string; collected: number; paid: number; balance: number }[];
  };
  orgsCount: number;
  walkersCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="おさんぽ実施数" value={`${stats.count} 回`} color="text-unpopo-ink" />
        <StatCard label="売上（参加費合計）" value={yen(stats.revenue)} color="text-unpopo-ink" />
        <StatCard label="システム使用料 合計" value={yen(stats.fee)} color="text-unpopo-yellowdeep" />
        <StatCard label="寄付額 合計" value={yen(stats.donation)} sub={`うち出金済 ${yen(stats.paidOut)}`} color="text-unpopo-pink" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="登録団体数" value={`${orgsCount} 団体`} color="text-unpopo-ink" />
        <StatCard label="登録散歩者数" value={`${walkersCount} 名`} color="text-unpopo-ink" />
        <StatCard label="未払いの寄付（要出金）" value={yen(stats.unpaid)} color="text-red-500" />
      </div>

      <div className="card p-5">
        <h3 className="font-extrabold text-unpopo-ink mb-3">団体別の寄付・出金状況</h3>
        {stats.orgBalances.length === 0 ? (
          <p className="text-sm text-unpopo-ink/60">まだ入金データがありません。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-unpopo-ink/60 border-b-2 border-unpopo-cream">
                  <th className="py-2">団体</th>
                  <th className="py-2 text-right">寄付集計</th>
                  <th className="py-2 text-right">出金済</th>
                  <th className="py-2 text-right">未払い残高</th>
                </tr>
              </thead>
              <tbody>
                {stats.orgBalances.map((b) => (
                  <tr key={b.name} className="border-b border-unpopo-cream/70">
                    <td className="py-2 font-bold">{b.name}</td>
                    <td className="py-2 text-right">{yen(b.collected)}</td>
                    <td className="py-2 text-right">{yen(b.paid)}</td>
                    <td className={`py-2 text-right font-bold ${b.balance > 0 ? "text-red-500" : b.balance < 0 ? "text-orange-500" : "text-unpopo-green"}`}>
                      {yen(b.balance)}
                      {b.balance < 0 && <span className="ml-1 text-xs">(過払い)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ 共通 ============ */
function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    approved: "bg-unpopo-green/20 text-unpopo-green",
    pending: "bg-unpopo-yellow/30 text-unpopo-yellowdeep",
    rejected: "bg-red-100 text-red-500",
  };
  const label: Record<Status, string> = { approved: "承認済", pending: "審査中", rejected: "却下" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[status]}`}>{label[status]}</span>;
}

async function patchStatus(
  url: string,
  status: Status,
  headers: (t: string) => Record<string, string>,
  token: string
) {
  await fetch(url, { method: "PATCH", headers: headers(token), body: JSON.stringify({ status }) });
}

/* ============ 団体 ============ */
function OrgsTab({
  orgs,
  token,
  headers,
  reload,
}: {
  orgs: Org[];
  token: string;
  headers: (t: string) => Record<string, string>;
  reload: () => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-extrabold text-unpopo-ink">団体管理（{orgs.length}）</h2>
        <button
          className="btn-primary px-4 py-2 text-sm"
          onClick={() => downloadCSV("orgs.csv", toCSV(orgs))}
        >
          CSV出力
        </button>
      </div>
      <div className="space-y-3">
        {orgs.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-unpopo-ink">{o.name}</h3>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-sm text-unpopo-ink/70 mt-1">
                  📍{o.area}　👤{o.rep_name}　🐕{o.dog_count}頭
                </p>
                <p className="text-sm text-unpopo-ink/70">✉️{o.email}　📞{o.phone || "-"}</p>
                {o.website && <p className="text-sm text-unpopo-ink/60">🔗{o.website}</p>}
                {o.description && <p className="text-sm text-unpopo-ink/80 mt-1">{o.description}</p>}
                <p className="text-xs text-unpopo-ink/40 mt-1">登録: {fmtDate(o.created_at)}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  className="btn-primary px-3 py-1.5 text-sm"
                  onClick={async () => { await patchStatus(`/api/orgs/${o.id}`, "approved", headers, token); reload(); }}
                >
                  ✅ 承認
                </button>
                <button
                  className="px-3 py-1.5 text-sm rounded-full border-2 border-red-200 text-red-500 font-bold hover:bg-red-50"
                  onClick={async () => { await patchStatus(`/api/orgs/${o.id}`, "rejected", headers, token); reload(); }}
                >
                  却下
                </button>
              </div>
            </div>
          </div>
        ))}
        {orgs.length === 0 && <p className="text-unpopo-ink/60 text-sm">登録された団体はまだありません。</p>}
      </div>
    </div>
  );
}

/* ============ 散歩者 ============ */
function WalkersTab({
  walkers,
  token,
  headers,
  reload,
}: {
  walkers: Walker[];
  token: string;
  headers: (t: string) => Record<string, string>;
  reload: () => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-extrabold text-unpopo-ink">散歩者管理（{walkers.length}）</h2>
        <button className="btn-primary px-4 py-2 text-sm" onClick={() => downloadCSV("walkers.csv", toCSV(walkers))}>
          CSV出力
        </button>
      </div>
      <div className="overflow-x-auto card p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-unpopo-ink/60 border-b-2 border-unpopo-cream">
              <th className="p-2">お名前</th>
              <th className="p-2">エリア</th>
              <th className="p-2">年代</th>
              <th className="p-2">連絡先</th>
              <th className="p-2">状態</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {walkers.map((w) => (
              <tr key={w.id} className="border-b border-unpopo-cream/70 align-top">
                <td className="p-2 font-bold">{w.name}<div className="text-xs text-unpopo-ink/50 font-normal">{w.motivation}</div></td>
                <td className="p-2">{w.area}</td>
                <td className="p-2">{w.age_group}</td>
                <td className="p-2 text-xs">{w.email}<br />{w.phone}</td>
                <td className="p-2"><StatusBadge status={w.status} /></td>
                <td className="p-2">
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 rounded-full bg-unpopo-green/20 text-unpopo-green font-bold text-xs"
                      onClick={async () => { await patchStatus(`/api/walkers/${w.id}`, "approved", headers, token); reload(); }}
                    >承認</button>
                    <button
                      className="px-2 py-1 rounded-full bg-red-100 text-red-500 font-bold text-xs"
                      onClick={async () => { await patchStatus(`/api/walkers/${w.id}`, "rejected", headers, token); reload(); }}
                    >却下</button>
                  </div>
                </td>
              </tr>
            ))}
            {walkers.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-unpopo-ink/60">登録された散歩者はまだいません。</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ 入金 ============ */
function PaymentsTab({
  payments,
  walkers,
  orgs,
  token,
  headers,
  reload,
}: {
  payments: Payment[];
  walkers: Walker[];
  orgs: Org[];
  token: string;
  headers: (t: string) => Record<string, string>;
  reload: () => void;
}) {
  const [walkerName, setWalkerName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!walkerName || !orgName) return;
    setSaving(true);
    await fetch("/api/payments", {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify({ walker_name: walkerName, org_name: orgName, note }),
    });
    setWalkerName(""); setOrgName(""); setNote("");
    setSaving(false);
    reload();
  }

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <h3 className="font-extrabold text-unpopo-ink mb-3">🪙 おさんぽ入金を記録（1回 ¥500）</h3>
        <form onSubmit={add} className="grid sm:grid-cols-4 gap-3 items-end">
          <div>
            <label>散歩者</label>
            <input list="walker-list" value={walkerName} onChange={(e) => setWalkerName(e.target.value)} placeholder="名前を選択/入力" className="mt-1" />
            <datalist id="walker-list">{walkers.map((w) => <option key={w.id} value={w.name} />)}</datalist>
          </div>
          <div>
            <label>団体</label>
            <input list="org-list" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="団体を選択/入力" className="mt-1" />
            <datalist id="org-list">{orgs.map((o) => <option key={o.id} value={o.name} />)}</datalist>
          </div>
          <div>
            <label>メモ</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="任意" className="mt-1" />
          </div>
          <button disabled={saving} className="btn-pink py-2.5 disabled:opacity-60">{saving ? "..." : "記録する"}</button>
        </form>
        <p className="text-xs text-unpopo-ink/50 mt-2">記録すると自動で「寄付¥400／システム使用料¥100」に振り分けられます。</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="font-extrabold text-unpopo-ink">入金履歴（{payments.length}）</h2>
        <button className="btn-primary px-4 py-2 text-sm" onClick={() => downloadCSV("payments.csv", toCSV(payments))}>CSV出力</button>
      </div>
      <div className="overflow-x-auto card p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-unpopo-ink/60 border-b-2 border-unpopo-cream">
              <th className="p-2">日付</th><th className="p-2">散歩者</th><th className="p-2">団体</th>
              <th className="p-2 text-right">参加費</th><th className="p-2 text-right">寄付</th><th className="p-2 text-right">手数料</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-unpopo-cream/70">
                <td className="p-2">{fmtDate(p.created_at)}</td>
                <td className="p-2">{p.walker_name}</td>
                <td className="p-2">{p.org_name}</td>
                <td className="p-2 text-right">{yen(p.amount)}</td>
                <td className="p-2 text-right text-unpopo-pink">{yen(p.donation)}</td>
                <td className="p-2 text-right text-unpopo-yellowdeep">{yen(p.system_fee)}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-unpopo-ink/60">入金履歴はまだありません。</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ 出金 ============ */
function PayoutsTab({
  payouts,
  orgBalances,
  orgs,
  token,
  headers,
  reload,
}: {
  payouts: Payout[];
  orgBalances: { name: string; balance: number }[];
  orgs: Org[];
  token: string;
  headers: (t: string) => Record<string, string>;
  reload: () => void;
}) {
  const [orgName, setOrgName] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!orgName || !amount || !period) return;
    setSaving(true);
    await fetch("/api/payouts", {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify({ org_name: orgName, amount: Number(amount), period, note }),
    });
    setOrgName(""); setAmount(""); setNote("");
    setSaving(false);
    reload();
  }

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <h3 className="font-extrabold text-unpopo-ink mb-3">💸 団体への出金（寄付の振込）を記録</h3>
        <form onSubmit={add} className="grid sm:grid-cols-5 gap-3 items-end">
          <div className="sm:col-span-2">
            <label>団体</label>
            <input list="payout-org-list" value={orgName} onChange={(e) => { setOrgName(e.target.value); const b = orgBalances.find((x) => x.name === e.target.value); if (b && !amount) setAmount(String(Math.max(b.balance, 0))); }} placeholder="団体を選択/入力" className="mt-1" />
            <datalist id="payout-org-list">{orgs.map((o) => <option key={o.id} value={o.name} />)}</datalist>
          </div>
          <div>
            <label>金額(円)</label>
            <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="400" className="mt-1" />
          </div>
          <div>
            <label>対象期間</label>
            <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="mt-1" />
          </div>
          <button disabled={saving} className="btn-primary py-2.5 disabled:opacity-60">{saving ? "..." : "出金記録"}</button>
        </form>
        {orgName && (() => {
          const b = orgBalances.find((x) => x.name === orgName);
          return b ? <p className="text-xs mt-2 text-unpopo-ink/60">この団体の未払い残高: <b className="text-red-500">{yen(b.balance)}</b></p> : null;
        })()}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="font-extrabold text-unpopo-ink">出金履歴（{payouts.length}）</h2>
        <button className="btn-primary px-4 py-2 text-sm" onClick={() => downloadCSV("payouts.csv", toCSV(payouts))}>CSV出力</button>
      </div>
      <div className="overflow-x-auto card p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-unpopo-ink/60 border-b-2 border-unpopo-cream">
              <th className="p-2">日付</th><th className="p-2">団体</th><th className="p-2">対象期間</th>
              <th className="p-2 text-right">金額</th><th className="p-2">メモ</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b border-unpopo-cream/70">
                <td className="p-2">{fmtDate(p.created_at)}</td>
                <td className="p-2 font-bold">{p.org_name}</td>
                <td className="p-2">{p.period}</td>
                <td className="p-2 text-right text-unpopo-green font-bold">{yen(p.amount)}</td>
                <td className="p-2 text-xs text-unpopo-ink/60">{p.note}</td>
              </tr>
            ))}
            {payouts.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-unpopo-ink/60">出金履歴はまだありません。</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
