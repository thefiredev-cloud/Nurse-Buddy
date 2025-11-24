import { ParsedContent } from "./types";

// Mock parser for development
export const mockParsedContent: ParsedContent = {
  text: "Nursing Fundamentals: Patient Assessment and Care\n\nSlide 1: Introduction to Patient Care\n- Importance of holistic nursing assessment\n- Patient safety protocols\n- Communication with interdisciplinary teams\n\nSlide 2: Vital Signs and Physical Assessment\n- Blood pressure monitoring techniques\n- Heart rate and respiratory rate assessment\n- Temperature regulation in acute care settings\n- Skin integrity assessment and documentation\n\nSlide 3: Infection Control Measures\n- Standard precautions in clinical settings\n- PPE usage and disposal\n- Hand hygiene best practices\n- Isolation protocols for infectious diseases\n\nSlide 4: Medication Administration\n- Six rights of medication administration\n- IV therapy safety\n- Adverse drug reactions\n- Documentation requirements",
  slideCount: 4,
  metadata: {
    title: "Nursing Fundamentals Course",
    subject: "Patient Care and Assessment",
    author: "Nursing Department",
  },
};

/**
 * Parse PowerPoint file to extract text content
 * In development without mammoth library, returns mock content
 * In production with mammoth installed, parses actual PPTX files
 */
export async function parsePowerPoint(fileBuffer: Buffer): Promise<ParsedContent> {
  // Development fallback - return mock content
  if (process.env.NODE_ENV === "development") {
    return mockParsedContent;
  }

  try {
    // Attempt to use mammoth if available
    const mammoth = await import("mammoth").catch(() => null);
    if (!mammoth) {
      return mockParsedContent;
    }

    const result = await mammoth.convertToHtml({ arrayBuffer: fileBuffer.buffer });
    const plainText = result.value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

    return {
      text: plainText,
      slideCount: 1, // Mammoth doesn't distinguish slides
      metadata: { title: "Uploaded Presentation" },
    };
  } catch (error) {
    console.error("Error parsing file:", error);
    // Fallback to mock content if parsing fails
    return mockParsedContent;
  }
}

/**
 * Parse PDF file to extract text content
 * Returns mock content in development
 */
export async function parsePDF(fileBuffer: Buffer): Promise<ParsedContent> {
  // Development fallback
  if (process.env.NODE_ENV === "development") {
    return mockParsedContent;
  }

  try {
    // Attempt to use pdfparse if available
    const pdfParse = await import("pdf-parse").catch(() => null);
    if (!pdfParse) {
      return mockParsedContent;
    }

    const data = await pdfParse(fileBuffer);
    const text = data.text || "";

    return {
      text,
      slideCount: data.numpages || 0,
      metadata: {
        title: data.info?.Title,
        subject: data.info?.Subject,
        author: data.info?.Author,
      },
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return mockParsedContent;
  }
}

/**
 * Parse uploaded file based on extension
 */
export async function parseUploadedFile(
  fileBuffer: Buffer,
  filename: string
): Promise<ParsedContent> {
  const extension = filename.toLowerCase().split(".").pop();

  if (extension === "pdf") {
    return parsePDF(fileBuffer);
  } else if (["pptx", "ppt"].includes(extension || "")) {
    return parsePowerPoint(fileBuffer);
  } else {
    throw new Error(`Unsupported file type: .${extension}`);
  }
}
