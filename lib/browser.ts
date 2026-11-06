import { chromium, Browser } from "playwright";

let browserInstance: Browser | null = null;

/**
 * Gets or creates a Playwright Chromium browser instance.
 */
export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserInstance;
}

/**
 * Closes the active browser instance if running.
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    try {
      await browserInstance.close();
    } catch {
      // ignore close errors
    } finally {
      browserInstance = null;
    }
  }
}

