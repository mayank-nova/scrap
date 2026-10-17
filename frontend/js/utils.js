/* Shared helpers: element lookup, escaping, navigation, loading screen, camera cleanup. */

/* ---------- helpers ---------- */
var app = document.getElementById("app");
function $(s,r){return (r||document).querySelector(s);}
var loaderTimer=null;
function showLoader(ms){ var l=document.getElementById("loader"); if(!l) return; l.classList.add("show"); clearTimeout(loaderTimer); loaderTimer=setTimeout(function(){ l.classList.remove("show"); }, ms); }
function go(r){location.hash = "#/"+r;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
var stream = null;
var priceCat = "All";
function stopCam(){ if(stream){ stream.getTracks().forEach(function(t){t.stop();}); stream=null; } try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){} }

/* Page templates (pages) and their event wiring (wire), filled in by the components. */
var pages = {};
var wire = {};
