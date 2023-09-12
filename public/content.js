/*
(async () =>{
      const script = document.createElement('script');
      script.setAttribute("src", chrome.runtime.getURL("./src/index.js"));
      script.setAttribute("type", "module");
      document.body.appendChild(script);
  
      chrome.runtime.onMessage.addListener(function (message,sender, sendResponse) {
        if (message.action === 'update_note') {
          // Actualizar contenido
          script.textContent = message.note;
        }
      });


  const appContainer = document.createElement('div');
  appContainer.id = 'my-extension-root';
  document.body.appendChild(appContainer); 
})();
*/