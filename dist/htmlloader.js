var frame='\n<div class="extension-note">\n<button id="toggleButton">Show Form</button>\n  <form id="formContainer" style="display: none;">\n    <table>\n    <tr>\n      <td>\n      <div id="loginContainer" style="display: block;">\n      <h4>Sign In</h4>\n        <input type="text" id="email" required="required" placeholder="User">\n        <input type="password" id="password" required="required" placeholder="Password">\n      <button id="loginButton">Login</button>\n      </div>\n\n    <div id="inputsContainer" style="display: none;">\n    <h4>Client\'s Administration</h4>\n    <select>\n      <option>Client 1</option>\n      <option>Client 2</option>\n      <option>Client 3</option>\n    </select>\n    <button id="loadBtn">Load data</button>\n    <button id="updateBtn">Update</button>\n    <button id="deleteBtn">Delete</button>\n\n    <select>\n      <option>Credit risk</option>\n      <option>Low risk</option>\n      <option>Average risk</option>\n      <option>High risk</option>\n    </select>\n    <button id="creditRiskBtn">Update</button>\n \n    <input id="accountNumber" value="" type="text" placeholder="Update account number">\n    <button id="accountBtn">Update</button>\n\n    <input id="dsiNumber" value="" type="text" placeholder="Update DSI Number" >\n    <button id="dsiNumberBtn">Update</button>\n\n    <hr></hr>\n    <label for="installDate">Install date / Package </label>\n    <input id="installDate" type="date" name="installDate">\n    <select>\n      <option>Nothing selected</option>\n    </select>\n    <button id="dataAndPage">Confirm data and package</button>\n    <hr></hr>\n\n    <input type="datetime-local" id="start-time">\n    <hr></hr>\n    <input type="datetime-local" id="end-time">\n    <button id="updateTimeStartEnd">Update</button>\n        <button id="logoutBtn">Logout</button>    \n    </div>\n\n    </td>\n    </tr>\n    </table>\n  </form>\n  </div>\n  <script type="module">\n  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";\n  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";\n\n  const firebaseConfig = {\n    apiKey: "AIzaSyCNeIlDSfAjAubVk5BB0eZe7fGvcKenpSk",\n    authDomain: "chrome-extension-test-372f2.firebaseapp.com",\n    projectId: "chrome-extension-test-372f2",\n    storageBucket: "chrome-extension-test-372f2.appspot.com",\n    messagingSenderId: "1096055780455",\n    appId: "1:1096055780455:web:7389605c9a0119718150c2",\n    measurementId: "G-F4TLV2CXWC"\n  };\n  const app = initializeApp(firebaseConfig);\n  const analytics = getAnalytics(app);\n<\/script>',iframeElement=document.createElement("div");iframeElement.innerHTML=frame,iframeElement.style.width="300px",iframeElement.style.height="300px",document.body.appendChild(iframeElement);var isLoggedIn=!1,toggleButton=document.getElementById("toggleButton"),formContainer=document.getElementById("formContainer"),loginButton=document.getElementById("loginButton"),loginContainer=document.querySelector("#loginContainer"),inputsContainer=document.getElementById("inputsContainer"),loadBtn=document.getElementById("loadBtn"),updateBtn=document.getElementById("updateBtn"),deleteBtn=document.getElementById("deleteBtn"),accountBtn=document.getElementById("accountBtn"),logoutBtn=document.getElementById("logoutBtn"),creditRiskBtn=document.getElementById("creditRiskBtn"),dataAndPage=document.getElementById("dataAndPage"),updateTimeStartEnd=document.getElementById("updateTimeStartEnd"),email=document.getElementById("email"),password=document.getElementById("password");toggleButton.addEventListener("click",(function(){"none"===formContainer.style.display?(formContainer.style.display="block",toggleButton.textContent="Hide Form"):(formContainer.style.display="none",toggleButton.textContent="Show Form")})),loginButton.addEventListener("click",(async function(t){t.preventDefault();var n=email.value,e=password.value;console.log("Usuario:",n),console.log("Contraseña:",e);try{const t=(await window.signIn(email,password)).user;console.log("Inicio de sesión exitoso:",t),loginContainer.style.display="none",inputsContainer.style.display="block"}catch(t){const n=t.code,e=t.message;console.error("Error de inicio de sesión: ",n,e)}})),loadBtn.addEventListener("click",(function(t){t.preventDefault(),console.log("Usuarios cargados")})),updateBtn.addEventListener("click",(function(t){t.preventDefault(),console.log("Usuarios actualizados")})),deleteBtn.addEventListener("click",(function(t){t.preventDefault(),console.log("Usuarios eliminados")})),dataAndPage.addEventListener("click",(function(t){t.preventDefault(),console.log("Paquete confirmado")})),accountBtn.addEventListener("click",(function(t){t.preventDefault(),console.log("Usuario actualizado")})),creditRiskBtn.addEventListener("click",(function(t){t.preventDefault(),console.log("Situacion de riesgo actualizada")})),updateTimeStartEnd.addEventListener("click",(function(t){t.preventDefault(),console.log("Fecha de inicio y finalizacion actualizada")})),logoutBtn.addEventListener("click",(function(t){t.preventDefault(),"block"===inputsContainer.style.display&&(inputsContainer.style.display="none",loginContainer.style.display="block")}));