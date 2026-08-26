import { jsPDF } from "jspdf";
import { CandidateProfile, GeneratedResume, JobPosting } from "../types";

export function generateAtsPdf(resumeText: string, filename: string = "ATS_Resume.pdf") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter"
  });

  const margin = 36; // 0.5 inch = 36 pt
  const pageWidth = 612; // letter width in pt
  const maxLineWidth = pageWidth - margin * 2;
  let cursorY = margin + 10;

  // Split lines
  const lines = resumeText.split("\n");

  doc.setTextColor(20, 20, 20);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      cursorY += 4;
      continue;
    }

    // Main Candidate Title (# NAME)
    if (line.startsWith("# ")) {
      const name = line.replace("# ", "").replace(/\*/g, "");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(name, pageWidth / 2, cursorY, { align: "center" });
      cursorY += 16;
    }
    // Section Header (## HEADER)
    else if (line.startsWith("## ")) {
      const header = line.replace("## ", "").replace(/\*/g, "");
      cursorY += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(header.toUpperCase(), margin, cursorY);
      
      // Bottom divider line
      doc.setDrawColor(40, 40, 40);
      doc.setLineWidth(0.75);
      doc.line(margin, cursorY + 2, pageWidth - margin, cursorY + 2);
      cursorY += 12;
    }
    // Sub-header (### Subtitle)
    else if (line.startsWith("### ")) {
      const sub = line.replace("### ", "").replace(/\*/g, "");
      cursorY += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text(sub, margin, cursorY);
      cursorY += 10;
    }
    // Contact line or strong metadata
    else if (line.startsWith("**Contact**:") || line.startsWith("**Email**:")) {
      const clean = line.replace(/\*\*/g, "");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      doc.text(clean, pageWidth / 2, cursorY, { align: "center" });
      doc.setTextColor(20, 20, 20);
      cursorY += 11;
    }
    // Bullet item (- Item)
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      const bulletText = line.substring(2).replace(/\*\*/g, "");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      // Draw bullet point
      doc.circle(margin + 4, cursorY - 2.5, 1.2, "F");
      
      const wrapped = doc.splitTextToSize(bulletText, maxLineWidth - 16);
      doc.text(wrapped, margin + 12, cursorY);
      cursorY += wrapped.length * 10.5 + 2;
    }
    // Normal paragraph text / italics
    else {
      doc.setFont("helvetica", line.startsWith("*") ? "italic" : "normal");
      doc.setFontSize(9);
      const clean = line.replace(/\*/g, "");
      const wrapped = doc.splitTextToSize(clean, maxLineWidth);
      doc.text(wrapped, margin, cursorY);
      cursorY += wrapped.length * 10.5;
    }

    // Safety check for page break (keep strictly 1-page density)
    if (cursorY > 750) {
      break;
    }
  }

  doc.save(filename);
}
