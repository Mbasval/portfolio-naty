// Initialize PDF viewer
let currentPage = 1;
let pdfDoc = null;
const scale = 1.5; // PDF zoom scale
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const textLayerDiv = document.getElementById('text-layer');
const annotationLayerDiv = document.getElementById('annotation-layer');

// PDF.js setup
pdfjsLib.getDocument('assets/portfolio.pdf').promise.then(function (pdf) {
  pdfDoc = pdf;
  renderPage(currentPage);
});

// Render page function
function renderPage(num) {
  pdfDoc.getPage(num).then(function (page) {
    const viewport = page.getViewport({ scale: scale });

    // Resize canvas to match PDF page dimensions
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render the PDF page onto the canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page.render(renderContext).promise.then(() => {
      // Render text and annotations after the page is rendered
      renderTextLayer(page, viewport);
      renderAnnotationLayer(page, viewport);
    });
  });
}

// Render the text layer for selectable text
function renderTextLayer(page, viewport) {
  textLayerDiv.innerHTML = ''; // Clear existing text layer
  textLayerDiv.style.width = `${viewport.width}px`;
  textLayerDiv.style.height = `${viewport.height}px`;

  page.getTextContent().then(function (textContent) {
    pdfjsLib.renderTextLayer({
      textContent: textContent,
      container: textLayerDiv,
      viewport: viewport,
      textDivs: [],
    });
  });
}

// Render the annotation layer for clickable links
function renderAnnotationLayer(page, viewport) {
  annotationLayerDiv.innerHTML = ''; // Clear existing annotation layer
  annotationLayerDiv.style.width = `${viewport.width}px`;
  annotationLayerDiv.style.height = `${viewport.height}px`;

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
        link.style.pointerEvents = 'auto';
        link.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Optional: Highlight for debugging
        annotationLayerDiv.appendChild(link);
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
