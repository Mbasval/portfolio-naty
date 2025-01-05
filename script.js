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
});

// Render a specific page with height-fit scaling
function renderPage(pageNum) {
  pdfDoc.getPage(pageNum).then(function (page) {
    const viewport = page.getViewport({ scale: 1 });

    // Calculate scale to fit window height
    const windowHeight = window.innerHeight;
    const scale = windowHeight / viewport.height;

    const scaledViewport = page.getViewport({ scale: scale });
    pdfCanvas.width = scaledViewport.width * window.devicePixelRatio;
    pdfCanvas.height = scaledViewport.height * window.devicePixelRatio;

    const ctx = pdfCanvas.getContext('2d');
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport,
    };

    // Render the page on the canvas
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

// Update PDF rendering when the window resizes
window.addEventListener('resize', function () {
  renderPage(currentPage);
});
