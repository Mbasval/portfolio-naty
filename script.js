// Initialize PDF viewer
let currentPage = 1;
let pdfDoc = null;
const scale = 1.5; // PDF zoom scale
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

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

    // Ensure the canvas size fits within the viewport
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvasWidth * (viewport.height / viewport.width);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    page.render(renderContext);

    // Update button visibility
    updateNavButtonsVisibility();
  });
}

// Update navigation buttons visibility based on page number
function updateNavButtonsVisibility() {
  if (currentPage <= 1) {
    prevBtn.style.opacity = 0.5;
    prevBtn.disabled = true;
  } else {
    prevBtn.style.opacity = 1;
    prevBtn.disabled = false;
  }

  if (currentPage >= pdfDoc.numPages) {
    nextBtn.style.opacity = 0.5;
    nextBtn.disabled = true;
  } else {
    nextBtn.style.opacity = 1;
    nextBtn.disabled = false;
  }
}

// Enter button functionality (transition to PDF viewer)
document.getElementById('enter-btn').addEventListener('click', function () {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('pdf-viewer').style.display = 'flex';
});

// Handle window resize to adjust canvas size
window.addEventListener('resize', function() {
  if (pdfDoc) {
    renderPage(currentPage); // Re-render current page to adjust to new canvas size
  }
});

// Navigation buttons functionality (for desktop and mobile)
prevBtn.addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener('click', function () {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Keyboard navigation for desktop (left and right arrows)
document.addEventListener('keydown', function(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    if (event.key === "ArrowLeft" && currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    } else if (event.key === "ArrowRight" && currentPage < pdfDoc.numPages) {
      currentPage++;
      renderPage(currentPage);
    }
  }
});

// Swipe detection functions (for mobile)
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

// Attach touch event listeners for mobile swiping
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
