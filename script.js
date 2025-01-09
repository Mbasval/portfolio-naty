// Initialize PDF viewer
let currentPage = 1;
let pdfDoc = null;
const scale = 1.5; // PDF zoom scale
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Swipe variables
let touchStartX = 0;
let touchEndX = 0;

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
    
    // Update button visibility after rendering the page
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
  document.getElementById('welcome').style.display = 'none'; // Hide the welcome screen
  document.getElementById('pdf-viewer').style.display = 'flex'; // Show the PDF viewer
  
  // Load the PDF
  pdfjsLib.getDocument('assets/portfolio.pdf').promise.then(function (pdf) {
    pdfDoc = pdf;
    renderPage(currentPage);
  }).catch(function (error) {
    console.error("Error loading PDF:", error);
    alert("There was an issue loading the PDF.");
  });
});

// Handle window resize to adjust canvas size
window.addEventListener('resize', function() {
  if (pdfDoc) {
    renderPage(currentPage); // Re-render current page to adjust to new canvas size
  }
});

// Swipe detection functions for mobile devices
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

// Attach touch event listeners to canvas for swipe functionality
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
