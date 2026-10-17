/* Scan scrap page: camera, upload, scrap type tiles, illustrated reuse ideas with tutorial links, Hindi and read aloud. */

/* ---------- Reuse illustrations, tutorial links and styles (used by the results panel) ---------- */
function sArt(inner){ return '<svg viewBox="0 0 160 100" role="img" aria-hidden="true" focusable="false">'+inner+'</svg>'; }
var SCAN_ART = {
  paper:[
    '<g transform="rotate(-6 80 55)"><rect x="38" y="24" width="84" height="58" rx="3" fill="#f3ead2" stroke="#c9b98f"/><g fill="#5cc46a"><circle cx="58" cy="44" r="2.6"/><circle cx="84" cy="38" r="2.6"/><circle cx="104" cy="52" r="2.6"/><circle cx="70" cy="64" r="2.6"/><circle cx="94" cy="68" r="2.6"/></g><g fill="#c9b98f"><circle cx="48" cy="60" r="1.6"/><circle cx="112" cy="36" r="1.6"/><circle cx="82" cy="52" r="1.6"/></g></g><path d="M130 88V72" stroke="#2f8f4e" stroke-width="3"/><path d="M130 76c-10-2-12-9-10-13 8 0 12 5 10 13zM130 74c8-1 13-7 12-12-8 0-13 5-12 12z" fill="#5cc46a"/>',
    '<path d="M36 46h88l-6 36H42z" fill="#b98b4f"/><path d="M36 46h88v8H36z" fill="#d9b574"/><path d="M62 54v28M98 54v28" stroke="#8a6232" stroke-width="3"/><g stroke-width="5" stroke-linecap="round"><path d="M50 50L46 24" stroke="#e0833a"/><path d="M80 50l2-30" stroke="#4aa3d8"/><path d="M112 50l6-26" stroke="#5cc46a"/></g><rect x="68" y="62" width="24" height="10" rx="2" fill="#e9e1c8"/>',
    '<path d="M46 36h68l6 50H40z" fill="#e9e3cf"/><path d="M62 36c0-16 36-16 36 0" fill="none" stroke="#8a7a52" stroke-width="3"/><g stroke="#9a9078" stroke-width="2"><path d="M52 48h56M50 56h58M49 74h40"/></g><path d="M41 62h78l1 8H40z" fill="#c0504d" opacity=".85"/>',
    '<path d="M42 44h76l-6 42H48z" fill="#6b4a2f"/><rect x="38" y="38" width="84" height="8" rx="3" fill="#8a6232"/><path d="M52 62h56M54 74h52" stroke="#4a3220" stroke-width="3" stroke-linecap="round"/><path d="M80 38V22" stroke="#2f8f4e" stroke-width="3"/><path d="M80 28c-12 0-18-7-17-13 10 0 17 5 17 13zM80 26c10 0 17-6 16-12-10 0-16 5-16 12z" fill="#5cc46a"/><g fill="#e9e3cf"><rect x="60" y="56" width="10" height="6" transform="rotate(-12 65 59)"/><rect x="92" y="68" width="10" height="6" transform="rotate(14 97 71)"/></g>'
  ],
  plastic:[
    '<path d="M52 40L80 10l28 30" fill="none" stroke="#93a893" stroke-width="2"/><circle cx="80" cy="8" r="3" fill="none" stroke="#93a893" stroke-width="2"/><rect x="40" y="40" width="80" height="34" rx="12" fill="#4aa3d8" opacity=".9"/><rect x="40" y="40" width="80" height="8" rx="4" fill="#2f7fb0"/><rect x="28" y="50" width="14" height="14" rx="3" fill="#e9f3e9"/><path d="M60 40c-4-14 4-22 8-24 4 6 2 16-8 24zM86 40c-2-14 8-20 14-20 0 8-4 16-14 20zM74 40c0-10-2-18 2-24 6 6 4 16-2 24z" fill="#5cc46a"/><path d="M50 58h60" stroke="#fff" opacity=".35" stroke-width="3"/>',
    '<path d="M80 4v12" stroke="#93a893" stroke-width="2"/><rect x="72" y="14" width="16" height="8" rx="2" fill="#e9f3e9"/><rect x="62" y="22" width="36" height="60" rx="10" fill="#4aa3d8" opacity=".9"/><ellipse cx="80" cy="56" rx="9" ry="8" fill="#0b2a16"/><g fill="#e0a05a"><circle cx="72" cy="74" r="2"/><circle cx="82" cy="76" r="2"/><circle cx="90" cy="73" r="2"/></g><path d="M96 60h44" stroke="#8a6232" stroke-width="3"/><ellipse cx="122" cy="51" rx="11" ry="8" fill="#e0833a"/><circle cx="132" cy="46" r="5" fill="#e0833a"/><path d="M137 45l7 2-7 2z" fill="#f0c040"/>',
    '<rect y="72" width="160" height="28" fill="#6b4a2f"/><rect x="62" y="12" width="36" height="52" rx="10" fill="#4aa3d8" opacity=".9"/><rect x="62" y="30" width="36" height="34" rx="6" fill="#bfe4f7" opacity=".7"/><rect x="74" y="62" width="12" height="16" fill="#2f7fb0"/><g fill="#7fc8f0"><circle cx="80" cy="84" r="2.5"/><circle cx="76" cy="90" r="2"/><circle cx="84" cy="92" r="2"/></g><path d="M122 72V46" stroke="#2f8f4e" stroke-width="3"/><path d="M122 54c-12 0-16-8-14-14 10 0 15 6 14 14zM122 50c10 0 16-7 14-13-10 0-15 6-14 13z" fill="#5cc46a"/>',
    '<path d="M52 44h56l-6 40H58z" fill="#4aa3d8" opacity=".95"/><path d="M52 44h56" stroke="#2f7fb0" stroke-width="3"/><path d="M56 60h48" stroke="#fff" opacity=".35" stroke-width="3"/><g stroke-width="5" stroke-linecap="round"><path d="M66 44L60 16" stroke="#e0833a"/><path d="M80 44V12" stroke="#5cc46a"/><path d="M94 44l7-28" stroke="#c0504d"/></g><circle cx="130" cy="74" r="10" fill="#f0c040"/><text x="130" y="78" font-size="12" font-weight="700" text-anchor="middle" fill="#7a5a00">₹</text>'
  ],
  metal:[
    '<rect x="54" y="40" width="52" height="46" rx="5" fill="#cfd5cf"/><rect x="54" y="52" width="52" height="22" fill="#e0833a"/><path d="M54 62q13-8 26 0t26 0" fill="none" stroke="#fff" stroke-width="3"/><ellipse cx="80" cy="40" rx="26" ry="5" fill="#eef2ee"/><g stroke-width="5" stroke-linecap="round"><path d="M68 38L62 12" stroke="#4aa3d8"/><path d="M82 36V8" stroke="#c0504d"/><path d="M94 38l8-24" stroke="#5cc46a"/></g>',
    '<circle cx="80" cy="56" r="42" fill="#f0c040" opacity=".2"/><rect x="58" y="30" width="44" height="56" rx="6" fill="#8c95a0"/><g fill="#ffd86b"><circle cx="70" cy="42" r="3"/><circle cx="80" cy="42" r="3"/><circle cx="90" cy="42" r="3"/><circle cx="65" cy="54" r="3"/><circle cx="75" cy="54" r="3"/><circle cx="85" cy="54" r="3"/><circle cx="95" cy="54" r="3"/><circle cx="70" cy="66" r="3"/><circle cx="80" cy="66" r="3"/><circle cx="90" cy="66" r="3"/><circle cx="75" cy="77" r="3"/><circle cx="85" cy="77" r="3"/></g><path d="M62 30q18-22 36 0" fill="none" stroke="#93a893" stroke-width="3"/>',
    '<rect x="22" y="48" width="40" height="38" rx="4" fill="#cfd5cf"/><rect x="66" y="40" width="34" height="46" rx="4" fill="#d4a63a"/><rect x="104" y="52" width="36" height="34" rx="4" fill="#c9733a"/><path d="M30 48V34M40 48V30M50 48V36" stroke="#8c95a0" stroke-width="3" stroke-linecap="round"/><g fill="#8a5a2a"><circle cx="76" cy="40" r="3"/><circle cx="84" cy="37" r="3"/><circle cx="92" cy="40" r="3"/></g><rect x="22" y="62" width="40" height="10" fill="#fff" opacity=".5"/><rect x="104" y="64" width="36" height="9" fill="#fff" opacity=".45"/>',
    '<rect x="38" y="52" width="26" height="34" rx="5" fill="#cfd5cf"/><rect x="66" y="52" width="26" height="34" rx="5" fill="#e6ebe6"/><rect x="52" y="20" width="26" height="34" rx="5" fill="#eef2ee"/><rect x="38" y="62" width="26" height="10" fill="#4aa3d8"/><rect x="66" y="62" width="26" height="10" fill="#c0504d"/><rect x="52" y="30" width="26" height="10" fill="#5cc46a"/><circle cx="122" cy="60" r="20" fill="#f0c040"/><circle cx="122" cy="60" r="15" fill="none" stroke="#c99a1a" stroke-width="2"/><text x="122" y="68" font-size="22" font-weight="800" text-anchor="middle" fill="#7a5a00">₹</text>'
  ],
  glass:[
    '<rect x="54" y="20" width="52" height="10" rx="3" fill="#c9733a"/><path d="M58 30h44v8q8 6 8 16v26a6 6 0 0 1-6 6H56a6 6 0 0 1-6-6V54q0-10 8-16z" fill="#bfe4f7" opacity=".6" stroke="#8ec7e4" stroke-width="2"/><path d="M52 62h56v18a4 4 0 0 1-4 4H56a4 4 0 0 1-4-4z" fill="#e0a05a"/><g fill="#c9833a"><circle cx="62" cy="68" r="2"/><circle cx="74" cy="72" r="2"/><circle cx="88" cy="67" r="2"/><circle cx="98" cy="73" r="2"/></g><path d="M62 42v16" stroke="#fff" opacity=".6" stroke-width="3"/>',
    '<circle cx="80" cy="58" r="42" fill="#ffd86b" opacity=".2"/><path d="M58 26h44v8q8 6 8 16v28a6 6 0 0 1-6 6H56a6 6 0 0 1-6-6V50q0-10 8-16z" fill="#bfe4f7" opacity=".55" stroke="#8ec7e4" stroke-width="2"/><rect x="54" y="18" width="52" height="9" rx="3" fill="#8c95a0"/><path d="M62 38q10 14 18 0t18 14-18 10-18 12" fill="none" stroke="#6b5a2a" stroke-width="1.5"/><g fill="#ffd86b"><circle cx="64" cy="42" r="3.5"/><circle cx="80" cy="40" r="3.5"/><circle cx="96" cy="48" r="3.5"/><circle cx="80" cy="58" r="3.5"/><circle cx="66" cy="66" r="3.5"/><circle cx="90" cy="72" r="3.5"/></g>',
    '<path d="M74 40h12v10q10 8 10 22v10a4 4 0 0 1-4 4H68a4 4 0 0 1-4-4V72q0-14 10-22z" fill="#2f8f4e"/><rect x="75" y="30" width="10" height="12" fill="#2f8f4e"/><path d="M80 34V16" stroke="#1d6b36" stroke-width="3"/><circle cx="80" cy="12" r="8" fill="#e0505a"/><circle cx="80" cy="12" r="2.8" fill="#f0c040"/><path d="M80 28c-10-2-14-8-13-12 9 0 14 4 13 12z" fill="#5cc46a"/><path d="M70 66v14" stroke="#fff" opacity=".4" stroke-width="3"/>',
    '<path d="M56 24h48l-6 60a4 4 0 0 1-4 4H66a4 4 0 0 1-4-4z" fill="#bfe4f7" opacity=".6" stroke="#8ec7e4" stroke-width="2"/><path d="M59 46h42l-3 38H62z" fill="#f0a05a" opacity=".9"/><path d="M92 46L112 12" stroke="#c0504d" stroke-width="4" stroke-linecap="round"/><circle cx="72" cy="58" r="3" fill="#fff" opacity=".6"/><circle cx="86" cy="68" r="2.5" fill="#fff" opacity=".6"/><path d="M64 30v12" stroke="#fff" opacity=".6" stroke-width="3"/>'
  ],
  ewaste:[
    '<circle cx="80" cy="50" r="30" fill="#12301a" stroke="#5cc46a" stroke-width="3"/><g fill="none" stroke="#5cc46a" stroke-width="5" stroke-linecap="round"><path d="M62 46a20 20 0 0 1 28-10"/><path d="M98 46a20 20 0 0 1-8 26"/><path d="M78 76a20 20 0 0 1-24-14"/></g><g fill="#5cc46a"><path d="M94 28l2 14-14-3z"/><path d="M90 78H76l9-10z"/><path d="M50 52l12 6-2-14z"/></g><rect x="112" y="60" width="16" height="28" rx="3" fill="#2a2f2a" stroke="#93a893" stroke-width="2"/><rect x="115" y="65" width="10" height="14" fill="#12301a"/>',
    '<rect x="26" y="30" width="62" height="46" rx="4" fill="#12301a" stroke="#5cc46a" stroke-width="2"/><path d="M34 44h22v10h16M34 62h14M56 36v10M72 70V58" stroke="#5cc46a" stroke-width="2" fill="none"/><g fill="#f0c040"><circle cx="34" cy="44" r="3"/><circle cx="72" cy="54" r="3"/><circle cx="48" cy="62" r="3"/></g><rect x="48" y="34" width="14" height="10" fill="#2a2f2a"/><rect x="104" y="40" width="34" height="40" rx="5" fill="#2f8f4e"/><rect x="116" y="34" width="10" height="7" fill="#2f8f4e"/><path d="M124 50l-8 12h8l-4 12" fill="none" stroke="#e9f3e9" stroke-width="3" stroke-linejoin="round"/>',
    '<rect x="30" y="38" width="30" height="26" rx="5" fill="#e9f3e9"/><rect x="22" y="44" width="10" height="4" fill="#93a893"/><rect x="22" y="54" width="10" height="4" fill="#93a893"/><path d="M60 51h18c20 0 20 30 0 30s-20-22 0-22h30" fill="none" stroke="#e9f3e9" stroke-width="4" stroke-linecap="round"/><rect x="108" y="53" width="26" height="12" rx="3" fill="#93a893"/><path d="M134 56h8v6h-8z" fill="#e0a05a"/>',
    '<rect x="46" y="38" width="62" height="34" rx="5" fill="#2a2f2a" stroke="#93a893" stroke-width="2"/><rect x="108" y="48" width="8" height="14" rx="2" fill="#93a893"/><rect x="52" y="44" width="22" height="22" fill="#2f8f4e"/><circle cx="80" cy="55" r="34" fill="none" stroke="#ff5252" stroke-width="5"/><path d="M56 31l48 48" stroke="#ff5252" stroke-width="5"/>'
  ]
};
/* Search phrases for each idea, in the same order as the ideas in MATERIALS. */
var SCAN_Q = {
  paper:["handmade seed paper from old newspaper","cardboard drawer organizer diy","newspaper paper bag gift wrap diy","composting shredded paper at home"],
  plastic:["plastic bottle hanging planter diy","plastic bottle bird feeder diy","plastic bottle drip irrigation diy","plastic bottle pen stand coin bank diy"],
  metal:["tin can pen holder planter diy","tin can lantern diy","tin can storage organizer diy","aluminium can recycling"],
  glass:["glass jar kitchen storage ideas","glass jar fairy light lamp diy","glass bottle vase diy","cut glass bottle into drinking glass diy"],
  ewaste:["certified e-waste recycler india","salvage parts from old phone and electronics","reuse old charger cable organizer diy","safe disposal of old lithium batteries india"]
};
var SCAN_X = {
  en:{photo:"Your photo",watch:"Watch tutorial",pics:"More photos",explore:"Explore more reuse ideas",book:"Book a pickup",idea:"Idea",all:"All"},
  hi:{photo:"आपकी फ़ोटो",watch:"ट्यूटोरियल देखें",pics:"और तस्वीरें",explore:"और विचार देखें",book:"पिकअप बुक करें",idea:"विचार",all:"सभी"}
};
function ytUrl(q,hi){ return "https://www.youtube.com/results?search_query="+encodeURIComponent(q+(hi?" in hindi":"")); }
function imgUrl(q){ return "https://www.google.com/search?tbm=isch&q="+encodeURIComponent(q); }
function pinUrl(q){ return "https://www.pinterest.com/search/pins/?q="+encodeURIComponent(q); }

function ensureScanStyle(){
  if(document.getElementById("scanStyle")) return;
  var s=document.createElement("style"); s.id="scanStyle";
  s.textContent=
  ".rphoto{display:flex;align-items:center;gap:.7rem;margin:.9rem 0 0;padding:.5rem;border:1px solid var(--line);border-radius:12px;background:var(--surface-2);}"+
  ".rphoto img{width:64px;height:64px;object-fit:cover;border-radius:8px;flex:none;}.rphoto span{color:var(--muted);font-size:.9rem;}"+
  ".rgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem;margin:1rem 0;}"+
  ".ridea{display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s;}"+
  ".ridea:hover{transform:translateY(-3px);border-color:var(--leaf);box-shadow:0 14px 28px -18px var(--leaf);}"+
  ".rart{position:relative;aspect-ratio:8/5;background:linear-gradient(135deg,var(--leaf-soft),var(--surface-2));display:grid;place-items:center;}"+
  ".rart svg{width:100%;height:100%;}.ridea:hover .rart svg{animation:rfloat 1.6s ease-in-out infinite;}"+
  "@keyframes rfloat{50%{transform:translateY(-3px) scale(1.03);}}"+
  ".rnum{position:absolute;top:.5rem;left:.5rem;min-width:26px;height:26px;padding:0 .45rem;display:grid;place-items:center;border-radius:999px;background:var(--leaf);color:var(--on-leaf);font:700 .8rem var(--display);}"+
  ".ridea p{margin:0;padding:.7rem .8rem .4rem;font-size:.92rem;line-height:1.45;flex:1;max-width:none;}"+
  ".rlinks{display:flex;flex-wrap:wrap;gap:.4rem;padding:.2rem .8rem .8rem;}"+
  ".rlink{display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .7rem;border:1.5px solid var(--line);border-radius:999px;color:var(--leaf);font-size:.84rem;font-weight:600;text-decoration:none;background:var(--surface-2);}"+
  ".rlink:hover{border-color:var(--leaf);background:var(--leaf-soft);}"+
  ".rmore{margin:1.2rem 0 .4rem;padding:1rem;border:1px dashed var(--leaf-deep);border-radius:14px;background:var(--leaf-soft);}"+
  ".rmore h3{margin:0 0 .6rem;font-size:1.05rem;}.rmore .rlinks{padding:0;}"+
  "@media (max-width:480px){.rgrid{grid-template-columns:1fr;}}"+
  "@media (prefers-reduced-motion:reduce){.ridea:hover .rart svg{animation:none;}.ridea,.ridea:hover{transition:none;transform:none;}}";
  document.head.appendChild(s);
}
var PLAY='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>';
var PICS='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';


pages.scan = function(){
  if(currentRole()==="collector") return notForRole("The scanner is for customers","It helps households see what their scrap is and how to reuse it. As a collector, use the buy and sell rates to quote customers.");
  var tiles=Object.keys(MATERIALS).map(function(k){return '<button class="tile" data-m="'+k+'" aria-pressed="false">'+ICONS[MAT_META[k].icon]+'<span>'+MATERIALS[k].label+'</span></button>';}).join("");
  var camIco='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  var upIco='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>';
  return '<div class="wrap"><section class="page">'+
    '<p class="kicker">Scrap scanner</p><h2>Show us your scrap</h2>'+
    '<p class="lead">Take a photo, upload one, or just tap the type of scrap you have. You get reuse ideas and an idea of what it could earn.</p>'+
    '<div class="scanhub">'+
      '<div class="card">'+
        '<h3 style="margin-top:0">1. Add a photo</h3>'+
        '<div class="modebar"><button class="mode" id="camBtn" aria-pressed="false">'+camIco+'<span id="camLbl">Use camera</span></button><button class="mode" id="upBtn">'+upIco+'<span>Upload photo</span></button><button class="mode" id="nativeBtn" type="button">'+camIco+'<span>Phone camera</span></button></div>'+
        '<input id="fileIn" type="file" accept="image/*" hidden><input id="nativeIn" type="file" accept="image/*" capture="environment" hidden>'+
        '<div class="viewport" id="vp" aria-label="Photo area. You can drop a photo here."></div>'+
        '<div class="row" style="margin-top:.8rem"><button class="btn" id="snapBtn" disabled>Capture photo</button><button class="btn ghost" id="resetBtn" hidden>Clear and start over</button></div>'+
        '<p class="hint" id="camMsg" role="status" style="margin-top:.6rem"></p>'+
        '<h3 style="margin-top:1.4rem">2. Or tap your scrap type</h3>'+
        '<div class="tiles" role="group" aria-label="Scrap type">'+tiles+'</div>'+
      '</div>'+
      '<div class="card result" id="result" aria-live="polite" tabindex="-1"></div>'+
    '</div>'+
  '</section></div>';
};

wire.scan = function(){
  if(!$("#vp")) return;
  ensureScanStyle();
  var vp=$("#vp"), msg=$("#camMsg"), snap=$("#snapBtn"), cam=$("#camBtn"), result=$("#result"), reset=$("#resetBtn"), video=null;
  var lang="en", current=null, kg=5, speaking=false, scanTimer=null, curSource="manual", curLabels=[], curImg=null, curPriceId=null;
  var IDLE='<div class="vpidle"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><p style="margin:0">Add a photo of your scrap.<br>You can also drag and drop one here.</p></div>';
  function say(t){ msg.textContent=t; }
  function setTiles(k){ document.querySelectorAll(".tile").forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.m===k); }); }
  function stopSpeak(){ try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){} speaking=false; }
  function idleResult(){ result.innerHTML='<h3 style="margin-top:0">Your results appear here</h3><p class="hint">Add a photo or tap a scrap type to see reuse ideas and what it could earn.</p>'; }
  function reallyReset(){ stopCam(); stopSpeak(); clearTimeout(scanTimer); vp.classList.remove("scanning"); vp.innerHTML=IDLE; snap.disabled=true; cam.setAttribute("aria-pressed","false"); $("#camLbl").textContent="Use camera"; reset.hidden=true; current=null; curImg=null; curPriceId=null; setTiles(null); idleResult(); say(""); }

  function showResult(key, focusIt, source, labels){
    if(source!==undefined){ curSource=source; curLabels=labels||[]; }
    current=key; setTiles(key);
    var m=MATERIALS[key], meta=MAT_META[key], t=T[lang], x=SCAN_X[lang], hi=lang==="hi", pr=PRICES[(curSource==="rekognition"&&curPriceId&&PRICE_IDS.indexOf(curPriceId)>=0)?PRICE_IDS.indexOf(curPriceId):m.priceIdx[0]];
    var label=hi?HI[key].label:m.label, ideas=hi?HI[key].ideas:m.ideas;
    var tagText = curSource==="rekognition" ? t.tagAws : curSource==="manual" ? t.tagManual : t.tagColour;
    var noteHtml = curSource==="manual" ? "" : '<p class="hint" style="margin-top:1rem">'+(curSource==="rekognition" ? t.noteAws+(curLabels.length?" ("+esc(curLabels.slice(0,5).join(", "))+")":"") : t.note)+'</p>';
    var photoHtml = curImg ? '<div class="rphoto"><img alt="" src="'+curImg+'"><span>'+x.photo+'</span></div>' : "";
    var cards = ideas.map(function(txt,i){
      var q=SCAN_Q[key][i], art=SCAN_ART[key][i];
      return '<article class="ridea"><div class="rart">'+sArt(art)+'<span class="rnum">'+(i+1)+'</span></div><p>'+txt+'</p>'+
        '<div class="rlinks"><a class="rlink" href="'+ytUrl(q,hi)+'" target="_blank" rel="noopener noreferrer">'+PLAY+x.watch+'</a>'+
        '<a class="rlink" href="'+imgUrl(q)+'" target="_blank" rel="noopener noreferrer">'+PICS+x.pics+'</a></div></article>';
    }).join("");
    var more='<div class="rmore"><h3>'+x.explore+'</h3><div class="rlinks">'+
      '<a class="rlink" href="'+ytUrl(m.label+" reuse ideas diy",hi)+'" target="_blank" rel="noopener noreferrer">'+PLAY+'YouTube</a>'+
      '<a class="rlink" href="'+pinUrl(m.label+" reuse ideas")+'" target="_blank" rel="noopener noreferrer">'+PICS+'Pinterest</a>'+
      '<a class="rlink" href="'+imgUrl(m.label+" reuse ideas")+'" target="_blank" rel="noopener noreferrer">'+PICS+'Google Images</a>'+
      '<a class="rlink" href="#/pickup">'+x.book+' →</a></div></div>';
    result.innerHTML=
      '<div class="rhead"><span class="tag">'+tagText+'</span><div class="seg" role="group" aria-label="Language"><button data-l="en" aria-pressed="'+(lang==="en")+'">English</button><button data-l="hi" aria-pressed="'+(lang==="hi")+'" lang="hi">हिन्दी</button></div></div>'+
      '<h3 id="rtitle">'+t.looks+': '+label+'</h3>'+photoHtml+
      '<div class="row" style="margin-top:.7rem"><button class="btn ghost small" id="speakBtn">'+(speaking?t.stop:t.read)+'</button></div>'+
      '<h3>'+t.reuse+'</h3><div class="rgrid">'+cards+'</div>'+more+
      '<h3>'+t.sell+'</h3>'+
      '<div class="field"><label for="kg">'+t.weight+' <b id="kgv">'+kg+' kg</b></label><input id="kg" type="range" min="1" max="100" value="'+kg+'"></div>'+
      '<p class="earn">'+t.earn+' <output id="earnOut" aria-live="polite"></output></p>'+
      '<p class="hint">'+esc(pr.name)+': ₹'+pr.low+' – ₹'+pr.high+' '+t.per+'</p>'+
      '<div class="row"><button class="btn" id="ratesBtn">'+t.rates.replace("{c}",meta.cat)+'</button><button class="btn ghost" id="againBtn">'+t.again+'</button></div>'+
      noteHtml;
    function earn(){ $("#kgv").textContent=kg+" kg"; $("#earnOut").textContent="₹"+Math.round(pr.low*kg).toLocaleString("en-IN")+" – ₹"+Math.round(pr.high*kg).toLocaleString("en-IN"); }
    earn();
    $("#kg").addEventListener("input",function(e){ kg=+e.target.value; earn(); });
    result.querySelectorAll("[data-l]").forEach(function(b){ b.addEventListener("click",function(){ stopSpeak(); lang=b.dataset.l; showResult(key,false); }); });
    $("#ratesBtn").addEventListener("click",function(){ go("prices/"+meta.cat); });
    $("#againBtn").addEventListener("click",reallyReset);
    $("#speakBtn").addEventListener("click",function(){
      if(!window.speechSynthesis){ say("Read aloud is not supported in this browser."); return; }
      if(speaking){ stopSpeak(); this.textContent=t.read; return; }
      var u=new SpeechSynthesisUtterance(label+". "+ideas.join(" ")); u.lang=hi?"hi-IN":"en-IN";
      var btn=this; u.onend=function(){ speaking=false; btn.textContent=t.read; };
      speaking=true; btn.textContent=t.stop; window.speechSynthesis.speak(u);
    });
    if(focusIt){ result.focus({preventScroll:false}); }
  }

  function classify(r,g,b){
    var max=Math.max(r,g,b), min=Math.min(r,g,b), v=max/255, s=max?(max-min)/max:0, h=0;
    if(max!==min){ if(max===r) h=60*(((g-b)/(max-min))%6); else if(max===g) h=60*((b-r)/(max-min)+2); else h=60*((r-g)/(max-min)+4); if(h<0) h+=360; }
    if(v<0.28) return "ewaste";
    if(s<0.14) return v>0.8 ? "paper" : "metal";
    if(h>=15&&h<=55) return "paper";
    if(h>=75&&h<=170) return "glass";
    return "plastic";
  }
  function guess(src){
    return new Promise(function(res){
      var im=new Image();
      im.onload=function(){ try{ var c=document.createElement("canvas"); c.width=c.height=24; var x=c.getContext("2d"); x.drawImage(im,0,0,24,24); var d=x.getImageData(0,0,24,24).data, r=0,g=0,b=0,n=d.length/4; for(var i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];} res(classify(r/n,g/n,b/n)); }catch(e){ res("paper"); } };
      im.onerror=function(){ res("paper"); };
      im.src=src;
    });
  }
  function cantTell(why){
    vp.classList.remove("scanning"); setTiles(null); current=null;
    result.innerHTML='<h3 style="margin-top:0">We could not tell what this is</h3><p class="hint">'+why+'</p><p class="hint">Pick the scrap type from the tiles on the left, or try again with the item filling the frame in good light, one item at a time.</p>';
  }
  function analyse(src){
    var steps=["Looking at your photo…","Checking the material…","Matching with scrap types…"], i=0;
    vp.classList.add("scanning");
    result.innerHTML='<div class="row"><div class="spinner" aria-hidden="true"></div><span id="stepTxt" role="status">'+steps[0]+'</span></div>';
    var iv=setInterval(function(){ i++; var el=$("#stepTxt"); if(el&&i<steps.length) el.textContent=steps[i]; },700);
    var started=Date.now();
    function finish(fn){ setTimeout(function(){ clearInterval(iv); fn(); },Math.max(0,1200-(Date.now()-started))); }
    if(!REMOTE){
      /* Offline demo mode has no server to ask. A colour guess is only a rough hint, so it is labelled as one. */
      guess(src).then(function(k){ finish(function(){ vp.classList.remove("scanning"); showResult(k,true,"colour",[]); }); });
      return;
    }
    toB64(src,1024).then(function(b64){ return API.scan(b64); }).then(function(r){
      finish(function(){
        if(r&&r.material){ curPriceId=r.priceId||null; vp.classList.remove("scanning"); showResult(r.material,true,"rekognition",(r.labels||[]).map(function(l){ return l.name; })); }
        else cantTell("The scanner was not sure about this photo.");
      });
    }).catch(function(er){
      finish(function(){
        cantTell(er&&er.status===503 ? "Automatic scanning is not switched on for this site yet." : er&&er.status===429 ? "Too many scans in a short time. Wait a minute and try again." : "The scanner could not be reached just now.");
      });
    });
  }
  function showImage(src){
    stopCam(); snap.disabled=true; cam.setAttribute("aria-pressed","false"); $("#camLbl").textContent="Use camera";
    vp.innerHTML='<img alt="Your scrap photo" src="'+src+'"><div class="scanline"></div>';
    reset.hidden=false; curImg=src; setTiles(null); analyse(src);
  }
  function readFile(f){ if(!f||f.type.indexOf("image/")!==0){ say("Please choose an image file."); return; } var r=new FileReader(); r.onload=function(){ showImage(r.result); }; r.readAsDataURL(f); }

  vp.innerHTML=IDLE; idleResult();
  document.querySelectorAll(".tile").forEach(function(b){ b.addEventListener("click",function(){ stopSpeak(); curPriceId=null; showResult(b.dataset.m,true,"manual"); }); });
  $("#upBtn").addEventListener("click",function(){ $("#fileIn").click(); });
  $("#fileIn").addEventListener("change",function(e){ readFile(e.target.files&&e.target.files[0]); e.target.value=""; });
  $("#nativeBtn").addEventListener("click",function(){ $("#nativeIn").click(); });
  $("#nativeIn").addEventListener("change",function(e){ readFile(e.target.files&&e.target.files[0]); e.target.value=""; });
  reset.addEventListener("click",reallyReset);
  ["dragenter","dragover"].forEach(function(ev){ vp.addEventListener(ev,function(e){ e.preventDefault(); vp.classList.add("drag"); }); });
  ["dragleave","drop"].forEach(function(ev){ vp.addEventListener(ev,function(e){ e.preventDefault(); vp.classList.remove("drag"); }); });
  vp.addEventListener("drop",function(e){ readFile(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0]); });

  function camError(er){
    var n=er&&er.name;
    if(!window.isSecureContext) return "The live camera only works on https or localhost. Use Phone camera or Upload photo instead.";
    if(n==="NotAllowedError"||n==="SecurityError") return "Camera permission was blocked. Allow the camera for this site in your browser settings, then try again.";
    if(n==="NotFoundError"||n==="OverconstrainedError") return "No camera was found on this device. Use Upload photo instead.";
    if(n==="NotReadableError"||n==="AbortError") return "The camera is in use by another app. Close it and try again.";
    return "The camera could not start. Use Phone camera or Upload photo instead.";
  }
  function openCam(){
    var md=navigator.mediaDevices;
    return md.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:960}},audio:false}).catch(function(er){
      if(er&&(er.name==="OverconstrainedError"||er.name==="NotFoundError")) return md.getUserMedia({video:true,audio:false});
      throw er;
    });
  }
  cam.addEventListener("click",function(){
    if(stream){ stopCam(); vp.innerHTML=IDLE; snap.disabled=true; cam.setAttribute("aria-pressed","false"); $("#camLbl").textContent="Use camera"; return; }
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){ say(window.isSecureContext ? "This browser cannot open the camera. Use Phone camera or Upload photo instead." : "The live camera only works on https or localhost. Use Phone camera or Upload photo instead."); return; }
    say("Starting the camera…");
    openCam().then(function(s){
      stream=s; vp.innerHTML=""; video=document.createElement("video");
      video.setAttribute("playsinline",""); video.muted=true; video.srcObject=s;
      vp.appendChild(video); var f=document.createElement("div"); f.className="frame"; vp.appendChild(f);
      var p=video.play(); if(p&&p.catch) p.catch(function(){});
      snap.disabled=true; cam.setAttribute("aria-pressed","true"); $("#camLbl").textContent="Stop camera";
      video.addEventListener("loadeddata",function(){ snap.disabled=false; say("Camera is on. Put your scrap inside the frame, then press Capture photo."); },{once:true});
    }).catch(function(er){ say(camError(er)); });
  });
  snap.addEventListener("click",function(){
    if(!video||!video.videoWidth) return;
    var c=document.createElement("canvas"); c.width=video.videoWidth; c.height=video.videoHeight;
    c.getContext("2d").drawImage(video,0,0); showImage(c.toDataURL("image/jpeg",.85));
  });
};