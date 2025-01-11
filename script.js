// Add event listeners for the buttons
document.getElementById('visual-btn').addEventListener('click', function() {
    showPDF('assets/portfolio2.pdf'); // Link to "Visual" portfolio
});

document.getElementById('ux-btn').addEventListener('click', function() {
    showPDF('assets/portfolio.pdf'); // Link to "UX" portfolio
});

document.getElementById('back-home-btn').addEventListener('click', function() {
    // Hide the PDF viewer and return to the welcome screen
    document.getElementById('pdf-viewer').style.display = 'none';
    document.getElementById('welcome').style.display = 'flex';
});

function showPDF(pdfUrl) {
    // Hide the welcome screen
    document.getElementById('welcome').style.display = 'none';

    // Show the PDF viewer
    const pdfViewer = document.getElementById('pdf-viewer');
    pdfViewer.style.display = 'block';

    // Set the iframe source to the chosen PDF
    document.getElementById('pdf-frame').src = pdfUrl;
}
