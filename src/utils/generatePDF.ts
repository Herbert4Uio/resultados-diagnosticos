import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const generateAssessmentPDF = async (elementId: string, companyName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  // Optimize html-to-image to prevent Recharts rendering issues
  const dataUrl = await toJpeg(element, {
    quality: 1,
    backgroundColor: '#ffffff',
    pixelRatio: 2, // Higher resolution
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(dataUrl);
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Additional pages if the content is long
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`Resultados_${companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
};
