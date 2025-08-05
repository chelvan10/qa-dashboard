"use client";

import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({ targetRef, fileName = "dashboard.pdf" }) => {
  const handleExportPDF = async () => {
    if (!targetRef.current) return;
    const element = targetRef.current;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#fff' });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Calculate image dimensions to fit A4 with margin and border
    const margin = 10;
    const borderWidth = 2;
    const imgWidth = pageWidth - 2 * margin - 2 * borderWidth;
    const imgHeight = pageHeight - 2 * margin - 2 * borderWidth;
    // Draw border
    pdf.setDrawColor(44, 62, 80);
    pdf.setLineWidth(borderWidth);
    pdf.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    // Add image
    pdf.addImage(imgData, "PNG", margin + borderWidth, margin + borderWidth, imgWidth, imgHeight);
    pdf.save(fileName);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-2">
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg border-2 border-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={handleExportPDF}
      >
        Export PDF
      </button>
    </div>
  );
};
