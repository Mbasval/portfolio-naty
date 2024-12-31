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
      loadPDF('./assets/portfolio.pdf'); // Load the PDF
    }, 1000); // Matches the CSS transition duration
  });
  
  // Load PDF when Enter button is clicked
  function loadPDF(url) {
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');
  
    pdfjsLib.getDocument(url).promise.then(pdf => {
      renderPage(pdf, 1); // Render the first page initially
  
      // You can add event listeners for next/prev page buttons here
      document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < pdf.numPages) {
          renderPage(pdf, ++currentPage);
        }
      });
  
      document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
          renderPage(pdf, --currentPage);
        }
      });
  
      // Current page tracker
      let currentPage = 1;
  
      // Function to render a page
      function renderPage(pdf, pageNum) {
        pdf.getPage(pageNum).then(page => {
          const scale = getResponsiveScale();
          const viewport = page.getViewport({ scale });
  
          // Resize the canvas to fit the viewport
          canvas.width = viewport.width;
          canvas.height = viewport.height;
  
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        });
      }
  
      // Function to calculate scale based on window size
      function getResponsiveScale() {
        const containerWidth = pdfViewer.clientWidth;
        const containerHeight = pdfViewer.clientHeight;
  
        // Set the maximum scale based on container size
        const scale = Math.min(containerWidth / 800, containerHeight / 1000); // Adjust these values as needed
        return scale;
      }
    });
  }
});
