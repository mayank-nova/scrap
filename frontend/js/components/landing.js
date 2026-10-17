/* Home page: photo/video hero, scrap ticker, photo gallery, steps, roles, quote. */

/* Put your own files in assets/. Any that are missing fall back to a pattern, nothing breaks. */
var HERO_VIDEO  = "assets/hero.mp4";      /* 15-30s muted loop, under ~6 MB */

var GALLERY = [
  {src:"assets/photos/paper.jpg",     title:"Paper and cardboard", note:"Baled and ready to go"},
  {src:"assets/photos/metal.jpg",     title:"Metal",               note:"Iron, steel, copper, brass"},
  {src:"assets/photos/plastic.jpg",   title:"Plastic bottles",     note:"Sorted by type"},
  {src:"assets/photos/collector.jpg", title:"The collector",       note:"The person who makes it work"}
];
var TICKER_EN = ["Newspaper","Iron","Glass","Plastic","Cardboard","Aluminium","Copper","Brass","Old mobiles","Scrap"];
var TICKER_HI = ["Raddi","Loha","Kaanch","Plastic","Gatta","Aluminium","Taamba","Pital","Purane mobile","Kabaad"];

function isCollectorView(){ return currentRole()==="collector"; }

function photo(src,label,alt){
  return '<div class="ph" data-label="'+esc(label)+'"><img src="'+src+'" alt="'+esc(alt||"")+'" loading="lazy" onerror="this.parentNode.classList.add(\'nophoto\');this.remove()"></div>';
}
function heroMedia(){
  return '<div class="hero-bg" aria-hidden="true">'+
    '<video id="heroVid" src="'+HERO_VIDEO+'" autoplay muted loop playsinline preload="auto" onerror="this.remove()"></video>'+
  '</div>';
}

function rateBoard(){
  var rows=["newspaper","cardboard","pet","iron","aluminium","copper"].map(function(id){
    var p=PRICES[PRICE_IDS.indexOf(id)]; if(!p) return "";
    return '<li><span>'+esc(p.name)+'</span><i></i><b>₹'+p.low+' – '+p.high+'</b></li>';
  }).join("");
  return '<div class="board"><h2>Aaj ka bhav <span>per kg</span></h2><ul>'+rows+'</ul><p>Sample rates. Real ones move with the market.</p></div>';
}
function journeyStops(){
  if(!isCollectorView()) return JSTOPS;
  return JSTOPS.map(function(st,i){
    if(i!==0) return st;
    var c={}; for(var k in st) c[k]=st[k];
    c.text="Households set aside newspapers, bottles, metal and old electronics and book a pickup.";
    c.tag="Customers book, you collect";
    return c;
  });
}
function roleTabs(){
  if(!isCollectorView()) return ROLES;
  return ROLES.map(function(r){
    return {tab:r.tab, perks:r.perks.filter(function(p){ return !/scan|reuse/i.test(p.t+" "+p.d); })};
  });
}
pages.home = function(){
  var col=isCollectorView();
  var tick=TICKER_EN.map(function(en,i){
  var hi=TICKER_HI[i]||"";
  return '<span lang="en">'+en+'</span>'+(hi && hi.toLowerCase()!==en.toLowerCase() ? '<span lang="hi-Latn">'+hi+'</span>' : '');
}).join("");
  var gal=GALLERY.map(function(g){
    return '<figure>'+photo(g.src,g.title,g.title)+'<figcaption>'+g.title+'<small>'+g.note+'</small></figcaption></figure>';
  }).join("");
  var journey='<div class="card journey" id="journey">'+
    '<div class="jtrack" role="tablist" aria-label="Journey of your scrap"><div class="jfill" id="jfill"></div>'+
      journeyStops().map(function(st,i){
        return '<button class="jstop" role="tab" data-j="'+i+'" aria-selected="false"><span class="dot"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+st.icon+'</svg></span>'+st.short+'</button>';
      }).join("")+
    '</div>'+
    '<div class="jpanel" id="jpanel" role="tabpanel" aria-live="polite"></div>'+
  '</div>';
  var rtabs=roleTabs().map(function(r,i){
  return '<button class="rtab" role="tab" data-r="'+i+'" aria-selected="false">'+r.tab+'</button>';
}).join("");
  return '<div class="hero-band">'+heroMedia()+
    '<div class="wrap hero"><div>'+
      '<p class="kicker">Raddi, kabaad, kaanch, loha</p>'+
      '<h1>The bridge between your raddi and the recycler.</h1>'+
      '<p class="lead">We pick up your scrap, pay you the listed rate, and sell it on in bulk to recycling companies. Small collectors get steady work instead of uncertain days.</p>'+
      '<div class="actions">'+
        (col ? '<button class="btn" data-go="dashboard">Open your dashboard</button><button class="btn ghost" data-go="prices">Buy and sell rates</button>'
             : '<button class="btn" data-go="pickup">Book a pickup</button><button class="btn ghost" data-go="prices">See all rates</button>')+
      '</div></div>'+rateBoard()+'</div></div>'+
  '<div class="ticker" aria-hidden="true"><div>'+tick+tick+'</div></div>'+
  '<div class="wrap">'+
    '<h2 class="sect-title rv" style="border-top:0">What we handle</h2>'+
    '<div class="gallery rv">'+gal+'</div>'+
    '<h2 class="sect-title">Where your scrap goes</h2>'+journey+
    '<h2 class="sect-title">Who it is for</h2>'+
'<div class="rtabs" role="tablist" aria-label="Who Scrap Setu is for">'+rtabs+'</div>'+
'<div class="rpanel" id="rpanel" role="tabpanel" aria-live="polite"></div>'+
    '<div class="quote rv"><p>Your scrap is someone\'s livelihood.</p><small>आपका कबाड़, किसी का रोज़गार।</small></div>'+
    '<div class="stats rv">'+
      '<div><strong>15</strong>scrap types with listed rates</div>'+
      (col ? '<div><strong>1 tap</strong>to accept a pickup</div>' : '<div><strong>1 photo</strong>to get reuse ideas</div>')+
      '<div><strong>No</strong>middlemen between collector and recycler</div>'+
    '</div>'+
  '</div>';
};


wire.home = function(){
    /* role tabs: I have scrap / I collect scrap / I recycle */
  var R=roleTabs(), tabs=document.querySelectorAll(".rtab");
  function role(i){
    tabs.forEach(function(b,k){ b.setAttribute("aria-selected",k===i); });
    $("#rpanel").innerHTML=R[i].perks.map(function(p){
      return '<div class="perk"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p.i+'</svg><h3>'+p.t+'</h3><p>'+p.d+'</p></div>';
    }).join("");
  }
  tabs.forEach(function(b){ b.addEventListener("click",function(){ role(+b.dataset.r); }); });
  role(isCollectorView()?1:0);
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator.connection && navigator.connection.saveData);

  /* journey: auto-advances, click any step to jump */
  var J=journeyStops(), idx=0, timer=null;
  var stops=document.querySelectorAll(".jstop");
  function show(i){
    idx=i; var st=J[i];
    stops.forEach(function(b,k){ b.setAttribute("aria-selected",k===i); b.classList.toggle("done",k<i); });
    $("#jfill").style.width=(80*i/(J.length-1))+"%";
    $("#jpanel").innerHTML='<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+st.icon+'</svg><div><h3>'+st.title+'</h3><p>'+st.text+'</p><span class="tag">'+st.tag+'</span></div>';
  }
  function stopAuto(){ if(timer){ clearInterval(timer); timer=null; } }
  stops.forEach(function(b){ b.addEventListener("click",function(){ stopAuto(); show(+b.dataset.j); }); });
  show(0);
  if(!calm){ timer=setInterval(function(){ if(!document.getElementById("journey")){ stopAuto(); return; } show((idx+1)%J.length); },4500); }

  /* hero video fade-in */
  var v=document.getElementById("heroVid");
  if(v){ if(calm){ v.remove(); } else { v.style.opacity=0; v.style.transition="opacity 1s"; v.addEventListener("loadeddata",function(){ v.style.opacity=1; }); } }

  /* scroll reveal */
  if(calm||!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js-rv");
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); },{threshold:.12});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
};