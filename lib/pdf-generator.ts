import { getBrowser } from "./browser";

export interface GeneratePdfOptions {
  url: string;
  format?: "A4" | "Letter" | "Legal" | "Tabloid";
  landscape?: boolean;
}

/**
 * Navigates to a URL and generates a PDF buffer using Puppeteer.
 */
export async function generatePdfFromUrl(
  options: GeneratePdfOptions
): Promise<Uint8Array> {
  const { url, format = "A4", landscape = false } = options;

  const browser = await getBrowser();
  let page;

  try {
    page = await browser.newPage();

    // Set viewport for clean rendering
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the target URL and wait for domcontentloaded
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format,
      landscape,
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    return new Uint8Array(pdfBuffer);
  } finally {
    if (page) {
      try {
        await page.close();
      } catch {
        // ignore
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore
      }
    }
  }
}
