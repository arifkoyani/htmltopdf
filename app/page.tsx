"use client";

import { useState } from "react";

export default function Home() {
  const [html, setHtml] = useState(
    "<html><body><h1>Hello World</h1><p>This is a sample PDF document.</p></body></html>"
  );
  const [css, setCss] = useState(
    "body { font-family: Arial, sans-serif; padding: 20px; }\nh1 { color: #2563eb; }\np { color: #374151; font-size: 16px; }"
  );
  const [js, setJs] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/htmltopdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          css: css || undefined,
          js: js || undefined,
          filename: "document.pdf",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setResult({
          success: false,
          message: errorData.message || "PDF generation failed",
        });
        return;
      }

      // Download the PDF automatically
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setResult({
        success: true,
        message: "PDF generated and downloaded successfully!",
      });
    } catch {
      setResult({ success: false, message: "Failed to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            HTML to PDF Converter
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Enter your HTML, CSS, and JS code below and click generate.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* HTML Input */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              HTML <span className="text-red-500">*</span>
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-[240px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your HTML code..."
            />
          </div>

          {/* CSS Input */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              CSS <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full h-[240px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your CSS code..."
            />
          </div>
        </div>

        {/* JS Input */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            JavaScript <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="w-full h-[100px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your JavaScript code..."
          />
        </div>

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={handleGenerate}
            disabled={loading || !html.trim()}
            className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-base transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? "Generating PDF..." : "Generate PDF"}
          </button>
        </div>

        {/* Status */}
        {result && (
          <div
            className={`rounded-xl border p-4 text-center ${
              result.success
                ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30 text-green-800 dark:text-green-300"
                : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
            }`}
          >
            <span className="font-medium text-sm">{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
