// Transición y navegación al portfolio
const welcomeDiv = document.getElementById('welcome');
const portfolioDiv = document.getElementById('portfolio');
const enterBtn = document.getElementById('enter-btn');

enterBtn.addEventListener('click', () => {
  welcomeDiv.style.opacity = '0';
  setTimeout(() => {
    welcomeDiv.classList.add('hidden');
    portfolioDiv.classList.remove('hidden');
  }, 1000); // Duración de la transición
});

// Visualizador de PDF
const pdfUrl = './assets/portfolio.pdf'; // Cambia esto a la ruta de tu PDF
let pdfDoc = null,
  pageNum = 1,
  pageRendering = false;

const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Cargar PDF usando PDF.js
const loadPDF = async (url) => {
  pdfDoc = await pdfjsLib.getDocument(url).promise;
  renderPage(pageNum);
};

const renderPage = async (num) => {
  pageRendering = true;
  const page = await pdfDoc.getPage(num);

  const viewport = page.getViewport({ scale: 1.5 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderCtx = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await page.render(renderCtx).promise;
  pageRendering = false;
};

// Cambiar de página
prevBtn.addEventListener('click', () => {
  if (pageNum <= 1 || pageRendering) return;
  pageNum--;
  renderPage(pageNum);
});

nextBtn.addEventListener('click', () => {
  if (pageNum >= pdfDoc.numPages || pageRendering) return;
  pageNum++;
  renderPage(pageNum);
});

// Inicializar
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
loadPDF(pdfUrl);
