"use client";

// ─────────────────────────────────────────────────────────
// VaultGuarantees — Marvel MerchStore Official Promises
// 3 Core Promises: Tracked delivery, Fair stock, Event access
// ─────────────────────────────────────────────────────────
import { Truck, ShieldCheck, QrCode, Sparkles } from "lucide-react";
import Link from "next/link";
import { soundFx } from "@/lib/sound";

export default function VaultGuarantees() {
  const guarantees = [
    {
      icon: <Truck size={28} className="text-red-500" />,
      title: "Tracked Express Delivery",
      description:
        "Safe and secure packaging with live tracking. Free shipping on orders over ₹1,999.",
      badge: "Safe Shipping",
    },
    {
      icon: <ShieldCheck size={28} className="text-[#00f0ff]" />,
      title: "Instant Stock Lock",
      description:
        "Fair shopping for everyone. Your item is held safely in your cart for 10 minutes.",
      badge: "Fair Access",
    },
    {
      icon: <QrCode size={28} className="text-amber-400" />,
      title: "Event Pass QR Unlock",
      description:
        "Scan your Comic-Con ticket QR code or type your event pass code to unlock special drops.",
      badge: "QR Badge Unlock",
      actionHref: "/unlock",
      actionText: "Unlock Now →",
    },
  ];

  return (
    <section className="bg-[#08080c] py-16 border-y border-[#1e1e2a] relative overflow-hidden text-white">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-[0.25em] flex items-center gap-2 mb-2">
              <Sparkles size={14} />
              THE MARVEL GUARANTEE
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide uppercase font-black">
              BUILT FOR MARVEL FANS OF ALL AGES.
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md mt-2 md:mt-0 leading-relaxed font-normal">
            Every item is 100% authentic, officially licensed, and delivered with care for superhero fans everywhere.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((item) => (
            <div
              key={item.title}
              onMouseEnter={() => soundFx.playHover()}
              className="bg-[#14141c] border border-[#1e1e2a] hover:border-red-500/40 p-8 rounded-xs transition-all duration-300 hover:-translate-y-1 shadow-lg relative group flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-[#08080c] border border-[#1e1e2a] rounded-xs group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-900 px-2.5 py-1 border border-gray-800">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-display text-2xl text-white tracking-wide uppercase mb-3 font-extrabold">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              {item.actionHref && (
                <Link
                  href={item.actionHref}
                  onClick={() => soundFx.playUnlock()}
                  className="text-xs font-bold uppercase tracking-widest text-amber-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  {item.actionText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
