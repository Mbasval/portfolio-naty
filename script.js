// Initialize PDF viewer
let currentPage = 1;
let pdfDoc = null;
const scale = 1.5; // PDF zoom scale
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');

// PDF.js setup
pdfjsLib.getDocument('assets/portfolio.pdf').promise.then(function (pdf) {
  pdfDoc = pdf;
  renderPage(currentPage);
}).catch(function (error) {
  console.error("Error loading PDF:", error);
  alert("There was an issue loading the PDF.");
});

// Render page function
function renderPage(num) {
  pdfDoc.getPage(num).then(function (page) {
    const viewport = page.getViewport({ scale: scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    page.render(renderContext);
  });
}

// Enter button functionality (transition to PDF viewer)
document.getElementById('enter-btn').addEventListener('click', function () {
  // Hide the welcome screen and show the PDF viewer
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('pdf-viewer').style.display = 'flex';
});

// Handle window resize to adjust canvas size
window.addEventListener('resize', function() {
  if (pdfDoc) {
    renderPage(currentPage); // Re-render current page to adjust to new canvas size
  }
});

// Swipe detection functions (optional)
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  if (touchEndX < touchStartX) {
    // Swipe Left - Go to next page
    if (currentPage < pdfDoc.numPages) {
      currentPage++;
      renderPage(currentPage);
    }
  }

  if (touchEndX > touchStartX) {
    // Swipe Right - Go to previous page
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  }
}

// Attach touch event listeners
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
