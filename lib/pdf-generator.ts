import { getBrowser } from "./browser";

export interface GeneratePdfOptions {
  url: string;
  format?: "A4" | "Letter" | "Legal" | "Tabloid";
  landscape?: boolean;
}

/**
 * Navigates to a URL and generates a PDF buffer using Playwright.
 */
export async function generatePdfFromUrl(
  options: GeneratePdfOptions
): Promise<Buffer> {
  const { url, format = "A4", landscape = false } = options;

  const browser = await getBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the target URL and wait until the network is idle
    await page.goto(url, {
      waitUntil: "networkidle",
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

    return pdfBuffer;
  } finally {
    // Always close context/page to free memory
    await context.close();
  }
}

