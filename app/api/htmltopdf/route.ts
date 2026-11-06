import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const maxDuration = 60;

// Path to locally installed Chrome on Windows for dev mode
function getLocalChromePath(): string {
  if (process.env.NODE_ENV === "production") return "";

  const localPaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];

  try {
    const fs = require("fs");
    for (const p of localPaths) {
      if (fs.existsSync(/* turbopackIgnore: true */ p)) return p;
    }
  } catch {
    // ignore
  }
  return "";
}

// Sparticuz Chromium remote binary pack for serverless / Vercel
const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

async function getBrowser() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Vercel / AWS Lambda environment: downloads binary once to /tmp
    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);

    return puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      executablePath,
      headless: true,
    });
  } else {
    // Local development: use locally installed Chrome / Edge
    const localPath = getLocalChromePath();

    if (!localPath) {
      throw new Error("No local Chrome or Edge installation found.");
    }

    return puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: localPath,
      headless: true,
    });
  }
}

export async function POST(request: NextRequest) {
  let browser;
  try {
    const body = await request.json();
    const { html, css, js, filename } = body;

    if (!html) {
      return NextResponse.json(
        { success: false, message: "HTML content is required" },
        { status: 400 }
      );
    }

    const pdfFilename =
      filename && filename.endsWith(".pdf") ? filename : "document.pdf";

    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${css ? `<style>${css}</style>` : ""}
</head>
<body>
  ${html}
  ${js ? `<script>${js}</script>` : ""}
</body>
</html>`;

    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(fullHtml, {
      waitUntil: "domcontentloaded",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    await browser.close();
    browser = null;

    // Return the PDF buffer as downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfFilename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("PDF generation error:", error);
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore
      }
    }
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: `PDF generation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
