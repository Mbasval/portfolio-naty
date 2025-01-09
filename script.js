// Initialize PDF viewer
let currentPage = 1;
let pdfDoc = null;
const scale = 1.5; // PDF zoom scale
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const linkLayer = document.getElementById('link-layer'); // Invisible layer for links

// PDF.js setup
pdfjsLib.getDocument('assets/portfolio.pdf').promise.then(function (pdf) {
  pdfDoc = pdf;
  renderPage(currentPage);
});

// Render page function
function renderPage(num) {
  pdfDoc.getPage(num).then(function (page) {
    const viewport = page.getViewport({ scale: scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render the page into the canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    page.render(renderContext).promise.then(() => {
      renderLinks(page, viewport); // Add links after rendering
    });
  });
}

// Render links function
function renderLinks(page, viewport) {
  linkLayer.innerHTML = ''; // Clear existing links
  page.getAnnotations().then(function (annotations) {
    annotations.forEach(function (annotation) {
      if (annotation.subtype === 'Link' && annotation.url) {
        const rect = pdfjsLib.Util.normalizeRect(annotation.rect);
        const viewportRect = viewport.convertToViewportRectangle(rect);

        // Create a clickable link
        const link = document.createElement('a');
        link.href = annotation.url;
        link.target = '_blank';
        link.style.position = 'absolute';
        link.style.left = `${viewportRect[0]}px`;
        link.style.top = `${viewportRect[1]}px`;
        link.style.width = `${viewportRect[2] - viewportRect[0]}px`;
        link.style.height = `${viewportRect[3] - viewportRect[1]}px`;
        link.style.zIndex = 1000;
        link.style.pointerEvents = 'auto'; // Enable pointer interaction
        link.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Optional: Highlight for debugging
        linkLayer.appendChild(link);
      }
    });
  });
}

// Navigation buttons functionality
prevBtn.addEventListener('click', function () {
  if (currentPage <= 1) return;
  currentPage--;
  renderPage(currentPage);
});

nextBtn.addEventListener('click', function () {
  if (currentPage >= pdfDoc.numPages) return;
  currentPage++;
  renderPage(currentPage);
});

// Enter button functionality (transition to PDF viewer)
document.getElementById('enter-btn').addEventListener('click', function () {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('pdf-viewer').style.display = 'flex';
});
