document.addEventListener('DOMContentLoaded', () => {
  const welcome = document.getElementById('welcome');
  const pdfViewer = document.getElementById('pdf-viewer');
  const enterBtn = document.getElementById('enter-btn');

  // Enter Button Click
  enterBtn.addEventListener('click', () => {
    welcome.style.opacity = '0'; // Fade out welcome screen
    setTimeout(() => {
      welcome.style.display = 'none'; // Remove welcome screen
      pdfViewer.style.display = 'block'; // Show PDF viewer
    }, 1000); // Matches the CSS transition duration
  });

  // Example of how to load a PDF (replace with actual PDF URL)
  const pdfUrl = './assets/portfolio.pdf'; // Path to the PDF file
  loadPDF(pdfUrl);
});

// Function to load and render PDF
function loadPDF(url) {
  const canvas = document.getElementById('pdf-canvas');
  const context = canvas.getContext('2d');
  
  pdfjsLib.getDocument(url).promise.then(pdf => {
    pdf.getPage(1).then(page => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  });
}
