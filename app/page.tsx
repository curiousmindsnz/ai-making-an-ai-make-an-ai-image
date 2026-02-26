"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate image");
      } else {
        setImageUrl(data.imageUrl);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Image Generator
          </h1>
          <p className="text-indigo-300 text-lg">
            Describe an image and watch it come to life
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <textarea
            className="w-full rounded-xl border border-indigo-500/40 bg-white/10 text-white placeholder-indigo-300/60 p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            rows={3}
            placeholder="A futuristic city at sunset with flying cars and neon lights..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleGenerate();
              }
            }}
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 text-lg transition"
          >
            {loading ? "Generating…" : "Generate Image"}
          </button>
        </div>

        {error && (
          <div className="w-full rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 p-4 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 text-indigo-300">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Creating your image…</span>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30">
              <Image
                src={imageUrl}
                alt={prompt}
                width={1024}
                height={1024}
                className="w-full h-auto"
                priority
              />
            </div>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-indigo-500/50 text-indigo-300 hover:text-white hover:border-indigo-400 px-6 py-2 transition"
            >
              Open full image ↗
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
