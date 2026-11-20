"use strict";
(()=>{
  const registrationUrl="./sw.js";
  if("serviceWorker" in navigator && window.isSecureContext){
    window.addEventListener("load",()=>{
      navigator.serviceWorker.register(registrationUrl,{scope:"./"}).catch(err=>console.warn("Verbum Dei offline fallback unavailable:",err));
    });
  }
  let pendingInstall=null;
  const installed=()=>window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
  const buttons=[...document.querySelectorAll("#installAppButton,#installAppHomeButton")];
  const dialog=document.getElementById("installDialog");
  function hideInstalled(){
    if(installed())buttons.forEach(button=>button.hidden=true);
  }
  function showHelp(){
    if(dialog&&!dialog.open)dialog.showModal();
  }
  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    pendingInstall=event;
  });
  window.addEventListener("appinstalled",()=>{
    pendingInstall=null;
    buttons.forEach(button=>button.hidden=true);
    if(dialog?.open)dialog.close();
  });
  buttons.forEach(button=>button.addEventListener("click",async()=>{
    if(installed())return;
    if(!pendingInstall){showHelp();return}
    const prompt=pendingInstall;pendingInstall=null;
    try{await prompt.prompt();await prompt.userChoice}
    catch(err){console.warn("App install prompt unavailable:",err);showHelp()}
  }));
  document.getElementById("closeInstallDialog")?.addEventListener("click",()=>dialog?.close());
  dialog?.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
  hideInstalled();
})();