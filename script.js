// Enter button functionality (transition to PDF viewer)
document.getElementById('enter-btn').addEventListener('click', function () {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('pdf-viewer').style.display = 'flex';
});
