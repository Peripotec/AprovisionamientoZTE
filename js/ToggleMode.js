// Aplica el modo oscuro tan pronto como se cargue el documento
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark-mode');
    document.addEventListener('DOMContentLoaded', function() {
      const toggle = document.getElementById('toggleMode');
      if (toggle) toggle.checked = true;
    });
  }
  
  function toggleDarkMode() {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark-mode');
    const isDarkModeEnabled = htmlElement.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkModeEnabled);
  }
  