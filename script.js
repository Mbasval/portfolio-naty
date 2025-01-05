const welcomeScreen = document.getElementById('welcome');
const enterBtn = document.getElementById('enter-btn');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfCanvas = document.getElementById('pdf-canvas');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const orientationWarning = document.createElement('div'); // Warning for landscape mode

let currentPage = 1;
let pdfDoc = null;

// Add a warning for landscape mode on mobile
orientationWarning.id = 'orientation-warning';
orientationWarning.innerText = 'Por favor, gira tu dispositivo a modo horizontal para una mejor visualización.';
orientationWarning.style.display = 'none';
orientationWarning.style.position = 'fixed';
orientationWarning.style.top = '0';
orientationWarning.style.left = '0';
orientationWarning.style.width = '100%';
orientationWarning.style.height = '100%';
orientationWarning.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
orientationWarning.style.color = 'white';
orientationWarning.style.fontSize = '20px';
orientationWarning.style.display = 'flex';
orientationWarning.style.alignItems = 'center';
orientationWarning.style.justifyContent = 'center';
orientationWarning.style.zIndex = '9999';
document.body.appendChild(orientationWarning);

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

    // Adjust for high-resolution screens (e.g., Retina)
    const devicePixelRatio = window.devicePixelRatio || 1;
    pdfCanvas.width = scaledViewport.width * devicePixelRatio;
    pdfCanvas.height = scaledViewport.height * devicePixelRatio;

    pdfCanvas.style.width = `${scaledViewport.width}px`;
    pdfCanvas.style.height = `${scaledViewport.height}px`;

    const ctx = pdfCanvas.getContext('2d');
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); // Scale for high-res displays
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

// Detect orientation changes
function handleOrientationChange() {
  if (window.innerHeight > window.innerWidth) {
    // Portrait mode: show warning
    orientationWarning.style.display = 'flex';
    pdfViewer.style.display = 'none';
  } else {
    // Landscape mode: hide warning
    orientationWarning.style.display = 'none';
    pdfViewer.style.display = 'block';
    renderPage(currentPage);
  }
}

// Re-render the current page when the window is resized
window.addEventListener('resize', function () {
  handleOrientationChange();
  renderPage(currentPage);
});

// Check orientation on load
handleOrientationChange();
