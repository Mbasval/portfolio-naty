document.getElementById('enter-btn').addEventListener('click', function() {
  // Hide the welcome screen
  document.getElementById('welcome').style.display = 'none';

  // Show the PDF viewer
  document.getElementById('pdf-viewer').style.display = 'block';
});
