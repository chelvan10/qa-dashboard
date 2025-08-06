"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
  dashboardTitle?: string;
  includeTimestamp?: boolean;
  watermark?: string;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({ 
  targetRef, 
  fileName = "dashboard.pdf",
  dashboardTitle = "QE Dashboard",
  includeTimestamp = true,
  watermark = "QE Dashboard - Confidential"
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!targetRef.current) return;
    
    setIsExporting(true);
    
    try {
      const element = targetRef.current;
      
      // Create canvas with high quality
      const canvas = await html2canvas(element, { 
        scale: 2, 
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        useCORS: true,
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // Create PDF with proper sizing
      const pdf = new jsPDF({ 
        orientation: "portrait", 
        unit: "mm", 
        format: "a4" 
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header section
      const headerHeight = 25;
      const margin = 10;
      
      // Add header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, headerHeight, 'F');
      
      // Add title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(dashboardTitle, margin, 15);
      
      // Add timestamp
      if (includeTimestamp) {
        const timestamp = new Date().toLocaleString();
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated: ${timestamp}`, pageWidth - margin - 40, 15);
      }
      
      // Calculate content area
      const contentY = headerHeight + 5;
      const contentHeight = pageHeight - headerHeight - 15;
      const contentWidth = pageWidth - 2 * margin;
      
      // Calculate image scaling to fit content area
      const imgAspectRatio = canvas.width / canvas.height;
      let imgWidth = contentWidth;
      let imgHeight = contentWidth / imgAspectRatio;
      
      // If image is too tall, scale by height
      if (imgHeight > contentHeight) {
        imgHeight = contentHeight;
        imgWidth = contentHeight * imgAspectRatio;
      }
      
      // Center the image
      const imgX = margin + (contentWidth - imgWidth) / 2;
      
      // Add the dashboard image
      pdf.addImage(
        imgData, 
        "PNG", 
        imgX, 
        contentY, 
        imgWidth, 
        imgHeight,
        undefined,
        'FAST'
      );
      
      // Add watermark
      if (watermark) {
        pdf.setTextColor(200, 200, 200);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        const watermarkWidth = pdf.getTextWidth(watermark);
        pdf.text(watermark, (pageWidth - watermarkWidth) / 2, pageHeight - 5);
      }
      
      // Add border
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, contentY, contentWidth, contentHeight);
      
      // Generate filename with timestamp
      const timestamp = includeTimestamp ? 
        `_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}` : '';
      const finalFileName = fileName.replace('.pdf', '') + timestamp + '.pdf';
      
      // Save the PDF
      pdf.save(finalFileName);
      
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-2">
      <button
        className={`
          px-6 py-3 rounded-lg shadow-lg transition-all duration-200
          flex items-center space-x-2 text-sm font-medium
          ${isExporting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
          }
          text-white border-2 border-indigo-800 
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        `}
        onClick={handleExportPDF}
        disabled={isExporting}
        title="Export dashboard as PDF"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
              />
            </svg>
            <span>Export PDF</span>
          </>
        )}
      </button>
    </div>
  );
};
