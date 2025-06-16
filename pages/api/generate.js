import { GoogleGenerativeAI } from "@google/generative-ai";

let posts = []; // in-memory fallback since Vercel can't write files

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Return existing post if already generated
  const existing = posts.find((p) => p.date === today);
  if (existing) return res.status(200).json(existing);

  const genAI = new GoogleGenerativeAI({ apiKey: process.env.HUGGINGFACE_API });
  const model = genAI.getGenerativeModel({ model: "HuggingFaceH4/zephyr-7b-beta" });

  try {
    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          `Write a short, platform-agnostic daily log update (with emojis, hashtags, energy) for Day ${posts.length + 1} of building a Gen Z-targeted AI fitness app in public. Keep it real, enthusiastic, and authentic.`
        ]
      }
    ]);

    const response = await result.response;
    const ideaText = response.text();

    const newPost = {
      day: posts.length + 1,
      date: today,
      time: currentTime,
      text: ideaText
    };

    posts.push(newPost);
    return res.status(200).json(newPost);
  } catch (error) {
    console.error("HuggingFace API error:", error);
    return res.status(500).json({ error: "Generation failed." });
  }
}