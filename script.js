const welcomeScreen = document.getElementById('welcome');
const enterBtn = document.getElementById('enter-btn');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfCanvas = document.getElementById('pdf-canvas');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

let currentPage = 1;
let pdfDoc = null;

// Load the PDF file
const url = 'assets/portfolio.pdf'; // Ensure the path is correct
pdfjsLib.getDocument(url).promise.then(function (pdf) {
  pdfDoc = pdf;
  renderPage(currentPage);
});

// Show PDF viewer and hide welcome screen
enterBtn.addEventListener('click', function () {
  welcomeScreen.style.display = 'none';
  pdfViewer.style.display = 'block';
  renderPage(currentPage);
});

// Render a specific page, scaled to always fit inside the window
function renderPage(pageNum) {
  pdfDoc.getPage(pageNum).then(function (page) {
    const viewport = page.getViewport({ scale: 1 });

    // Calculate scale to ensure the entire page fits within the window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / viewport.width;
    const scaleY = windowHeight / viewport.height;

    // Use the smaller scale factor to ensure no dimension overflows
    const scale = Math.min(scaleX, scaleY);

    const scaledViewport = page.getViewport({ scale: scale });

    pdfCanvas.width = scaledViewport.width;
    pdfCanvas.height = scaledViewport.height;

    const ctx = pdfCanvas.getContext('2d');
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport,
    };

    page.render(renderContext);
  });
}

// Handle "Next" button click
nextBtn.addEventListener('click', function () {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Handle "Previous" button click
prevBtn.addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

// Re-render the current page when the window is resized
window.addEventListener('resize', function () {
  renderPage(currentPage);
});
