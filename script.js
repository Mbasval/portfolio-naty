document.getElementById('enter-btn').addEventListener('click', () => {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('pdf-viewer').style.display = 'flex';
  loadPDF(); // Load PDF when the user enters
});

let currentPage = 1;
let pdfDoc = null;

const scale = 1.5; // Adjust this value if needed

// Initialize PDF.js and load the document
function loadPDF() {
  const url = 'assets/your-pdf.pdf'; // Replace with your PDF path
  pdfjsLib.getDocument(url).promise.then((pdf) => {
    pdfDoc = pdf;
    renderPage(currentPage);
  });
}

// Render a specific page of the PDF
function renderPage(num) {
  pdfDoc.getPage(num).then((page) => {
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({
      canvasContext: context,
      viewport: viewport,
    });
  });
}

// Next button functionality
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Previous button functionality
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

// Orientation warning for mobile devices
window.addEventListener('resize', () => {
  if (window.innerHeight > window.innerWidth) {
    document.getElementById('orientation-warning').style.display = 'flex';
  } else {
    document.getElementById('orientation-warning').style.display = 'none';
  }
});
