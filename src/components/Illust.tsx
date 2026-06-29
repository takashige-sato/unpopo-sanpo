"use client";

import { motion } from "framer-motion";

type Anim = "float" | "bob" | "wiggle" | "walk" | "heartbeat" | "none";

const animClass: Record<Anim, string> = {
  float: "anim-float",
  bob: "anim-bob",
  wiggle: "anim-wiggle",
  walk: "anim-walk",
  heartbeat: "anim-heartbeat",
  none: "",
};

export const ILLUSTS = {
  walking: "/illustrations/03_walking_dog.png",
  patting: "/illustrations/08_patting_dog.png",
  brushing: "/illustrations/02_brushing_dog.png",
  washing: "/illustrations/06_washing_dog.png",
  goingout: "/illustrations/10_going_out_with_dog.png",
} as const;

export type IllustKey = keyof typeof ILLUSTS;

export function Illust({
  name,
  anim = "float",
  className = "",
  alt = "ウンポポ君と保護犬のイラスト",
  width,
  priority = false,
}: {
  name: IllustKey;
  anim?: Anim;
  className?: string;
  alt?: string;
  width?: number;
  priority?: boolean;
}) {
  return (
    <motion.img
      src={ILLUSTS[name]}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      initial={priority ? false : { opacity: 0, scale: 0.85, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.06, rotate: 2 }}
      transition={{ type: "spring", stiffness: 160, damping: 14 }}
      style={width ? { width } : undefined}
      className={`${animClass[anim]} select-none drop-shadow-[0_8px_14px_rgba(176,122,79,0.18)] ${className}`}
      draggable={false}
    />
  );
}
