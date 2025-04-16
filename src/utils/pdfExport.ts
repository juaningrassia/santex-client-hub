import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (
  elementId: string,
  fileName: string,
  title: string
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Save original scroll
    const originalScrollPos = window.scrollY;

    // Margin and spacing configuration (in mm)
    const margins = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 20
    };

    // Get total dimensions of the element
    const { height } = element.getBoundingClientRect();
    const totalHeight = Math.max(height, element.scrollHeight);
    const a4Width = 210;
    const a4Height = 297;
    const contentWidth = a4Width - margins.left - margins.right;
    const contentHeight = a4Height - margins.top - margins.bottom;
    const maxCanvasHeight = 1200;
    const numPages = Math.ceil(totalHeight / maxCanvasHeight);

    // Create the PDF with compression
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Configure font and styles
    pdf.setFont('helvetica');
    
    // Capture each section of the document
    for (let i = 0; i < numPages; i++) {
      // If not the first page, add a new one
      if (i > 0) {
        pdf.addPage();
      }

      // On the first page, add title and date
      if (i === 0) {
        pdf.setFontSize(18);
        pdf.text(title, margins.left, margins.top);
        pdf.setFontSize(11);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margins.left, margins.top + 10);
        pdf.setLineWidth(0.5);
        pdf.line(margins.left, margins.top + 15, a4Width - margins.right, margins.top + 15);
      }

      // Scroll to the correct position
      window.scrollTo(0, i * maxCanvasHeight);
      
      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Apply temporary styles for better capture
      const originalStyle = element.style.cssText;
      element.style.padding = '20px';
      element.style.backgroundColor = '#ffffff';

      // Add extra padding at the end of content to avoid cuts
      if (i === numPages - 1) {
        element.style.paddingBottom = '50px';
      }

      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to 1.5 for better file size
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowHeight: maxCanvasHeight,
        y: i * maxCanvasHeight,
        height: Math.min(maxCanvasHeight, totalHeight - (i * maxCanvasHeight)),
        onclone: (document) => {
          // Adjust styles in clone for better visualization
          const clone = document.getElementById(elementId);
          if (clone) {
            clone.style.padding = '20px';
            clone.style.backgroundColor = '#ffffff';
            // Adjust spacing between elements
            const elements = clone.getElementsByClassName('space-y-6');
            for (const el of Array.from(elements)) {
              (el as HTMLElement).style.marginBottom = '30px';
            }
            // Add extra space at the end of strategic questions
            const questions = clone.querySelectorAll('ol li');
            if (questions.length > 0) {
              (questions[questions.length - 1] as HTMLElement).style.marginBottom = '40px';
            }
          }
        }
      });

      // Restore original styles
      element.style.cssText = originalStyle;

      // Optimize image quality and compression
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Changed from PNG to JPEG with 95% quality
      const imgProps = pdf.getImageProperties(imgData);
      
      // Calculate dimensions maintaining aspect ratio and respecting margins
      const pdfWidth = contentWidth;
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Adjust height to not exceed useful page content
      const availableHeight = contentHeight - (i === 0 ? 25 : 0);
      if (pdfHeight > availableHeight) {
        pdfHeight = availableHeight;
      }

      // Position image respecting margins
      const yPosition = i === 0 ? margins.top + 25 : margins.top;
      
      // Add image with compression
      pdf.addImage({
        imageData: imgData,
        format: 'JPEG',
        x: margins.left,
        y: yPosition,
        width: pdfWidth,
        height: pdfHeight,
        compression: 'FAST',
        rotation: 0
      });

      // Add page number with more space
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Page ${i + 1} of ${numPages}`,
        a4Width / 2,
        a4Height - (margins.bottom / 3),
        { align: 'center' }
      );
      pdf.setTextColor(0, 0, 0);
    }

    // Restore original scroll position
    window.scrollTo(0, originalScrollPos);

    // Save PDF with optimization
    const pdfOutput = pdf.output('arraybuffer');
    const blob = new Blob([pdfOutput], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}; 