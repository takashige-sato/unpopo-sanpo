import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DONATION, SYSTEM_FEE, PRICE } from "./constants";
import type { Org, Walker, Payment, Payout, NewOrg, NewWalker } from "./types";

/**
 * データ層。
 * - Supabase の環境変数があれば Supabase(Postgres) を使用（本番・永続化）。
 * - 無ければインメモリのデモストアにフォールバック（デプロイ直後でも動作確認可能）。
 *   ※ デモストアはサーバ再起動でリセットされます。本番運用は Supabase 接続が必要です。
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const usingSupabase = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);

let _client: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL as string, SUPABASE_SERVICE_KEY as string, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

const uid = () =>
  (globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`);

// ---------- インメモリ・デモストア ----------
interface Store {
  orgs: Org[];
  walkers: Walker[];
  payments: Payment[];
  payouts: Payout[];
}

function seed(): Store {
  const now = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
  const orgs: Org[] = [
    {
      id: "demo-org-1",
      name: "わんわんレスキュー仙台",
      rep_name: "佐藤 花子",
      email: "rescue-sendai@example.com",
      phone: "022-000-0001",
      area: "東北",
      website: "https://example.com",
      dog_count: 8,
      description: "東北エリアで保護犬の譲渡活動をしています。人懐っこい子が多いです。",
      status: "approved",
      created_at: now(20),
    },
    {
      id: "demo-org-2",
      name: "おひさまドッグ東京",
      rep_name: "田中 太郎",
      email: "ohisama-dog@example.com",
      phone: "03-000-0002",
      area: "関東",
      website: "",
      dog_count: 15,
      description: "都内を中心に保護・里親探しを行う団体です。",
      status: "approved",
      created_at: now(12),
    },
    {
      id: "demo-org-3",
      name: "なにわ保護犬の会",
      rep_name: "山本 みき",
      email: "naniwa-hogo@example.com",
      phone: "06-000-0003",
      area: "近畿",
      website: "",
      dog_count: 6,
      description: "関西で活動中。散歩ボランティアさん募集しています。",
      status: "pending",
      created_at: now(2),
    },
  ];
  const walkers: Walker[] = [
    {
      id: "demo-wlk-1",
      name: "鈴木 一郎",
      email: "suzuki@example.com",
      phone: "090-0000-0001",
      area: "東北",
      age_group: "30代",
      motivation: "運動不足解消と、犬と触れ合いたいので参加したいです。",
      status: "approved",
      created_at: now(15),
    },
    {
      id: "demo-wlk-2",
      name: "高橋 さくら",
      email: "takahashi@example.com",
      phone: "090-0000-0002",
      area: "関東",
      age_group: "20代",
      motivation: "将来里親になりたく、まずは散歩から関わりたいです。",
      status: "approved",
      created_at: now(9),
    },
    {
      id: "demo-wlk-3",
      name: "伊藤 健",
      email: "ito@example.com",
      phone: "090-0000-0003",
      area: "近畿",
      age_group: "40代",
      motivation: "気分転換に。よろしくお願いします。",
      status: "pending",
      created_at: now(1),
    },
  ];
  const payments: Payment[] = [
    {
      id: "demo-pay-1",
      walker_id: "demo-wlk-1",
      walker_name: "鈴木 一郎",
      org_id: "demo-org-1",
      org_name: "わんわんレスキュー仙台",
      amount: 500,
      system_fee: SYSTEM_FEE,
      donation: DONATION,
      status: "paid",
      note: "",
      created_at: now(10),
    },
    {
      id: "demo-pay-2",
      walker_id: "demo-wlk-2",
      walker_name: "高橋 さくら",
      org_id: "demo-org-2",
      org_name: "おひさまドッグ東京",
      amount: 500,
      system_fee: SYSTEM_FEE,
      donation: DONATION,
      status: "paid",
      note: "",
      created_at: now(6),
    },
    {
      id: "demo-pay-3",
      walker_id: "demo-wlk-1",
      walker_name: "鈴木 一郎",
      org_id: "demo-org-1",
      org_name: "わんわんレスキュー仙台",
      amount: 500,
      system_fee: SYSTEM_FEE,
      donation: DONATION,
      status: "paid",
      note: "",
      created_at: now(3),
    },
  ];
  const payouts: Payout[] = [
    {
      id: "demo-po-1",
      org_id: "demo-org-2",
      org_name: "おひさまドッグ東京",
      amount: 400,
      period: "2026-05",
      status: "paid",
      note: "5月分 振込済み",
      created_at: now(5),
    },
  ];
  return { orgs, walkers, payments, payouts };
}

function memStore(): Store {
  const g = globalThis as unknown as { __unpopoStore?: Store };
  if (!g.__unpopoStore) g.__unpopoStore = seed();
  return g.__unpopoStore;
}

// ---------- 公開 API ----------
export async function listOrgs(): Promise<Org[]> {
  if (usingSupabase) {
    const { data, error } = await sb().from("orgs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Org[]) ?? [];
  }
  return [...memStore().orgs].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function listWalkers(): Promise<Walker[]> {
  if (usingSupabase) {
    const { data, error } = await sb().from("walkers").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Walker[]) ?? [];
  }
  return [...memStore().walkers].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function listPayments(): Promise<Payment[]> {
  if (usingSupabase) {
    const { data, error } = await sb().from("payments").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Payment[]) ?? [];
  }
  return [...memStore().payments].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function listPayouts(): Promise<Payout[]> {
  if (usingSupabase) {
    const { data, error } = await sb().from("payouts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Payout[]) ?? [];
  }
  return [...memStore().payouts].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function createOrg(input: NewOrg): Promise<Org> {
  const row: Org = {
    id: uid(),
    name: input.name,
    rep_name: input.rep_name,
    email: input.email,
    phone: input.phone,
    area: input.area,
    website: input.website ?? "",
    dog_count: input.dog_count ?? 0,
    description: input.description,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  if (usingSupabase) {
    const { data, error } = await sb().from("orgs").insert(row).select().single();
    if (error) throw error;
    return data as Org;
  }
  memStore().orgs.push(row);
  return row;
}

export async function createWalker(input: NewWalker): Promise<Walker> {
  const row: Walker = {
    id: uid(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    area: input.area,
    age_group: input.age_group,
    motivation: input.motivation,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  if (usingSupabase) {
    const { data, error } = await sb().from("walkers").insert(row).select().single();
    if (error) throw error;
    return data as Walker;
  }
  memStore().walkers.push(row);
  return row;
}

export async function updateOrgStatus(id: string, status: Org["status"]): Promise<void> {
  if (usingSupabase) {
    const { error } = await sb().from("orgs").update({ status }).eq("id", id);
    if (error) throw error;
    return;
  }
  const o = memStore().orgs.find((x) => x.id === id);
  if (o) o.status = status;
}

export async function updateWalkerStatus(id: string, status: Walker["status"]): Promise<void> {
  if (usingSupabase) {
    const { error } = await sb().from("walkers").update({ status }).eq("id", id);
    if (error) throw error;
    return;
  }
  const w = memStore().walkers.find((x) => x.id === id);
  if (w) w.status = status;
}

export async function createPayment(input: {
  walker_id?: string | null;
  walker_name: string;
  org_id?: string | null;
  org_name: string;
  note?: string;
}): Promise<Payment> {
  const row: Payment = {
    id: uid(),
    walker_id: input.walker_id ?? null,
    walker_name: input.walker_name,
    org_id: input.org_id ?? null,
    org_name: input.org_name,
    amount: PRICE,
    system_fee: SYSTEM_FEE,
    donation: DONATION,
    status: "paid",
    note: input.note ?? "",
    created_at: new Date().toISOString(),
  };
  if (usingSupabase) {
    const { data, error } = await sb().from("payments").insert(row).select().single();
    if (error) throw error;
    return data as Payment;
  }
  memStore().payments.push(row);
  return row;
}

export async function createPayout(input: {
  org_id?: string | null;
  org_name: string;
  amount: number;
  period: string;
  note?: string;
}): Promise<Payout> {
  const row: Payout = {
    id: uid(),
    org_id: input.org_id ?? null,
    org_name: input.org_name,
    amount: input.amount,
    period: input.period,
    status: "paid",
    note: input.note ?? "",
    created_at: new Date().toISOString(),
  };
  if (usingSupabase) {
    const { data, error } = await sb().from("payouts").insert(row).select().single();
    if (error) throw error;
    return data as Payout;
  }
  memStore().payouts.push(row);
  return row;
}
