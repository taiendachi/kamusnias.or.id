// Site-wide configuration. Edit ad slot IDs and sheet info here.

export const SITE = {
  name: "Kamus Nias - Li Niha",
  longName: "Kamus Nias - Li Niha",
  tagline: "Kamus Bahasa Nias terlengkap — Indonesia ⇄ Nias (Li Niha)",
  description:
    "Kamus Nias - Li Niha. Kamus Bahasa Nias online terlengkap untuk terjemahan Indonesia ⇄ Nias, dilengkapi jenis kata, contoh, dan artikel seputar Bahasa Nias.",
  locale: "id_ID",
  contactEmail: "info.kamusnias@gmail.com",
  // Google Sheet (must be published / shareable). Uses gviz CSV endpoint — no API key needed.
  sheetId: "1z-MNQCt0Id7BayxJHJx8N_JQ06JtZvBtGKWLs9tb8-8",
  sheetName: "",
  twitter: "@kamusnias",
  organization: "Kamus Nias",
  // Dukungan / Support
  support: {
    number: "085213307191",
    numberDisplay: "0852-1330-7191",
    accountName: "Taien Dachi",
    // Upload QR GoPay dan DANA ke public/ dan isi src di bawah jika ada
    gopayQrImage: "/gopay-qr.jpg",
    danaQrImage: "/dana-qr.jpg",
  },
} as const;

export const csvUrl = () => {
  const base = `https://docs.google.com/spreadsheets/d/${SITE.sheetId}/gviz/tq?tqx=out:csv`;
  return SITE.sheetName ? `${base}&sheet=${encodeURIComponent(SITE.sheetName)}` : base;
};

// Ad slot configuration. Placeholders by default — replace with real publisher IDs later.
export const ADS = {
  adsense: {
    enabled: false,
    client: "ca-pub-XXXXXXXXXXXXXXXX",
    slots: {
      header: "1111111111",
      inArticle: "2222222222",
      sidebar: "3333333333",
      stickyMobile: "4444444444",
    },
  },
  mgid: { enabled: false, widgetId: "MGID-WIDGET-ID" },
  asterra: { enabled: false, zoneId: "ASTERRA-ZONE-ID" },
  banner: { enabled: true },
} as const;
