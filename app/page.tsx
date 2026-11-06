"use client";

import { useState } from "react";

const TEMPLATES = {
  invoice: {
    name: "Invoice",
    filename: "invoice.pdf",
    html: `<div class="invoice-box">
  <div class="header">
    <div>
      <h1 class="logo">ACME Corp</h1>
      <p class="subtitle">Invoice #INV-2026-001</p>
    </div>
    <div class="date-info">
      <p><strong>Date:</strong> Nov 7, 2026</p>
      <p><strong>Due:</strong> Nov 21, 2026</p>
    </div>
  </div>

  <div class="bill-to">
    <h3>Billed To:</h3>
    <p>John Doe</p>
    <p>john.doe@example.com</p>
    <p>123 Innovation Drive, Silicon Valley, CA</p>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Web Application Development</td>
        <td class="text-right">1</td>
        <td class="text-right">$1,200.00</td>
        <td class="text-right">$1,200.00</td>
      </tr>
      <tr>
        <td>Cloud Infrastructure Setup</td>
        <td class="text-right">1</td>
        <td class="text-right">$450.00</td>
        <td class="text-right">$450.00</td>
      </tr>
      <tr>
        <td>Playwright PDF Export Integration</td>
        <td class="text-right">1</td>
        <td class="text-right">$350.00</td>
        <td class="text-right">$350.00</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="text-right"><strong>Subtotal:</strong></td>
        <td class="text-right">$2,000.00</td>
      </tr>
      <tr class="grand-total">
        <td colspan="3" class="text-right"><strong>Total Due:</strong></td>
        <td class="text-right"><strong>$2,000.00</strong></td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    <p>Thank you for your business! Please send payment within 14 days.</p>
  </div>
</div>`,
    css: `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
  padding: 20px;
}
.invoice-box {
  max-width: 800px;
  margin: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #2563eb;
  padding-bottom: 20px;
  margin-bottom: 30px;
}
.logo {
  color: #2563eb;
  margin: 0;
  font-size: 28px;
}
.subtitle {
  color: #6b7280;
  margin: 5px 0 0 0;
}
.date-info p {
  margin: 3px 0;
  text-align: right;
  font-size: 14px;
}
.bill-to {
  margin-bottom: 30px;
}
.bill-to h3 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #4b5563;
  text-transform: uppercase;
}
.bill-to p {
  margin: 2px 0;
  font-size: 14px;
}
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}
.items-table th {
  background: #f3f4f6;
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.items-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}
.text-right {
  text-align: right;
}
.grand-total td {
  font-size: 16px;
  border-top: 2px solid #2563eb;
  color: #2563eb;
}
.footer {
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  margin-top: 50px;
}`,
    js: ``,
  },
  certificate: {
    name: "Certificate",
    filename: "certificate.pdf",
    html: `<div class="cert-container">
  <div class="cert-border">
    <p class="cert-org">NEXT.JS MASTERY ACADEMY</p>
    <h1 class="cert-title">Certificate of Completion</h1>
    <p class="cert-subtitle">This is proudly presented to</p>
    <h2 class="cert-name">Alex Morgan</h2>
    <p class="cert-desc">For outstanding achievement in mastering modern fullstack web development, serverless automation, and automated document generation.</p>
    <div class="cert-signatures">
      <div class="sig-block">
        <div class="sig-line"></div>
        <p>Lead Instructor</p>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <p>Academy Director</p>
      </div>
    </div>
  </div>
</div>`,
    css: `body {
  font-family: Georgia, serif;
  margin: 0;
  padding: 10px;
  background-color: #fff;
}
.cert-container {
  border: 4px solid #1e3a8a;
  padding: 10px;
}
.cert-border {
  border: 2px dashed #93c5fd;
  padding: 40px;
  text-align: center;
}
.cert-org {
  letter-spacing: 4px;
  color: #64748b;
  font-size: 13px;
  font-weight: bold;
}
.cert-title {
  font-size: 38px;
  color: #1e3a8a;
  margin: 15px 0 20px 0;
}
.cert-subtitle {
  font-style: italic;
  font-size: 16px;
  color: #475569;
}
.cert-name {
  font-size: 32px;
  color: #0f172a;
  border-bottom: 2px solid #cbd5e1;
  display: inline-block;
  padding-bottom: 5px;
  margin: 10px 0 20px 0;
}
.cert-desc {
  max-width: 600px;
  margin: 0 auto 50px auto;
  font-size: 15px;
  line-height: 1.6;
  color: #334155;
}
.cert-signatures {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}
.sig-line {
  width: 180px;
  border-top: 1px solid #64748b;
  margin-bottom: 6px;
}
.sig-block p {
  font-size: 13px;
  color: #64748b;
}`,
    js: ``,
  },
};

export default function Home() {
  const [html, setHtml] = useState(
    "<html><body><h1>Hello World</h1><p>This is a sample PDF document.</p></body></html>"
  );
  const [css, setCss] = useState(
    "body { font-family: Arial, sans-serif; padding: 20px; }\nh1 { color: #2563eb; }\np { color: #374151; font-size: 16px; }"
  );
  const [js, setJs] = useState("");
  const [filename, setFilename] = useState("document.pdf");
  const [pageFormat, setPageFormat] = useState("A4");
  const [landscape, setLandscape] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key];
    setHtml(t.html);
    setCss(t.css);
    setJs(t.js);
    setFilename(t.filename);
  };

  const handleGenerate = async (downloadDirect: boolean = true) => {
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
          filename,
          pageFormat,
          landscape,
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

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);

      if (downloadDirect) {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setResult({
        success: true,
        message: downloadDirect
          ? `PDF "${filename}" downloaded successfully!`
          : `PDF preview generated successfully!`,
      });
    } catch {
      setResult({ success: false, message: "Failed to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              HTML to PDF Studio
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Convert HTML, CSS & JS into production-ready PDFs. Serverless and Vercel compatible.
            </p>
          </div>
          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mr-1">
              Presets:
            </span>
            <button
              onClick={() => applyTemplate("invoice")}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            >
              📄 Invoice
            </button>
            <button
              onClick={() => applyTemplate("certificate")}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            >
              🏆 Certificate
            </button>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Output Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="document.pdf"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Page Format
            </label>
            <select
              value={pageFormat}
              onChange={(e) => setPageFormat(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A4">A4 (Standard)</option>
              <option value="Letter">US Letter</option>
              <option value="Legal">Legal</option>
              <option value="Tabloid">Tabloid</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Orientation
            </label>
            <select
              value={landscape ? "landscape" : "portrait"}
              onChange={(e) => setLandscape(e.target.value === "landscape")}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => handleGenerate(true)}
              disabled={loading || !html || !filename}
              className="flex-1 h-[38px] px-4 rounded-lg bg-blue-600 text-white font-semibold text-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? "Generating..." : "⬇ Download PDF"}
            </button>
            <button
              onClick={() => handleGenerate(false)}
              disabled={loading || !html || !filename}
              className="h-[38px] px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              title="Preview in browser without downloading"
            >
              👁 Preview
            </button>
          </div>
        </div>

        {/* Status Message */}
        {result && (
          <div
            className={`mb-6 rounded-xl border p-4 ${
              result.success
                ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30 text-green-800 dark:text-green-300"
                : "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 text-red-800 dark:text-red-300"
            } flex items-center gap-2`}
          >
            <span>{result.success ? "✓" : "✕"}</span>
            <span className="font-medium text-sm">{result.message}</span>
          </div>
        )}

        {/* Code Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* HTML */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              HTML <span className="text-red-500">*</span>
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="flex-1 min-h-[260px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="<html><body>...</body></html>"
            />
          </div>

          {/* CSS */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              CSS <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="flex-1 min-h-[260px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="body { margin: 0; }"
            />
          </div>
        </div>

        {/* JavaScript (Optional) */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            JavaScript <span className="text-zinc-400 font-normal">(executed before rendering)</span>
          </label>
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="w-full min-h-[100px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            placeholder="// document.getElementById('...').innerText = '...';"
          />
        </div>

        {/* PDF In-Browser Preview Window */}
        {previewUrl && (
          <div className="mt-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900">
            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                📄 Live PDF Preview
              </span>
              <a
                href={previewUrl}
                download={filename}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
              >
                Download File
              </a>
            </div>
            <iframe
              src={previewUrl}
              className="w-full h-[650px] border-none"
              title="PDF Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
