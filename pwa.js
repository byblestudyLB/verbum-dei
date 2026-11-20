"use strict";
(()=>{
  const registrationUrl="./sw.js";
  if("serviceWorker" in navigator && window.isSecureContext){
    window.addEventListener("load",()=>{
      navigator.serviceWorker.register(registrationUrl,{scope:"./"}).catch(err=>console.warn("Verbum Dei offline fallback unavailable:",err));
    });
  }
  const installed=()=>window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  const buttons=[...document.querySelectorAll("#installAppButton,#installAppHomeButton")];
  const dialog=document.getElementById("installDialog");
  function showHelp(){
    if(dialog&&!dialog.open)dialog.showModal();
  }
  buttons.forEach(button=>button.addEventListener("click",showHelp));
  document.getElementById("closeInstallDialog")?.addEventListener("click",()=>dialog?.close());
  dialog?.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
  // Leave the direct Android download link visible. Hide only redundant PWA help buttons once installed.
  if(installed())buttons.forEach(button=>button.hidden=true);
})();
