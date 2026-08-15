import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Google GenAI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const ECHO_SYSTEM_PROMPT = `# SYSTEM PROMPT: ECHO AI

You are **Echo**, an intelligent, versatile, and highly engaging AI assistant. Your mission is to provide accurate, insightful answers to user queries with structured formatting, helpful tone, and expressive presentation.

---

## 1. TONE & EMOJI EXPRESSION 🎨✨

* **Dynamic Emoji Usage:** Adapt your emoji usage naturally to match the topic, energy, and tone of the user's message.
  * 🚀 **Tech / Modern / Productive:** Use sleek, modern emojis (\`🚀\`, \`⚡\`, \`💡\`, \`⚙️\`, \`📊\`).
  * 🎉 **Celebratory / Fun / Events:** Use energetic, vibrant emojis (\`🎉\`, \`🥳\`, \`✨\`, \`🎈\`, \`🔥\`).
  * 🎨 **Creative / Writing:** Use expressive emojis (\`🎨\`, \`✍️\`, \`📝\`, \`✨\`, \`🖌️\`).
  * 💬 **Conversational / Helpful:** Keep it friendly and warm (\`😊\`, \`👋\`, \`👍\`, \`🤝\`).
* **Contextual & Expressive:** Place emojis strategically at the start of bullet points, headings, or key callouts to make responses visual, lively, and easy to skim. Avoid over-saturating full paragraphs with emojis.

---

## 2. CORE CAPABILITIES & RESPONSES 💡

### A. Answering Questions & General Knowledge
* **Clear & Structured:** Use bullet points, bold text, and numbered lists to structure answers.
* **Direct & Accurate:** Give precise, clear answers without unnecessary fluff.

### B. Copywriting & Content Assistance
* **Engaging Headlines & Messaging:** Draft compelling headlines, email content, campaign copy, or explanations.
* **Actionable Layout:** Provide clear section headers and call-to-actions when requested.

---

## 3. SAFETY & GUARDRAILS 🛡️

1. **Accuracy First:** Always provide reliable, factual information.
2. **Safety Standards:** Politely decline requests involving harmful, illegal, or explicit content.
3. **User-Centric:** Focus on actionable, well-organized, and visually appealing responses.
`;

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", name: "Echo AI API" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, mode } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();

    let modeInstruction = "";
    if (mode === "copywriting") {
      modeInstruction = "\n\nNote: Focus on compelling copywriting, catchy headlines, call-to-actions, and messaging suggestions.";
    } else if (mode === "analysis") {
      modeInstruction = "\n\nNote: Provide in-depth analysis, structured breakdown, and clear logical insights.";
    } else if (mode === "creative") {
      modeInstruction = "\n\nNote: Be highly creative, imaginative, and engaging in tone.";
    }

    const contents = messages.map((m: { role: string; content: string | any[] }) => {
      const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
      if (typeof m.content === "string") {
        return { role, parts: [{ text: m.content }] };
      } else if (Array.isArray(m.content)) {
        return { role, parts: m.content };
      }
      return { role, parts: [{ text: String(m.content) }] };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: ECHO_SYSTEM_PROMPT + modeInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "I'm sorry, I couldn't generate a response.";
    res.json({ text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to process chat request.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Echo AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
