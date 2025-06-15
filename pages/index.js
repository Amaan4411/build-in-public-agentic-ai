import { useEffect, useState } from "react";

export default function Home() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch("/api/generate");
      const data = await res.json();
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🚀 Build In Public Tracker</h1>
      {loading ? (
        <p>Loading today’s post...</p>
      ) : (
        <>
          <h2>Day {post.day} - {post.date}</h2>
          <p><b>Time:</b> {post.time}</p>
          <div style={{ marginTop: 20, background: "#f4f4f4", padding: 20, borderRadius: 8 }}>
            <p>{post.text}</p>
          </div>
        </>
      )}
    </div>
  );
}