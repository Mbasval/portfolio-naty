document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  let pdfDoc = null;
  const scale = 1.5; // PDF zoom scale
  const canvas = document.getElementById('pdf-canvas');
  const ctx = canvas.getContext('2d');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const linkLayer = document.getElementById('link-layer'); // Invisible layer for links

  if (!linkLayer) {
    console.error('linkLayer element is not found in the DOM.');
    return;
  }

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

      // Adjust link-layer to match canvas size
      linkLayer.style.width = `${canvas.width}px`;
      linkLayer.style.height = `${canvas.height}px`;
      linkLayer.style.top = `${canvas.offsetTop}px`;
      linkLayer.style.left = `${canvas.offsetLeft}px`;

      // Render the page into the canvas
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
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
          const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(rect);

          // Create a clickable link
          const link = document.createElement('a');
          link.href = annotation.url;
          link.target = '_blank';
          link.style.position = 'absolute';
          link.style.left = `${Math.min(x1, x2)}px`;
          link.style.top = `${Math.min(y1, y2)}px`;
          link.style.width = `${Math.abs(x2 - x1)}px`;
          link.style.height = `${Math.abs(y2 - y1)}px`;
          link.style.zIndex = 10;
          link.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Optional: Debug highlight
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
});
