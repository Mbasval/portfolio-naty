// Path to the PDF file
const pdfUrl = './assets/portfolio.pdf';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

let pdfDoc = null; // Loaded PDF document
let pageNum = 1; // Current page number
let canvas = document.getElementById('pdf-canvas'); // The canvas where the PDF will be rendered
let ctx = canvas.getContext('2d'); // Canvas context

// Load the PDF
const loadPDF = async (url) => {
  try {
    pdfDoc = await pdfjsLib.getDocument(url).promise; // Load the PDF document
    renderPage(pageNum); // Render the first page
  } catch (error) {
    console.error('Error loading PDF:', error);
    alert('Failed to load the PDF. Check the file path and ensure the file exists.');
  }
};

// Render a specific page
const renderPage = async (num) => {
  try {
    const page = await pdfDoc.getPage(num); // Get the page
    const viewport = page.getViewport({ scale: 1.5 }); // Set scale for rendering
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise; // Render the page
  } catch (error) {
    console.error('Error rendering page:', error);
    alert('Failed to render the page.');
  }
};

// Handle navigation to the next page
document.getElementById('next-btn').addEventListener('click', () => {
  if (pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum);
  }
});

// Handle navigation to the previous page
document.getElementById('prev-btn').addEventListener('click', () => {
  if (pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
  }
});

// Load the PDF when the page is ready
loadPDF(pdfUrl);
