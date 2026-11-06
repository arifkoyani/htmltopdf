"use client";

import { useState } from "react";

export default function UrlToPdfForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/urltopdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      if (!res.ok) {
        let errorMsg = "Failed to convert URL to PDF";
        try {
          const errData = await res.json();
          if (errData?.message) errorMsg = errData.message;
        } catch {
          // ignore if response is not JSON
        }
        setResult({ success: false, message: errorMsg });
        return;
      }

      // Handle file download
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "page.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setResult({
        success: true,
        message: "PDF converted and downloaded successfully!",
      });
    } catch {
      setResult({
        success: false,
        message: "Network error: Unable to reach the server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          URL to PDF Converter
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter any webpage URL to capture and download as a PDF
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url-input"
            className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Webpage URL <span className="text-red-500">*</span>
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Converting URL to PDF...
            </>
          ) : (
            "Convert to PDF"
          )}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-4 rounded-xl text-sm font-medium border text-center ${
            result.success
              ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30 text-green-800 dark:text-green-300"
              : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
