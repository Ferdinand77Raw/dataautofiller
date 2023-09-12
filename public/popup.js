// popup.js
const toggleButton = document.getElementById('toggleButton');
const appDiv = document.getElementById('app');
let isMinimized = false;

toggleButton.addEventListener('click', () => {
  if (isMinimized) {
    appDiv.style.display = 'block';
  } else {
    appDiv.style.display = 'none';
  }
  isMinimized = !isMinimized;
});
