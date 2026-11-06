import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromUrl } from "@/lib/pdf-generator";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "A valid 'url' is required" },
        { status: 400 }
      );
    }

    // Validate URL protocol
    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { success: false, message: "URL must start with http:// or https://" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid URL format provided" },
        { status: 400 }
      );
    }

    // Generate the PDF buffer
    const pdfBuffer = await generatePdfFromUrl({ url });

    // Derive a clean filename from hostname
    let filename = "page.pdf";
    try {
      const host = new URL(url).hostname.replace(/[^a-zA-Z0-9.-]/g, "_");
      filename = `${host}.pdf`;
    } catch {
      // fallback to default
    }

    // Return downloadable PDF stream
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("URL to PDF error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate PDF from URL";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

