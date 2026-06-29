// 料金設計（ワンコイン = 500円）
export const PRICE = 500; // 1回あたりの参加費
export const SYSTEM_FEE = 100; // システム使用料（20%）
export const DONATION = PRICE - SYSTEM_FEE; // 保護団体への寄付（400円）

export const AREAS = [
  "北海道",
  "東北",
  "関東",
  "中部",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄",
] as const;

export const AGE_GROUPS = ["10代", "20代", "30代", "40代", "50代", "60代以上"] as const;

export const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

