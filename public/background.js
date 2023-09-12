
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'loginSuccess') {
    // Obtener la pestaña activa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      // Ejecutar un script en la página activa para llenar el formulario
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: () => {
          /*
          const usernameInput = document.querySelector('#username');
          const passwordInput = document.querySelector('#password');
          if (usernameInput && passwordInput) {
            usernameInput.value = 'Jimmy'; 
            passwordInput.value = 'Carter'; 
          }
          */
         
        }
      });
    });
  }
});
