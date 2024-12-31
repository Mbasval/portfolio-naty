const welcomeScreen = document.getElementById('welcome');
const enterBtn = document.getElementById('enter-btn');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfCanvas = document.getElementById('pdf-canvas');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

let currentPage = 1;
let pdfDoc = null;

// Load the PDF file
const url = 'assets/portfolio.pdf';  // Ensure the path is correct
pdfjsLib.getDocument(url).promise.then(function (pdf) {
  pdfDoc = pdf;
  renderPage(currentPage);
});

// Show PDF viewer and hide welcome screen
enterBtn.addEventListener('click', function () {
  welcomeScreen.style.display = 'none';
  pdfViewer.style.display = 'block';
});

// Render a specific page
function renderPage(pageNum) {
  pdfDoc.getPage(pageNum).then(function (page) {
    const scale = 2.0;  // Increase scale for better resolution
    const viewport = page.getViewport({ scale: scale });

    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;

    const ctx = pdfCanvas.getContext('2d');
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    // Render PDF page to canvas
    page.render(renderContext);
  });
}

// Next button functionality
nextBtn.addEventListener('click', function () {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Previous button functionality
prevBtn.addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});
