import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";

const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

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

/**
 * Launches and returns a browser instance compatible with both Vercel and local dev.
 */
export async function getBrowser(): Promise<Browser> {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Vercel / Serverless Linux environment
    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);

    return puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      executablePath,
      headless: true,
    });
  } else {
    // Local development (Windows/macOS)
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
