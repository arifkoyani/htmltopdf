import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const IS_PRODUCTION = process.env.NODE_ENV === "production";

async function getBrowser() {
  if (IS_PRODUCTION) {
    // Production (Vercel): use @sparticuz/chromium + playwright-core
    const chromium = (await import("@sparticuz/chromium")).default;
    const { chromium: playwrightChromium } = await import("playwright-core");
    return playwrightChromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    // Local development: use regular playwright with locally installed Chromium
    const { chromium: playwrightChromium } = await import("playwright-core");
    // Find the locally installed Chromium from playwright
    const path = await import("path");
    const fs = await import("fs");

    // Try common playwright browser paths on Windows
    const userDir = process.env.LOCALAPPDATA || "";
    const pwDir = path.join(userDir, "ms-playwright");
    let execPath = "";

    if (fs.existsSync(pwDir)) {
      const dirs = fs.readdirSync(pwDir).filter(d => d.startsWith("chromium-"));
      if (dirs.length > 0) {
        const latestChromium = dirs.sort().pop()!;
        execPath = path.join(pwDir, latestChromium, "chrome-win64", "chrome.exe");
      }
    }

    if (!execPath || !fs.existsSync(execPath)) {
      throw new Error(
        "Chromium not found locally. Run: npx playwright install chromium"
      );
    }

    return playwrightChromium.launch({
      executablePath: execPath,
      headless: true,
    });
  }
}

export async function POST(request: NextRequest) {
  let browser;
  try {
    const body = await request.json();
    const { html, css, js, filename, pageFormat, landscape, margins } = body;

    // Validate required fields
    if (!html) {
      return NextResponse.json(
        { success: false, message: "HTML content is required" },
        { status: 400 }
      );
    }

    if (!filename) {
      return NextResponse.json(
        { success: false, message: "Filename is required" },
        { status: 400 }
      );
    }

    // Ensure filename ends with .pdf
    const pdfFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

    // Build the full HTML document with optional CSS and JS
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

    // Launch browser (auto-detects local vs production)
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle" });

    // Generate PDF as buffer with customizable format, orientation, and margins
    const pdfBuffer = await page.pdf({
      format: (pageFormat as "A4" | "Letter" | "Legal" | "Tabloid") || "A4",
      landscape: Boolean(landscape),
      printBackground: true,
      margin: margins || {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    await browser.close();
    browser = null;

    // Check if client expects JSON response (e.g. from cURL with Accept header, or format: 'json')
    const acceptHeader = request.headers.get("accept") || "";
    const wantsJson = body.format === "json" || acceptHeader.includes("application/json");

    // When running locally, save to the local output folder
    const OUTPUT_DIR = String.raw`C:\Users\GLT COMPUTER\OneDrive\Desktop\pdftes\pdf\output`;
    let localFilePath = "";

    try {
      const fs = await import("fs");
      const path = await import("path");
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }
      localFilePath = path.join(OUTPUT_DIR, pdfFilename);
      fs.writeFileSync(localFilePath, pdfBuffer);
    } catch {
      // Ephemeral environments like Vercel don't have write access to local folders
    }

    if (wantsJson) {
      return NextResponse.json({
        success: true,
        message: "PDF generated successfully",
        filename: pdfFilename,
        filePath: localFilePath || `/output/${pdfFilename}`,
      });
    }

    // Default: Return the PDF as a downloadable file for browsers
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
      await browser.close();
    }
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: `PDF generation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
