import { useEffect, useRef } from "react";
import { ADS } from "@/lib/site-config";

type AdType = "adsense" | "mgid" | "asterra" | "banner";
type SlotName = keyof typeof ADS.adsense.slots;

interface AdSlotProps {
  type?: AdType;
  slot?: SlotName;
  label?: string;
  className?: string;
  height?: number;
}

/**
 * Reusable ad slot. Renders placeholder until enabled in site-config.
 * Supports AdSense, MGID, Asterra, and direct banner.
 */
export function AdSlot({
  type = "adsense",
  slot = "inArticle",
  label,
  className = "",
  height = 100,
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type !== "adsense" || !ADS.adsense.enabled) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [type]);

  const isLive =
    (type === "adsense" && ADS.adsense.enabled) ||
    (type === "mgid" && ADS.mgid.enabled) ||
    (type === "asterra" && ADS.asterra.enabled);

  if (isLive && type === "adsense") {
    return (
      <div className={`my-6 flex justify-center ${className}`} aria-label="Iklan">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={ADS.adsense.client}
          data-ad-slot={ADS.adsense.slots[slot]}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="complementary"
      aria-label={label ?? "Slot iklan"}
      className={`my-6 flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground ${className}`}
      style={{ minHeight: height }}
    >
      <div className="px-4 py-3 text-center">
        <div className="font-medium uppercase tracking-wider">Slot Iklan</div>
        <div className="opacity-70">{label ?? `${type} · ${slot}`}</div>
      </div>
    </div>
  );
}

export function StickyMobileAd() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <AdSlot
        type="adsense"
        slot="stickyMobile"
        label="Sticky mobile"
        height={60}
        className="my-0"
      />
    </div>
  );
}
