import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Lazy initialize Gemini client safely
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      ai = new GoogleGenAI({
        apiKey: apiKey || "MOCK_KEY", // safeguard
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API Endpoint: AI Translate Nias-Indo-English
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, from, to } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Teks tidak boleh kosong" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          translation: `[Mode Simulasi] Terjemahan untuk "${text}" (Kunci API Gemini belum aktif di Secrets)`,
          pronunciation: "Pro-nun-ci-a-tion key will appear here with active AI",
          culturalContext:
            "Konteks budaya instan bertenaga kecerdasan buatan (Gemini 3.5) akan muncul di sini setelah Anda mengonfigurasi Secrets API Key di panel AI Studio.",
          breakdown: [
            {
              word: text.split(" ")[0] || text,
              meaning: "Simulasi makna kata pertama",
              explanation:
                "Aktifkan kunci API di menu samping untuk memanfaatkan analitik terjemahan kata per kata Ono Niha AI yang sangat akurat!",
            },
          ],
        });
      }

      const client = getGeminiClient();

      const prompt = `Masyarakat Nias memiliki bahasa tersendiri (Li Niha). Mohon pelajari kata/kalimat ini:
Teks yang diterjemahkan: "${text}"
Bahasa asal: "${from}"
Bahasa tujuan: "${to}"

Diberikan teks tersebut, harap lakukan penerjemahan berkualitas tinggi. Harap berikan pula petunjuk pengucapan fonetis bahasa Nias jika bahasa tujuannya adalah Nias, uraian makna kata-kata kunci secara detail, serta kaitan makna tersebut dengan adat-istiadat suku Nias (seperti tatanan hukum adat Fondrakö, dewan adat, budaya Megalitik, sistem kemasyarakatan banua, atau filosofi kehidupan).

Penting: Berikan tanggapan akhir hannya dalam format objek JSON terstruktur di bawah ini, tanpa awalan markdown \`\`\`json atau akhiran teks lainnya.

{
  "translation": "Hasil terjemahan bahasa sasaran yang natural dan berbudaya",
  "pronunciation": "Petunjuk pelafalan fonetik (khususnya untuk huruf hidup khusus ö dan w di bahasa Nias)",
  "culturalContext": "Paragraf ulasan mendalam mengenai kaitan kata/frasa ini terhadap adat istiadat, nilai kekeluargaan, sejarah, atau hukum adat Nias",
  "breakdown": [
    {
      "word": "kata penting",
      "meaning": "arti atau padanan kata sasaran",
      "explanation": "penjelasan tata bahasa atau makna filosofis spesifik"
    }
  ]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Anda adalah 'Ono Niha AI', sebuah asisten AI ensiklopedis dan pakar linguistik bahasa Nias (Li Niha) serta antropologi budaya Pulau Nias. Anda bersikap sangat edukatif, ramah, dan teliti. Anda selalu mengembalikan keluaran dalam bentuk JSON murni yang valid.",
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          res.json(parsed);
        } catch (err) {
          console.error("JSON parsing failed, raw answer:", responseText);
          // Return a structured backup
          res.json({
            translation: responseText.replace(/[\{\}"]/g, "").trim(),
            pronunciation: "Pengucapan terekam dalam narasi",
            culturalContext: "Informasi budaya diproses secara naratif.",
            breakdown: [],
          });
        }
      } else {
        throw new Error("Respon kosong dari AI");
      }
    } catch (error: any) {
      console.error("Translation error details:", error);
      res.status(500).json({ error: "Gagal memproses terjemahan AI: " + (error.message || error) });
    }
  });

  // API Endpoint: Get Detailed Etymology and Cultural Context of a Nias Word
  app.post("/api/explain-word", async (req, res) => {
    try {
      const { word, meaningIndo, category } = req.body;
      if (!word) {
        return res.status(400).json({ error: "Kata tidak boleh kosong" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          explanation: `Kata **"${word}"** merupakan kosakata bertemakan ${category || "Keseharian"} yang berarti "${meaningIndo || "padanan kata"}".\n\n*(Silakan hubungkan API Key Anda pada Secrets panel di Google AI Studio untuk memunculkan penjelasan etimologis, perbandingan dialek, pelafalan audio fonetis, serta analisis budaya yang komprehensif dari Ono Niha AI!)*`,
          usageExamples: [
            {
              nias: `Saohagölö khöu me no ösura kata ${word}.`,
              translation: `Terima kasih kepadamu karena sudah menulis kata ${word}.`,
            },
          ],
        });
      }

      const client = getGeminiClient();

      const prompt = `Sediakan penjelasan komprehensif untuk kata bahasa Nias berikut ini:
Kata: "${word}"
Padanan Indonesia awal: "${meaningIndo || ""}"
Kategori kata: "${category || ""}"

Berikan ulasan akademis-antropologis yang elegan dalam Bahasa Indonesia yang menjelaskan makna filosofis kata tersebut bagi peradaban masyarakat Nias (Ono Niha), struktur morfologinya (jika ada imbuhan atau perubahan bentuk fonetik), serta perbedaan penerapannya di dialek Nias Utara, Nias Tengah, maupun Nias Selatan.

Format keluaran harus merupakan objek JSON murni tanpa hiasan markdown yang memiliki skema:
{
  "explanation": "Penjelasan mendalam multi-paragraf yang kaya akan pengetahuan budaya dan linguistik",
  "usageExamples": [
    {
      "nias": "Contoh kalimat dalam bahasa Nias menggunakan kata tersebut",
      "translation": "Arti kalimat tersebut dalam bahasa Indonesia"
    },
    {
      "nias": "Contoh kalimat bernada hormat atau adat lainnya",
      "translation": "Arti kalimat adat tersebut dalam bahasa Indonesia"
    }
  ]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Anda adalah 'Ono Niha AI', kurator sejarah, rupa adat, dan tata bahasa Nias yang berdedikasi tinggi. Tanggapan Anda mendalam, kaya akan sejarah lisan mbanua, serta mengembalikan JSON murni.",
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          res.json(parsed);
        } catch (parseError) {
          res.json({
            explanation: responseText,
            usageExamples: [],
          });
        }
      } else {
        throw new Error("Respon etimologi kosong dari AI");
      }
    } catch (err: any) {
      console.error("Explain word error:", err);
      res.status(500).json({ error: "Gagal memproses etimologi kata: " + (err.message || err) });
    }
  });

  // Serve static files in production or hook up Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ono Niha Server] Backend active on port ${PORT}`);
  });
}

startServer().catch((e) => {
  console.error("Fatal: failed to start custom server", e);
});
