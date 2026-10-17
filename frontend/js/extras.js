/* Extra features, loaded after the other components:
   Google login, nearest-collector location + map, notifications, cancel and rate a pickup,
   About and Contact pages stored in the database, admin panel, in-site tutorial videos, price trend arrows. */

var SERVER = {googleClientId:"", videos:false, aiScan:false};
var SITE = {about:null, contact:null};

/* ---------- styles ---------- */
(function(){
  var s=document.createElement("style");
  s.textContent=
  ".gbox{margin-top:1.2rem}.gor{display:flex;align-items:center;gap:.8rem;color:var(--muted);margin:0 0 1rem}.gor:before,.gor:after{content:\"\";flex:1;border-top:1px solid var(--line)}"+
  ".d-acts{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;padding:.1rem 0 .9rem}"+
  ".st-cancelled{background:var(--danger-soft);color:var(--danger)}.d-dot.s-cancelled{background:var(--danger)}.d-dot.s-completed{background:var(--leaf-deep)}"+
  ".trend{font-size:.8rem;font-weight:600;margin-left:.4rem;white-space:nowrap}.trend.up{color:var(--leaf)}.trend.down{color:var(--danger)}"+
  ".bell{position:relative;display:inline-flex;align-items:center;padding:.4rem .55rem}.bdot{position:absolute;top:-2px;right:-2px;min-width:1.05rem;height:1.05rem;padding:0 .2rem;border-radius:1rem;background:var(--rust);color:#fff;font:700 .68rem/1.05rem var(--body);text-align:center}"+
  ".bpanel{position:fixed;z-index:200;width:min(360px,92vw);max-height:70vh;overflow:auto;background:var(--surface);color:var(--text);border:2px solid var(--ink);box-shadow:4px 4px 0 var(--ink);border-radius:var(--radius)}"+
  ".bpanel h4{margin:0;padding:.7rem 1rem;border-bottom:1px solid var(--line)}.bitem{display:block;width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--line);padding:.7rem 1rem;color:inherit;font:inherit;cursor:pointer}.bitem.new{background:var(--leaf-soft)}.bitem small{display:block;color:var(--muted);margin-top:.15rem}.bempty{padding:1rem;color:var(--muted)}"+
  ".ssmodal{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:1rem}.ssbox{background:var(--surface);color:var(--text);border:2px solid var(--ink);box-shadow:5px 5px 0 var(--ink);border-radius:var(--radius);padding:1.4rem;width:min(640px,100%);max-height:92vh;overflow:auto}"+
  ".stars{display:flex;gap:.2rem;margin:.6rem 0 1rem}.star{background:none;border:0;font-size:2rem;line-height:1;color:var(--line);cursor:pointer;padding:0 .1rem}.star.on{color:#e0a21a}"+
  ".vframe{position:relative;padding-top:56.25%;margin:.8rem 0;background:#000}.vframe iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.vlist{display:flex;flex-direction:column;gap:.4rem}.vlist button{text-align:left;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--radius);padding:.5rem .7rem;color:inherit;font:inherit;cursor:pointer}.vlist button[aria-current=true]{border-color:var(--leaf);font-weight:600}"+
  ".cinfo{display:grid;gap:.5rem;margin:1.2rem 0;padding:1rem;border:1px solid var(--line);background:var(--surface);border-radius:var(--radius)}.cinfo b{display:inline-block;min-width:5.5rem}"+
  ".adtable input{width:5rem;padding:.3rem}.adtable td{vertical-align:middle}.adform .field{margin-bottom:.8rem}.msg{border:1px solid var(--line);padding:.8rem 1rem;margin-bottom:.7rem;background:var(--surface);border-radius:var(--radius)}.msg small{color:var(--muted)}"+
  "#k-map{z-index:0}";
  document.head.appendChild(s);
})();

/* ---------- server settings + page content (About, Contact) ---------- */
var serverReady = REMOTE ? API.config().then(function(c){ SERVER=c||SERVER; }).catch(function(){}) : Promise.resolve();
if(REMOTE){
  API.content().then(function(c){
    if(!c) return; SITE.about=c.about; SITE.contact=c.contact;
    if(/^#\/(about|contact)/.test(location.hash)) render();
  }).catch(function(){});
}

var DEFAULT_ABOUT = {
  headline:"We connect small scrap collectors to big recyclers.",
  lead:"Setu (सेतु) means bridge. Many small collectors sell through a chain of middlemen and take whatever price they are offered. We want to shorten that chain.",
  points:[["For households","Book a pickup, get a listed rate, and photograph any scrap to see how it could be reused before you sell."],["For collectors","See pickup requests nearby and sell through us to large recyclers with steady demand."],["For the planet","More scrap reaches proper recycling instead of landfills and open burning."]]
};

pages.about = function(){
  var a=SITE.about||DEFAULT_ABOUT;
  return '<div class="wrap"><section class="page">'+
    '<p class="kicker">About Scrap Setu</p>'+
    '<h2>'+esc(a.headline||"")+'</h2>'+
    '<p class="lead">'+esc(a.lead||"")+'</p>'+
    '<figure class="wide-photo" style="margin-inline:0">'+photo("assets/photos/about.jpg","Photo: collectors at work","Scrap collectors at work")+'</figure>'+
    points((a.points||[]).map(function(p){ return [esc(p[0]),esc(p[1])]; }))+
    '<div class="row"><button class="btn" data-go="signup">Join Scrap Setu</button><button class="btn ghost" data-go="home">Back to home</button></div>'+
  '</section></div>';
};

function contactInfoHtml(){
  var c=SITE.contact||{}, rows=[];
  if(c.email) rows.push('<div><b>Email</b><a href="mailto:'+esc(c.email)+'">'+esc(c.email)+'</a></div>');
  if(c.phone) rows.push('<div><b>Phone</b><a href="tel:'+esc(String(c.phone).replace(/[^\d+]/g,""))+'">'+esc(c.phone)+'</a></div>');
  if(c.whatsapp) rows.push('<div><b>WhatsApp</b><a href="https://wa.me/'+esc(String(c.whatsapp).replace(/\D/g,""))+'" target="_blank" rel="noopener noreferrer">Chat with us</a></div>');
  if(c.address) rows.push('<div><b>Address</b>'+esc(c.address)+'</div>');
  if(c.hours) rows.push('<div><b>Hours</b>'+esc(c.hours)+'</div>');
  return rows.length ? '<div class="cinfo">'+rows.join("")+'</div>' : "";
}
pages.contact = function(){
  return '<div class="wrap"><section class="auth"><h2>Contact us</h2><p>Collectors, recyclers or just curious? Write to us.</p>'+
    contactInfoHtml()+
    '<form id="contactForm" novalidate>'+
      '<div class="field"><label for="cn">Your name</label><input id="cn" autocomplete="name" value="'+esc(session?session.name:"")+'" required></div>'+
      '<div class="field"><label for="ce">Email or phone</label><input id="ce" required></div>'+
      '<div class="field"><label for="cm">Message</label><textarea id="cm" rows="4" required></textarea></div>'+
      '<div id="cmsg"></div>'+
      '<div class="row"><button class="btn" type="submit">Send message</button><button class="btn ghost" type="button" data-go="home">Back to home</button></div>'+
    '</form>'+(REMOTE?'':'<p class="hint" style="margin-top:1rem">Demo mode: messages are not sent anywhere.</p>')+'</section></div>';
};
wire.contact = function(){
  var f=$("#contactForm"); if(!f) return;
  f.addEventListener("submit", function(e){
    e.preventDefault();
    var b={name:$("#cn").value.trim(),contact:$("#ce").value.trim(),message:$("#cm").value.trim()}, out=$("#cmsg"), btn=f.querySelector("button[type=submit]");
    if(!(b.name&&b.contact&&b.message)){ out.innerHTML='<p class="err-text" role="alert">Fill in all three fields.</p>'; return; }
    if(!REMOTE){ out.innerHTML='<div class="ok" role="status">Thanks, we have noted your message.</div>'; return; }
    btn.disabled=true;
    API.contact(b).then(function(){ out.innerHTML='<div class="ok" role="status">Thanks, your message was sent. We will get back to you.</div>'; f.reset(); btn.disabled=false; })
      .catch(function(er){ btn.disabled=false; out.innerHTML='<p class="err-text" role="alert">'+esc(er.message||"Could not send your message.")+'</p>'; });
  });
};

/* ---------- Google sign-in ---------- */
function loadGoogle(){
  if(window.google && google.accounts && google.accounts.id) return Promise.resolve();
  return new Promise(function(res,rej){ var s=document.createElement("script"); s.src="https://accounts.google.com/gsi/client"; s.async=true; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
}
function onGoogle(resp){
  var role=($("#sr")||$("#gr")||{}).value||"customer", err=$("#gerr");
  if(err) err.hidden=true;
  Auth.google(resp.credential,role).then(function(sn){ session=sn; go("dashboard"); }).catch(function(er){
    if(err){ err.textContent=er.message||"Google sign-in failed."; err.hidden=false; }
  });
}
function addGoogle(kind){
  if(!REMOTE) return;
  var form = kind==="login" ? $("#loginForm") : $("#signupForm"); if(!form) return;
  serverReady.then(function(){
    if(!SERVER.googleClientId || !$("#"+form.id) || $("#gbtn")) return;
    var box=document.createElement("div"); box.className="gbox";
    box.innerHTML='<div class="gor"><span>or</span></div>'+
      (kind==="login"?'<div class="field"><label for="gr">New here? Join as</label><select id="gr"><option value="customer">Customer</option><option value="collector">Scrap collector</option></select></div>':'')+
      '<div id="gbtn"></div><p class="err-text" id="gerr" hidden></p>';
    form.insertAdjacentElement("afterend",box);
    loadGoogle().then(function(){
      google.accounts.id.initialize({client_id:SERVER.googleClientId,callback:onGoogle});
      google.accounts.id.renderButton($("#gbtn"),{theme:"outline",size:"large",text:kind==="login"?"signin_with":"signup_with",width:280});
    }).catch(function(){ box.innerHTML='<p class="hint">Google sign-in could not load. Check your connection.</p>'; });
  });
}
(function(){
  var wl=wire.login; wire.login=wire["login-error"]=function(){ if(wl) wl(); addGoogle("login"); };
  var ws=wire.signup; wire.signup=function(){ if(ws) ws(); addGoogle("signup"); };
})();

/* ---------- small shared helpers: modal, stars ---------- */
function openModal(html){
  closeModal();
  var m=document.createElement("div"); m.className="ssmodal"; m.id="ssModal"; m.setAttribute("role","dialog"); m.setAttribute("aria-modal","true");
  m.innerHTML='<div class="ssbox">'+html+'</div>';
  m.addEventListener("click",function(e){ if(e.target===m||e.target.closest("[data-close]")) closeModal(); });
  document.body.appendChild(m);
  return m;
}
function closeModal(){ var m=$("#ssModal"); if(m) m.remove(); }
document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeModal(); });
function stars(n){ var s=""; for(var i=1;i<=5;i++) s+=(i<=n?"★":"☆"); return s; }
function failBtn(b){ return function(er){ if(er.status===401){ handleAuthLost(); return; } if(b) b.disabled=false; alert(er.message||"That did not work."); }; }

/* ---------- cancel + rate a pickup (customer) ---------- */
function custActions(p){
  var h="";
  if(p.collectorName && (p.status==="accepted"||p.status==="completed")) h+='<span class="hint">Collector: '+esc(p.collectorName)+'</span>';
  if(p.status==="open"||p.status==="accepted") h+='<button class="btn ghost small" data-cact="cancel" data-id="'+esc(p.id)+'">Cancel pickup</button>';
  if(p.status==="completed") h+= p.rating ? '<span class="hint">You rated: <span style="color:#e0a21a">'+stars(p.rating)+'</span></span>' : '<button class="btn small" data-cact="rate" data-id="'+esc(p.id)+'">Rate your collector</button>';
  return h ? '<div class="d-acts">'+h+'</div>' : "";
}
(function(){
  var cr=custRow; custRow=function(p){ return cr(p)+custActions(p); };
  var pc=pickupCard;
  pickupCard=function(p,mode){
    var h=pc(p,mode);
    if(mode==="cust"){ var a=custActions(p); if(a) h=h.replace(/<\/article>\s*$/,a+"</article>"); }
    else if(mode==="open" && p.distanceKm!=null){ h=h.replace('<p class="hint">Estimated','<p class="hint">'+esc(p.distanceKm)+' km away</p><p class="hint">Estimated'); }
    return h;
  };
})();
function rateModal(id){
  var m=openModal('<h3 style="margin-top:0">Rate your collector</h3><div class="stars" id="stars">'+[1,2,3,4,5].map(function(n){ return '<button type="button" class="star" data-n="'+n+'" aria-label="'+n+' star">★</button>'; }).join("")+'</div>'+
    '<div class="field"><label for="rv">Comment (optional)</label><textarea id="rv" rows="3" maxlength="300"></textarea></div><p class="err-text" id="rerr" hidden></p>'+
    '<div class="row"><button class="btn" id="rsend" type="button">Submit rating</button><button class="btn ghost" type="button" data-close>Cancel</button></div>');
  var val=0;
  m.querySelector("#stars").addEventListener("click",function(e){ var b=e.target.closest(".star"); if(!b) return; val=+b.dataset.n; m.querySelectorAll(".star").forEach(function(x){ x.classList.toggle("on",+x.dataset.n<=val); }); });
  m.querySelector("#rsend").addEventListener("click",function(){
    var err=m.querySelector("#rerr"); if(!val){ err.textContent="Tap a star to choose your rating."; err.hidden=false; return; }
    var btn=this; btn.disabled=true;
    API.rate(id,val,m.querySelector("#rv").value).then(function(){ closeModal(); render(); }).catch(function(er){
      if(er.status===401){ closeModal(); handleAuthLost(); return; }
      btn.disabled=false; err.textContent=er.message||"Could not save your rating."; err.hidden=false;
    });
  });
}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-cact]"); if(!b) return;
  var id=b.dataset.id;
  if(b.dataset.cact==="rate"){ rateModal(id); return; }
  if(!confirm("Cancel pickup "+id+"?")) return;
  b.disabled=true;
  API.cancel(id).then(function(){ render(); }).catch(failBtn(b));
});

/* ---------- location: nearest collector ---------- */
function getPosition(){
  return new Promise(function(res,rej){
    if(!navigator.geolocation){ rej(new Error("This browser cannot share a location.")); return; }
    navigator.geolocation.getCurrentPosition(function(p){ res({lat:p.coords.latitude,lng:p.coords.longitude}); },
      function(){ rej(new Error("Location permission was blocked. Allow location for this site in your browser and try again.")); },
      {enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  });
}
var pickupLoc=null;

/* Turn coordinates into a readable address (OpenStreetMap Nominatim; fine for light use). */
function reverseGeocode(lat,lng){
  return fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=en&lat="+lat+"&lon="+lng)
    .then(function(r){ if(!r.ok) throw new Error("lookup failed"); return r.json(); })
    .then(function(j){
      var a=j.address||{}, seen={}, parts=[
        a.house_number, a.road||a.pedestrian||a.footway, a.neighbourhood||a.residential, a.suburb,
        a.city_district, a.city||a.town||a.village||a.county, a.state
      ].filter(function(x){ if(!x||seen[x]) return false; seen[x]=1; return true; });
      return {text:parts.join(", ")||j.display_name||"", pincode:String(a.postcode||"").replace(/\s/g,"")};
    });
}

(function(){
  var cp=API.createPickup;
  API.createPickup=function(p){ if(pickupLoc&&REMOTE){ p.lat=pickupLoc.lat; p.lng=pickupLoc.lng; } return cp(p).then(function(r){ pickupLoc=null; return r; }); };
  var wp=wire.pickup;
  wire.pickup=function(){
    if(wp) wp();
    var pa=$("#pa"); if(!pa||!REMOTE) return;
    pickupLoc=null;
    var pmap=null, pmark=null, autoFilled=false;
    var box=document.createElement("div"); box.className="field";
    box.innerHTML='<button type="button" class="btn ghost small" id="locBtn">Use my current location</button> <span class="hint" id="locMsg">Fills in your address and shows your spot on a map. Collectors only see it roughly (about 1 km) until one accepts.</span><div id="pmap" class="jmap" style="display:none"></div>';
    pa.closest(".field").insertAdjacentElement("afterend",box);

    function fill(pos){
      var msg=$("#locMsg"); msg.textContent="Looking up your address…";
      reverseGeocode(pos.lat,pos.lng).then(function(a){
        if(a.text && (!pa.value.trim() || autoFilled)){ pa.value=a.text; autoFilled=true; }
        if(/^\d{6}$/.test(a.pincode)){ var pp=$("#pp"); if(pp) pp.value=a.pincode; }
        msg.textContent="Address filled in. Check it and add your house or flat number. Drag the pin if it is not exactly right.";
      }).catch(function(){ msg.textContent="Location saved, but we could not look up the address. Please type it in."; });
    }
    function showPin(pos){
      var el=$("#pmap"); el.style.display="block";
      loadLeaflet().then(function(){
        if(!pmap){
          pmap=L.map(el).setView([pos.lat,pos.lng],17);
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(pmap);
          pmark=L.marker([pos.lat,pos.lng],{draggable:true}).addTo(pmap);
          pmark.on("dragend",function(){ var ll=pmark.getLatLng(); pickupLoc={lat:ll.lat,lng:ll.lng}; fill(pickupLoc); });
        } else { pmark.setLatLng([pos.lat,pos.lng]); pmap.setView([pos.lat,pos.lng],17); }
        setTimeout(function(){ pmap.invalidateSize(); },50);
      }).catch(function(){ el.style.display="none"; });
    }
    $("#locBtn").addEventListener("click",function(){
      var b=this, msg=$("#locMsg"); b.disabled=true; msg.textContent="Finding your location…";
      getPosition().then(function(pos){
        pickupLoc=pos; b.textContent="Update location"; b.disabled=false;
        showPin(pos); fill(pos);
      }).catch(function(er){ msg.textContent=er.message; b.disabled=false; });
    });
  };
})();

/* collector: set own location, distances, directions, map, stats */
function mapsLink(p){
  if(p.lat!=null&&p.lng!=null) return "https://www.google.com/maps/dir/?api=1&destination="+p.lat+","+p.lng;
  return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((p.address||"")+" "+(p.pincode||""));
}
(function(){
  var oRow=openRow; openRow=function(p){
    var h=oRow(p);
    return p.distanceKm!=null ? h.replace('<p class="d-meta">Pincode ','<p class="d-meta">'+esc(p.distanceKm)+' km away · Pincode ') : h;
  };
  var jRow=jobRow; jobRow=function(p){
    return jRow(p).replace('<button class="btn small" data-act="complete"','<a class="btn ghost small" href="'+esc(mapsLink(p))+'" target="_blank" rel="noopener noreferrer">Directions</a> <button class="btn small" data-act="complete"');
  };
})();

function loadLeaflet(){
  if(window.L) return Promise.resolve();
  return new Promise(function(res,rej){
    var l=document.createElement("link"); l.rel="stylesheet"; l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(l);
    var s=document.createElement("script"); s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s);
  });
}
function drawMap(){
  var el=$("#k-map"), note=$("#k-mapnote"); if(!el) return;
  API.openPickups().then(function(list){
    var pts=list.filter(function(p){ return p.areaLat!=null; });
    var me=(session&&session.lat!=null)?[session.lat,session.lng]:null;
    if(!pts.length&&!me){ el.style.display="none"; note.textContent="No requests with a location yet. Requests appear here when customers share their location. Press 'Use my location' to see how far each one is."; return; }
    return loadLeaflet().then(function(){
      if(!$("#k-map")) return;
      var map=L.map(el).setView(me||[pts[0].areaLat,pts[0].areaLng],12), bounds=[];
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
      if(me){ L.circleMarker(me,{radius:8,color:"#1f5a34",fillOpacity:.9}).addTo(map).bindPopup("You are here"); bounds.push(me); }
      pts.forEach(function(p){
        var t=(p.items||[]).map(function(i){ return esc(i.name||itemLabel(i.type))+" "+esc(i.kg)+" kg"; }).join(", ");
        L.marker([p.areaLat,p.areaLng]).addTo(map).bindPopup("<b>"+esc(p.id)+"</b><br>"+t+(p.distanceKm!=null?"<br>"+esc(p.distanceKm)+" km away":""));
        bounds.push([p.areaLat,p.areaLng]);
      });
      if(bounds.length>1) map.fitBounds(bounds,{padding:[30,30]});
      note.textContent=pts.length+" open request"+(pts.length===1?"":"s")+" with a location. Pins are accurate to about 1 km until you accept.";
    });
  }).catch(function(){ note.textContent="The map could not load right now."; });
}

(function(){
  var wd=wire.dashboard, pd=pages.dashboard;
  pages.dashboard=function(){ return (session&&session.role==="admin") ? pages.admin() : pd(); };
  wire.dashboard=function(){
    if(session&&session.role==="admin"){ wire.admin(); return; }
    wd();
    if(!session||!REMOTE) return;
    if(session.role==="collector"){
      var head=$("#k-main .d-head"), stats=$("#k-stats"); if(!head||!stats) return;
      var has=session.lat!=null;
      stats.insertAdjacentHTML("beforebegin",'<p class="d-note" id="kLocNote" style="margin:0 0 1rem">'+(has?"Requests are listed nearest first.":"Share your location to see the nearest requests first and how far each one is.")+' <button class="btn link" id="kLoc" type="button">'+(has?"Update my location":"Use my location")+'</button></p>');
      $("#kLoc").addEventListener("click",function(){
        var b=this; b.disabled=true; b.textContent="Finding you…";
        getPosition().then(function(pos){ return API.setLocation(pos.lat,pos.lng); }).then(function(u){ session.lat=u.lat; session.lng=u.lng; render(); })
          .catch(function(er){ b.disabled=false; b.textContent="Use my location"; if(er.status===401){ handleAuthLost(); return; } $("#kLocNote").insertAdjacentHTML("beforeend",' <span class="err-text">'+esc(er.message)+'</span>'); });
      });
      stats.insertAdjacentHTML("afterend",'<div class="d-stats" id="x-stats"></div>');
      $("#k-main").insertAdjacentHTML("beforeend",'<div class="d-sec" style="margin-top:2.5rem"><h3>Requests on the map</h3><div id="k-map" style="height:340px;border:1px solid var(--line)"></div><p class="d-note" id="k-mapnote">Loading map…</p></div>');
      drawMap();
    } else {
      var cs=$("#c-stats"); if(cs) cs.insertAdjacentHTML("afterend",'<div class="d-stats" id="x-stats"></div>');
    }
        API.stats().then(function(s){
      var x=$("#x-stats"); if(!x) return;
      x.classList.add("four");
      if(session.role==="collector"){
        x.innerHTML = dStat("Est. profit",money(s.earned))+dStat("Scrap collected",s.kg+" kg")+dStat("CO₂ saved","≈ "+s.co2Kg+" kg")+
          dStat("Your rating",s.ratingAvg!=null?stars(Math.round(s.ratingAvg))+" "+s.ratingAvg+" ("+s.ratingCount+")":"No ratings yet");
        x.insertAdjacentHTML("afterend",'<p class="d-note" style="margin-top:-1rem">Profit is an estimate: what recyclers pay for the scrap minus what you paid customers (the amount you enter when marking a pickup collected, otherwise today\'s average rate).</p>');
      } else {
        x.innerHTML = dStat("Money earned",s.completed?"≈ "+money(s.earned):"₹0")+dStat("Scrap recycled",s.kg+" kg")+dStat("CO₂ saved","≈ "+s.co2Kg+" kg")+
          dStat("Pickups",s.completed+" done, "+s.active+" active");
      }
    }).catch(function(){});
  };
})();

/* ---------- notifications bell ---------- */
var BELL='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';
var notes={list:[],unread:0};
function paintDot(){ var d=$("#bdot"); if(!d) return; d.hidden=!notes.unread; d.textContent=notes.unread>9?"9+":notes.unread; }
function refreshBell(){
  if(!session||!REMOTE) return;
  API.notifications().then(function(j){ notes.list=j.notifications; notes.unread=j.unread; paintDot(); }).catch(function(){});
}
function closeBell(){ var p=$("#bpanel"); if(p) p.remove(); }
function toggleBell(){
  if($("#bpanel")){ closeBell(); return; }
  var b=$("#bellBtn"), r=b.getBoundingClientRect(), p=document.createElement("div");
  p.className="bpanel"; p.id="bpanel"; p.style.top=(r.bottom+8)+"px"; p.style.right=Math.max(8,window.innerWidth-r.right)+"px";
  p.innerHTML='<h4>Notifications</h4>'+(notes.list.length ? notes.list.map(function(n){
    return '<button class="bitem'+(n.read?'':' new')+'" data-link="'+esc(n.link||"")+'">'+esc(n.text)+'<small>'+esc(new Date(n.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}))+'</small></button>';
  }).join("") : '<div class="bempty">Nothing new yet.</div>');
  document.body.appendChild(p);
  p.addEventListener("click",function(e){ var it=e.target.closest(".bitem"); if(it&&it.dataset.link){ closeBell(); location.hash=it.dataset.link; } });
  if(notes.unread){ API.readNotifications().then(function(){ notes.unread=0; notes.list.forEach(function(n){ n.read=true; }); paintDot(); }).catch(function(){}); }
}
document.addEventListener("click",function(e){ if(!e.target.closest("#bpanel")&&!e.target.closest("#bellBtn")) closeBell(); });
function mountBell(){
  closeBell();
  var host=$("#authNav"); if(!host||!session||!REMOTE) return;
  var b=document.createElement("button"); b.className="navlink bell"; b.id="bellBtn"; b.type="button"; b.setAttribute("aria-label","Notifications");
  b.innerHTML=BELL+'<span class="bdot" id="bdot" hidden></span>';
  host.insertBefore(b,host.firstChild); b.addEventListener("click",toggleBell);
  paintDot(); refreshBell();
}
(function(){
  var rn=renderNav; renderNav=function(route){ rn(route); mountBell(); };
  setInterval(refreshBell,45000);
})();

/* ---------- tutorial videos inside the site (needs YOUTUBE_API_KEY on the server) ---------- */
document.addEventListener("click",function(e){
  var a=e.target.closest('a[href^="https://www.youtube.com/results"]');
  if(!a||!SERVER.videos||!REMOTE) return;
  e.preventDefault();
  var q="", href=a.href; try{ q=new URL(href).searchParams.get("search_query")||""; }catch(x){}
  var m=openModal('<h3 style="margin-top:0">Tutorials</h3><p class="hint" id="vload">Loading videos…</p><div id="vbox"></div><div class="row"><a class="btn ghost small" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">More on YouTube</a><button class="btn small" type="button" data-close>Close</button></div>');
  API.videos(q).then(function(list){
    if(!list.length){ closeModal(); window.open(href,"_blank","noopener"); return; }
    function show(i){
      m.querySelector("#vbox").innerHTML='<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(list[i].id)+'" title="'+esc(list[i].title)+'" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>'+
        '<div class="vlist">'+list.map(function(v,j){ return '<button type="button" data-v="'+j+'" aria-current="'+(j===i)+'">'+esc(v.title)+' <small>· '+esc(v.channel)+'</small></button>'; }).join("")+'</div>';
    }
    m.querySelector("#vload").remove(); show(0);
    m.querySelector("#vbox").addEventListener("click",function(ev){ var b=ev.target.closest("[data-v]"); if(b) show(+b.dataset.v); });
  }).catch(function(){ closeModal(); window.open(href,"_blank","noopener"); });
});

/* ---------- price trend arrow ---------- */
function trendMark(p){
  var t=Number(p.trendPct)||0; if(!t) return "";
  return ' <span class="trend '+(t>0?"up":"down")+'" title="'+(t>0?"Up":"Down")+' '+Math.abs(t)+'% since the last update">'+(t>0?"▲":"▼")+' '+Math.abs(t)+'%</span>';
}

/* ---------- admin panel ---------- */
SERVICES.admin=[{h:"Admin",items:[["Admin panel","admin"],["Scrap rates","prices"],["Contact page","contact"]]}];
TOPLINKS.admin=[["admin","Admin"]];

pages.admin = function(){
  if(!session||session.role!=="admin") return notForRole("Admins only","This page is for Scrap Setu admins.");
  return '<div class="wrap"><section class="page"><p class="kicker">Admin</p><h2>Admin panel</h2>'+
    '<div class="d-stats" id="adOverview"></div>'+
    '<h3>Scrap rates</h3><p class="hint">Edit the base rates (₹ per kg) or add a market trend in % that moves every rate of that item up or down. Customers and collectors see the new price straight away.</p>'+
    '<div class="scroll"><table class="adtable"><thead><tr><th>Item</th><th>You pay low</th><th>high</th><th>Recycler low</th><th>high</th><th>Trend %</th><th></th></tr></thead><tbody id="adPrices"><tr><td colspan="7">Loading…</td></tr></tbody></table></div>'+
    '<h3 style="margin-top:2.5rem">About page</h3><div class="adform" id="adAbout"></div>'+
    '<h3 style="margin-top:2.5rem">Contact details</h3><div class="adform" id="adContact"></div>'+
    '<h3 style="margin-top:2.5rem">Messages from the contact form</h3><div id="adMsgs"><p class="hint">Loading…</p></div>'+
  '</section></div>';
};

function fld(id,label,val,ta){
  return '<div class="field"><label for="'+id+'">'+label+'</label>'+(ta?'<textarea id="'+id+'" rows="3">'+esc(val||"")+'</textarea>':'<input id="'+id+'" value="'+esc(val||"")+'">')+'</div>';
}
wire.admin = function(){
  if(!$("#adPrices")) return;
  function bad(er){ if(er.status===401){ handleAuthLost(); return; } alert(er.message||"That did not work."); }

  API.adminOverview().then(function(o){
    $("#adOverview").innerHTML=dStat("Customers",o.customers)+dStat("Collectors",o.collectors)+dStat("Open / accepted",o.pickups.open+" / "+o.pickups.accepted)+dStat("Completed",o.pickups.completed)+dStat("Messages",o.messages);
  }).catch(bad);

  API.pricesRaw().then(function(list){
    $("#adPrices").innerHTML=list.map(function(p){
      var i=PRICE_IDS.indexOf(p.id), b=p.base;
      return '<tr data-id="'+esc(p.id)+'"><td>'+esc(i>=0?PRICES[i].name:p.id)+'</td>'+
        '<td><input type="number" min="0" data-k="low" value="'+b.low+'"></td><td><input type="number" min="0" data-k="high" value="'+b.high+'"></td>'+
        '<td><input type="number" min="0" data-k="sellLow" value="'+b.sellLow+'"></td><td><input type="number" min="0" data-k="sellHigh" value="'+b.sellHigh+'"></td>'+
        '<td><input type="number" step="0.5" data-k="trend" value="'+p.trend+'"></td>'+
        '<td><button class="btn small" type="button" data-save>Save</button> <span class="hint" data-note>Now ₹'+p.low+' – '+p.high+'</span></td></tr>';
    }).join("");
  }).catch(bad);
  $("#adPrices").addEventListener("click",function(e){
    var btn=e.target.closest("[data-save]"); if(!btn) return;
    var tr=btn.closest("tr"), body={}, note=tr.querySelector("[data-note]");
    tr.querySelectorAll("input").forEach(function(inp){ body[inp.dataset.k]=Number(inp.value)||0; });
    btn.disabled=true;
    API.adminSetPrice(tr.dataset.id,body).then(function(p){ mergePrices([p]); note.textContent="Saved. Now ₹"+p.low+" – "+p.high; btn.disabled=false; })
      .catch(function(er){ btn.disabled=false; note.textContent=er.message||"Not saved."; });
  });

  API.content().then(function(c){
    var a=(c&&c.about)||SITE.about||DEFAULT_ABOUT, k=(c&&c.contact)||SITE.contact||{}, pts=a.points||[];
    $("#adAbout").innerHTML=fld("ab-h","Headline",a.headline)+fld("ab-l","Intro text",a.lead,true)+
      [0,1,2].map(function(n){ var p=pts[n]||["",""]; return fld("ab-t"+n,"Point "+(n+1)+" title",p[0])+fld("ab-d"+n,"Point "+(n+1)+" text",p[1],true); }).join("")+
      '<button class="btn" type="button" id="abSave">Save About page</button> <span class="hint" id="abNote"></span>';
    $("#adContact").innerHTML=fld("ct-e","Email",k.email)+fld("ct-p","Phone",k.phone)+fld("ct-w","WhatsApp number (with country code, optional)",k.whatsapp)+fld("ct-a","Address",k.address)+fld("ct-h","Opening hours",k.hours)+
      '<button class="btn" type="button" id="ctSave">Save contact details</button> <span class="hint" id="ctNote"></span>';
    $("#abSave").addEventListener("click",function(){
      var v={headline:$("#ab-h").value.trim(),lead:$("#ab-l").value.trim(),points:[]};
      [0,1,2].forEach(function(n){ var t=$("#ab-t"+n).value.trim(); if(t) v.points.push([t,$("#ab-d"+n).value.trim()]); });
      API.adminSetContent("about",v).then(function(){ SITE.about=v; $("#abNote").textContent="Saved."; }).catch(function(er){ $("#abNote").textContent=er.message||"Not saved."; });
    });
    $("#ctSave").addEventListener("click",function(){
      var v={email:$("#ct-e").value.trim(),phone:$("#ct-p").value.trim(),whatsapp:$("#ct-w").value.trim(),address:$("#ct-a").value.trim(),hours:$("#ct-h").value.trim()};
      API.adminSetContent("contact",v).then(function(){ SITE.contact=v; $("#ctNote").textContent="Saved."; }).catch(function(er){ $("#ctNote").textContent=er.message||"Not saved."; });
    });
  }).catch(bad);

  API.adminMessages().then(function(list){
    $("#adMsgs").innerHTML=list.length ? list.map(function(m){
      return '<div class="msg"><b>'+esc(m.name)+'</b> · '+esc(m.contact)+' <small>· '+esc(new Date(m.createdAt).toLocaleString("en-IN"))+'</small><p style="margin:.4rem 0 0">'+esc(m.message)+'</p></div>';
    }).join("") : '<p class="hint">No messages yet.</p>';
  }).catch(bad);
};
/* ---- collector: map per request. Open = rough area (1 km), accepted = exact pin ---- */
(function(){
  var oRow=openRow; openRow=function(p){
    var h=oRow(p);
    if(p.areaLat==null) return h;
    return h.replace(/<\/article>$/,'<button class="btn ghost small" data-pmap data-lat="'+p.areaLat+'" data-lng="'+p.areaLng+'" data-approx="1" type="button">View area on map</button><div class="jmap" style="display:none"></div></article>');
  };
  var jRow=jobRow; jobRow=function(p){
    var h=jRow(p);
    var btn = p.lat!=null ? '<button class="btn ghost small" data-pmap data-lat="'+p.lat+'" data-lng="'+p.lng+'" type="button">Show on map</button> ' : '';
    h=h.replace('<button class="btn small" data-act="complete"', btn+'<button class="btn small" data-act="complete"');
    return h.replace(/<\/article>$/,'<div class="jmap" style="display:none"></div></article>');
  };
  document.addEventListener("click",function(e){
    var b=e.target.closest("[data-pmap]"); if(!b) return;
    var el=b.parentNode.querySelector(".jmap"); if(!el) return;
    if(el.style.display==="block"){ el.style.display="none"; return; }
    el.style.display="block";
    if(el.dataset.ready) return;
    var lat=+b.dataset.lat, lng=+b.dataset.lng, approx=!!b.dataset.approx;
    loadLeaflet().then(function(){
      var map=L.map(el).setView([lat,lng],approx?14:17);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
      if(approx) L.circle([lat,lng],{radius:700,color:"#556b2f",fillOpacity:.2}).addTo(map).bindPopup("About 1 km area. The exact spot is shared after you accept.");
      else L.marker([lat,lng]).addTo(map).bindPopup("Customer's pickup spot").openPopup();
      if(session&&session.lat!=null){
        var me=[session.lat,session.lng];
        L.circleMarker(me,{radius:7,color:"#0e0d0a",fillColor:"#a3b85a",fillOpacity:1}).addTo(map).bindPopup("You are here");
        map.fitBounds([[lat,lng],me],{padding:[40,40],maxZoom:16});
      }
      el.dataset.ready="1"; setTimeout(function(){ map.invalidateSize(); },50);
    }).catch(function(){ el.style.display="none"; });
  });
})();