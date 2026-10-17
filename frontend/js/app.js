/* Router and startup. Loaded last. */

/* ---------- router ---------- */
function render(){
  stopCam();
  var route = (location.hash.replace(/^#\//,"")||"home");
  if(route.indexOf("prices/")===0){
    var pc = decodeURIComponent(route.slice(7)); priceCat = PRICES.some(function(x){return x.cat===pc;}) ? pc : "All"; route = "prices";
  } else if(route==="prices"){ priceCat = "All"; }
  if(route.indexOf("info/")===0){ app.innerHTML = pages.info(route.slice(5)); }
  else { if(!pages[route]) route="notfound"; app.innerHTML = pages[route](); }
  renderNav(route==="login-error"?"login":route);
  if(wire[route]) wire[route]();
  document.title = "Scrap Setu – " + route.replace("-"," ");
}
window.addEventListener("hashchange", function(){ showLoader(650); render(); window.scrollTo(0,0); app.focus({preventScroll:true}); });
if(LOGO_SRC){ document.getElementById("logoSlot").innerHTML='<img alt="" src="'+LOGO_SRC+'">'; }
buildNav();
initTheme();
if(LOGO_SRC){ document.getElementById("loaderLogo").src=LOGO_SRC; }
showLoader(1600);
render();
Auth.restore().then(function(sn){ if(sn){ session=sn; render(); } }).catch(function(){});
if(REMOTE){
  API.prices().then(mergePrices).catch(function(){});
  /* Pick up rate changes made in the admin panel, and redraw only when someone is just reading the rates page. */
  setInterval(function(){
    if(document.hidden) return;
    API.prices().then(function(list){
      var before=JSON.stringify(PRICES.map(function(p){ return [p.low,p.high,p.sellLow,p.sellHigh,p.trendPct]; }));
      mergePrices(list);
      var after=JSON.stringify(PRICES.map(function(p){ return [p.low,p.high,p.sellLow,p.sellHigh,p.trendPct]; }));
      var a=document.activeElement, typing=a&&/^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName);
      if(before!==after && /^#\/prices/.test(location.hash) && !typing) render();
    }).catch(function(){});
  },60000);
}
/* ---- easter eggs ---- */

/* 1. Message in the browser console (F12 > Console) */
console.log("%cCarried by N & V","font:700 18px Georgia,serif;color:#a3b85a;background:#0e0d0a;padding:6px 14px;border-radius:4px");

/* 2. Click or tap 7 times anywhere on the site, each click within 1.5 s of the last.
      The message pops up at the spot of the 7th click. */
(function(){
  var NEEDED=7, GAP=1500, count=0, timer=null;
  document.addEventListener("click",function(e){
    count++; clearTimeout(timer); timer=setTimeout(function(){ count=0; },GAP);
    if(count<NEEDED) return;
    count=0; clearTimeout(timer);
    var old=document.getElementById("eggBadge"); if(old) old.remove();

    var x=e.clientX, y=e.clientY;
    var t=document.createElement("div");
    t.id="eggBadge"; t.textContent="Carried by N & V"; t.setAttribute("role","status");
    t.style.cssText="position:fixed;left:0;top:0;background:#0e0d0a;color:#a3b85a;border:2px solid #7a5230;padding:.5rem 1.1rem;font:700 1rem Georgia,serif;white-space:nowrap;z-index:300;opacity:0;transition:opacity .35s,transform .6s;pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);";
    document.body.appendChild(t);

    /* place it above the click point, keep it fully on screen */
    var w=t.offsetWidth, h=t.offsetHeight;
    var left=Math.max(8,Math.min(x-w/2,window.innerWidth-w-8));
    var top=y-h-16; if(top<8) top=y+16;
    t.style.left=left+"px"; t.style.top=top+"px";
    t.style.transform="translateY(6px)";

    requestAnimationFrame(function(){ t.style.opacity=1; t.style.transform="translateY(-4px)"; });
    setTimeout(function(){ t.style.opacity=0; setTimeout(function(){ t.remove(); },400); },2800);
  });
})();