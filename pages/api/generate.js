import fs from "fs";
import path from "path";
import axios from "axios";

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const postsPath = path.join(process.cwd(), "data", "posts.json");

  let posts = [];
  if (fs.existsSync(postsPath)) {
    posts = JSON.parse(fs.readFileSync(postsPath, "utf-8") || "[]");
  }

  const existing = posts.find(p => p.date === today);
  if (existing) return res.status(200).json(existing);

  const prompt = `Write a short, fun, text-only daily post (with emojis, hashtags, and a builder vibe) for Day ${posts.length + 1} of building an AI fitness app in public.`;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const text = response.data?.[0]?.generated_text || "No idea generated.";
    const newPost = {
      day: posts.length + 1,
      date: today,
      time: new Date().toLocaleTimeString(),
      text
    };

    posts.push(newPost);
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

    res.status(200).json(newPost);
  } catch (err) {
    console.error("HuggingFace Error:", err.message);
    res.status(500).json({ error: "Failed to generate post." });
  }
}