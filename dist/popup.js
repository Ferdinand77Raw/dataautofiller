const toggleButton=document.getElementById("toggleButton"),appDiv=document.getElementById("app");let isMinimized=!1;toggleButton.addEventListener("click",(()=>{appDiv.style.display=isMinimized?"block":"none",isMinimized=!isMinimized}));