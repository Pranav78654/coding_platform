import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🧠 Explain Code
export const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Explain the following ${language} code in simple terms:\n\n${code}`,
      config: {
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 0 }, // disable slow reasoning mode
      },
    });

    res.json({ explanation: response.text });
  } catch (err) {
    console.error("❌ AI explanation failed:", err);
    res.status(500).json({ error: "AI explanation failed" });
  }
};

// ⚙️ Generate Code
export const generateCode = async (req, res) => {
  try {
    const { prompt, language } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${language} code for the following request:\n${prompt}`,
      config: {
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    res.json({ code: response.text });
  } catch (err) {
    console.error("❌ AI generation failed:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
};

// 🧩 Fix Code
export const fixCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // use Pro for deeper reasoning
      contents: `Fix any bugs or syntax issues in the following ${language} code, and explain what was fixed:\n\n${code}`,
      config: {
        temperature: 0.5,
      },
    });

    res.json({ fixedCode: response.text });
  } catch (err) {
    console.error("❌ AI code fixing failed:", err);
    res.status(500).json({ error: "AI code fixing failed" });
  }
};
